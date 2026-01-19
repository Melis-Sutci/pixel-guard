const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function fetchDevices(platform = 'android') {
    const response = await fetch(`${API_BASE_URL}/devices?platform=${platform}`);
    return await response.json();
}

async function filterDevices(filterData) {
    const response = await fetch(`${API_BASE_URL}/devices/filter`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filterData)
    });
    return await response.json();
}

async function parseFigmaUrl(figmaUrl, token = null) {
    const response = await fetch(`${API_BASE_URL}/figma/parse-url`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url: figmaUrl, access_token: token})
    });
    return await response.json();
}
