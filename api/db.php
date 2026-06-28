<?php
function getDB(): PDO {
    $dbPath = __DIR__ . '/pharmacy.db';
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Create table if it doesn't exist (equivalent to MySQL CREATE TABLE)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            name      TEXT    NOT NULL,
            category  TEXT    NOT NULL,
            price     REAL    NOT NULL,
            description TEXT  NOT NULL DEFAULT '',
            in_stock  INTEGER NOT NULL DEFAULT 1,
            stock_count INTEGER NOT NULL DEFAULT 0,
            requires_prescription INTEGER NOT NULL DEFAULT 0,
            image_url TEXT    NOT NULL DEFAULT '',
            created_at TEXT   NOT NULL DEFAULT (datetime('now'))
        )
    ");

    // Seed with sample data if empty
    $count = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    if ((int)$count === 0) {
        $seeds = [
            ["Amoxicillin 500mg",        "Prescription",      15.99, "Broad-spectrum penicillin antibiotic used to treat various bacterial infections.",                        1, 50,  1, "https://picsum.photos/seed/med1/400/400"],
            ["Lisinopril 10mg",           "Prescription",      12.50, "ACE inhibitor used to treat high blood pressure and heart failure.",                                       1, 30,  1, "https://picsum.photos/seed/med2/400/400"],
            ["Ibuprofen 400mg",           "OTC",                8.99, "Nonsteroidal anti-inflammatory drug (NSAID) for pain relief and fever reduction.",                         1, 120, 0, "https://picsum.photos/seed/med3/400/400"],
            ["Loratadine 10mg",           "OTC",                7.50, "Antihistamine that reduces the effects of natural chemical histamine in the body.",                         1, 80,  0, "https://picsum.photos/seed/med4/400/400"],
            ["Vitamin D3 2000IU",         "Wellness",           9.99, "Essential vitamin supplement supporting bone health, immunity, and mood regulation.",                        1, 200, 0, "https://picsum.photos/seed/med5/400/400"],
            ["Omega-3 Fish Oil",          "Wellness",          14.99, "High-potency omega-3 fatty acid supplement for cardiovascular and brain health.",                           1, 150, 0, "https://picsum.photos/seed/med6/400/400"],
            ["Blood Pressure Monitor",    "Medical Equipment", 45.99, "Automatic upper arm blood pressure monitor with large display and memory storage.",                          1, 20,  0, "https://picsum.photos/seed/med7/400/400"],
            ["Metformin 500mg",           "Prescription",      10.00, "First-line medication for treatment of type 2 diabetes.",                                                   1, 60,  1, "https://picsum.photos/seed/med8/400/400"],
            ["Paracetamol 500mg",         "OTC",                5.99, "Analgesic and antipyretic for mild to moderate pain and fever.",                                            1, 300, 0, "https://picsum.photos/seed/med9/400/400"],
            ["Digital Thermometer",       "Medical Equipment", 12.99, "Fast and accurate digital thermometer for oral, rectal, or axillary temperature measurement.",              1, 45,  0, "https://picsum.photos/seed/med10/400/400"],
        ];
        $stmt = $pdo->prepare("
            INSERT INTO products (name, category, price, description, in_stock, stock_count, requires_prescription, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($seeds as $row) {
            $stmt->execute($row);
        }
    }

    return $pdo;
}
