<?php
// ── CORS ─────────────────────────────────────────────────────────
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/db.php';

$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ════════════════════════════════════════════════════════════════
// POST /api/auth.php?action=register
// Body: { name, email, password }
// Creates a new customer account and immediately opens a session.
// ════════════════════════════════════════════════════════════════
if ($method === 'POST' && $action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);

    $name     = trim($data['name']     ?? '');
    $email    = strtolower(trim($data['email']    ?? ''));
    $password = $data['password'] ?? '';

    // Validate inputs
    $errors = [];
    if (strlen($name) < 2)              $errors[] = 'Name must be at least 2 characters.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid email address is required.';
    if (strlen($password) < 6)          $errors[] = 'Password must be at least 6 characters.';

    if ($errors) {
        http_response_code(422);
        echo json_encode(['error' => implode(' ', $errors)]);
        exit;
    }

    // Check email is not already taken
    $exists = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $exists->execute([$email]);
    if ($exists->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'An account with that email already exists. Please sign in instead.']);
        exit;
    }

    // Create user
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password_hash, role)
        VALUES (?, ?, ?, 'customer')
    ");
    $stmt->execute([$name, $email, password_hash($password, PASSWORD_BCRYPT)]);
    $userId = (int)$pdo->lastInsertId();

    // Open session
    $token  = generateToken();
    $expiry = date('Y-m-d H:i:s', strtotime('+7 days'));
    $pdo->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)")
        ->execute([$userId, $token, $expiry]);

    http_response_code(201);
    echo json_encode([
        'token' => $token,
        'user'  => ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => 'customer'],
    ]);
    exit;
}

// ════════════════════════════════════════════════════════════════
// POST /api/auth.php?action=login
// Body: { email, password }
// Validates credentials and returns a session token.
// ════════════════════════════════════════════════════════════════
if ($method === 'POST' && $action === 'login') {
    $data     = json_decode(file_get_contents('php://input'), true);
    $email    = strtolower(trim($data['email']    ?? ''));
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required.']);
        exit;
    }

    // Fetch user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Validate password — same response for wrong email or wrong password (security)
    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password. Please try again.']);
        exit;
    }

    // Clean up any expired sessions for this user
    $pdo->prepare("DELETE FROM sessions WHERE user_id = ? AND expires_at <= datetime('now')")
        ->execute([$user['id']]);

    // Create new session (7-day expiry)
    $token  = generateToken();
    $expiry = date('Y-m-d H:i:s', strtotime('+7 days'));
    $pdo->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)")
        ->execute([$user['id'], $token, $expiry]);

    echo json_encode([
        'token' => $token,
        'user'  => [
            'id'    => (int)$user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ],
    ]);
    exit;
}

// ════════════════════════════════════════════════════════════════
// DELETE /api/auth.php?action=logout
// Header: Authorization: Bearer <token>
// Deletes the session from the database.
// ════════════════════════════════════════════════════════════════
if ($method === 'DELETE' && $action === 'logout') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token      = str_replace('Bearer ', '', $authHeader);

    if ($token) {
        $pdo->prepare("DELETE FROM sessions WHERE token = ?")
            ->execute([$token]);
    }

    echo json_encode(['message' => 'Logged out successfully.']);
    exit;
}

// ════════════════════════════════════════════════════════════════
// GET /api/auth.php?action=validate
// Header: Authorization: Bearer <token>
// Returns the user if the session is valid; 401 otherwise.
// ════════════════════════════════════════════════════════════════
if ($method === 'GET' && $action === 'validate') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token      = str_replace('Bearer ', '', $authHeader);

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided.']);
        exit;
    }

    $user = getUserFromToken($pdo, $token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Session expired or invalid. Please sign in again.']);
        exit;
    }

    echo json_encode(['user' => $user]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown action. Use: login, register, logout, or validate.']);
