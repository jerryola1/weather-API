<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$rapidApiKey = getenv('RAPIDAPI_KEY');
$input = $_GET['input'] ?? '';

if (strlen($input) < 3) {
    echo json_encode([]);
    exit;
}

$url = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=" . urlencode($input) . "&limit=5&sort=-population";

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Host: wft-geo-db.p.rapidapi.com",
        "X-RapidAPI-Key: $rapidApiKey"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo json_encode(['error' => $err]);
} else {
    echo $response;
}
