<?php

define('COCKPIT_API_URL', 'http://localhost:8888/cockpit-core/api/');
define('COCKPIT_API_TOKEN', 'USR-b29b5c88b4490e79305a4526a213ee4ef9788415');



// En-têtes standard pour POST JSON à Cockpit
function cockpitHeaders() {
    return [
        'http' => [
            'header' => implode("\r\n", [
                "Content-Type: application/json",
                "Authorization: Bearer " . COCKPIT_API_TOKEN
            ]),
            'ignore_errors' => true
        ]
    ];
}


session_start();

function checkAdmin() {
    if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
        header('Location: admin-login?error=unauthorized');
        exit;
    }
}

function apiGetItems(string $collection): array {
    $url = COCKPIT_API_URL . "content/items/$collection";
    $token = COCKPIT_API_TOKEN;

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            "Authorization: Bearer $token"
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([]) // no filter = fetch all
    ]);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        curl_close($ch);
        return [];
    }

    $data = json_decode($response, true);
    curl_close($ch);

    return $data['entries'] ?? [];
}
