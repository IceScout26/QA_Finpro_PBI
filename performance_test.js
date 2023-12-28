import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import http from 'k6/http';
import { check, sleep } from 'k6';

export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

export const options = {
  vus: 1000,
  iterations: 3500,
  thresholds: {
    'http_req_duration': ['p(95)<2000'], // 95% dari respons harus di bawah 2 detik
  },
};

export function testCreateAPI() {
  const url = 'https://reqres.in/api/users';
  const payload = {
    name: 'morpheus',
    job: 'leader',
  };
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, JSON.stringify(payload), params);

  check(res, {
    'Create API - is status 201': (r) => r.status === 201,
    'Create API - response time is OK': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}

export function testUpdateAPI() {
  const url = 'https://reqres.in/api/users/2';
  const payload = {
    name: 'morpheus',
    job: 'zion resident',
  };
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.put(url, JSON.stringify(payload), params);

  check(res, {
    'Update API - is status 200': (r) => r.status === 200,
    'Update API - response time is OK': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}

export default function () {
  testCreateAPI();
  testUpdateAPI();
}
