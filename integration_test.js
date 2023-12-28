import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% dari request harus selesai dalam waktu kurang dari 500ms
    },
};

const baseURL = 'https://reqres.in';

// Test Case 1: Create API Test
export function testCreateAPI() {
    const url = `${baseURL}/api/users`;
    const payload = {
        name: 'morpheus',
        job: 'leader',
    };

    const headers = {
        'Content-Type': 'application/json',
    };

    const response = http.post(url, JSON.stringify(payload), { headers: headers });

    check(response, {
        'Create API - Status 201': (r) => r.status === 201,
        'Create API - Response memiliki ID': (r) => r.json().hasOwnProperty('id'),
    });

    sleep(1); // Istirahat opsional untuk mensimulasikan skenario yang lebih realistis
}

// Test Case 2: Update API Test
export function testUpdateAPI() {
    const url = `${baseURL}/api/users/2`;
    const payload = {
        name: 'morpheus',
        job: 'zion resident',
    };

    const headers = {
        'Content-Type': 'application/json',
    };

    const response = http.put(url, JSON.stringify(payload), { headers: headers });

    check(response, {
        'Update API - Status 200': (r) => r.status === 200,
        'Update API - Berhasil Diperbarui': (r) => r.json().job === 'zion resident',
    });

    sleep(1); // Istirahat opsional untuk mensimulasikan skenario yang lebih realistis
}

export default function () {
  testCreateAPI();
  testUpdateAPI();
}