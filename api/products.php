<?php
// CORS headers — allow the Vite dev server to call this API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

// Pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// Parse the ID from the query string: /api/products.php?id=5
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

// ──────────────────────────────────────────────────────────────
// READ — GET /api/products.php          → list all products
// READ — GET /api/products.php?id=5     → single product
// ──────────────────────────────────────────────────────────────
if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if (!$product) {
            http_response_code(404);
            echo json_encode(["error" => "Product not found"]);
            exit;
        }
        echo json_encode(castProduct($product));
    } else {
        $category = $_GET['category'] ?? '';
        $search   = $_GET['search']   ?? '';
        $sql      = "SELECT * FROM products WHERE 1=1";
        $params   = [];
        if ($category) {
            $sql     .= " AND category = ?";
            $params[] = $category;
        }
        if ($search) {
            $sql     .= " AND name LIKE ?";
            $params[] = "%$search%";
        }
        $sql .= " ORDER BY id DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        echo json_encode(array_map('castProduct', $rows));
    }
    exit;
}

// ──────────────────────────────────────────────────────────────
// CREATE — POST /api/products.php
// ──────────────────────────────────────────────────────────────
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || empty($data['name']) || empty($data['category'])) {
        http_response_code(400);
        echo json_encode(["error" => "Name and category are required"]);
        exit;
    }
    $stmt = $pdo->prepare("
        INSERT INTO products (name, category, price, description, in_stock, stock_count, requires_prescription, image_url)
        VALUES (:name, :category, :price, :description, :in_stock, :stock_count, :requires_prescription, :image_url)
    ");
    $stmt->execute([
        ':name'                  => trim($data['name']),
        ':category'              => $data['category'],
        ':price'                 => (float)($data['price'] ?? 0),
        ':description'           => trim($data['description'] ?? ''),
        ':in_stock'              => (int)(bool)($data['in_stock'] ?? true),
        ':stock_count'           => (int)($data['stock_count'] ?? 0),
        ':requires_prescription' => (int)(bool)($data['requires_prescription'] ?? false),
        ':image_url'             => trim($data['image_url'] ?? ''),
    ]);
    $newId   = $pdo->lastInsertId();
    $created = $pdo->query("SELECT * FROM products WHERE id = $newId")->fetch();
    http_response_code(201);
    echo json_encode(castProduct($created));
    exit;
}

// ──────────────────────────────────────────────────────────────
// UPDATE — PUT /api/products.php?id=5
// ──────────────────────────────────────────────────────────────
if ($method === 'PUT') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID is required"]);
        exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON body"]);
        exit;
    }
    $stmt = $pdo->prepare("
        UPDATE products
        SET name = :name,
            category = :category,
            price = :price,
            description = :description,
            in_stock = :in_stock,
            stock_count = :stock_count,
            requires_prescription = :requires_prescription,
            image_url = :image_url
        WHERE id = :id
    ");
    $stmt->execute([
        ':name'                  => trim($data['name']),
        ':category'              => $data['category'],
        ':price'                 => (float)($data['price'] ?? 0),
        ':description'           => trim($data['description'] ?? ''),
        ':in_stock'              => (int)(bool)($data['in_stock'] ?? true),
        ':stock_count'           => (int)($data['stock_count'] ?? 0),
        ':requires_prescription' => (int)(bool)($data['requires_prescription'] ?? false),
        ':image_url'             => trim($data['image_url'] ?? ''),
        ':id'                    => $id,
    ]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Product not found"]);
        exit;
    }
    $updated = $pdo->query("SELECT * FROM products WHERE id = $id")->fetch();
    echo json_encode(castProduct($updated));
    exit;
}

// ──────────────────────────────────────────────────────────────
// DELETE — DELETE /api/products.php?id=5
// ──────────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID is required"]);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Product not found"]);
        exit;
    }
    echo json_encode(["message" => "Product deleted successfully", "id" => $id]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);

// Helper: cast integer fields from SQLite strings to proper PHP types
function castProduct(array $row): array {
    $row['id']                     = (int)$row['id'];
    $row['price']                  = (float)$row['price'];
    $row['in_stock']               = (bool)$row['in_stock'];
    $row['stock_count']            = (int)$row['stock_count'];
    $row['requires_prescription']  = (bool)$row['requires_prescription'];
    return $row;
}
