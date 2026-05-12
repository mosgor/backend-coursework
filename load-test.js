import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000']
  },
  noConnectionReuse: true,
};

export function setup() {
  http.get('http://localhost:8090/health', {
    headers: { 'Connection': 'close' }
  });
}

export default function () {
  const params = {
    headers: {
      'Connection': 'close',
      'Cache-Control': 'no-cache',
    },
  };

  const res = http.get('http://localhost:8090/events', params);
  
  check(res, { 
    'status is 200': (r) => r.status === 200
  });
  
  sleep(1);
}