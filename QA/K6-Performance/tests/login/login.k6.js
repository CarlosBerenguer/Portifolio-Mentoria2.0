import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
    //iterations: 10,
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95) < 3000'],
    },

    stages: [
        { duration: '10s', target: 10 }, // 10 users requesting for 10 seconds
        // { duration: '1m30s', target: 30 }, // 30 users requesting for 1m30sec
        // { duration: '10s', target: 0 },
    ],
    //vus: 10,
    // duration: '30s',
}

export default function () {
    const url = 'http://localhost:3000/api/auth/login'
    const payload = {
        usuario: 'carlos',
        senha: '123',
    }   
    const params = {
        headers: {
            'Content-Type': 'application/json',
        }      
    }
    
    const response = http.post(url, JSON.stringify(payload), params)

    check(response, {
        'status is 200': (r) => r.status === 200,
        'token is String': (r) => typeof(r.json().token) === 'string',
    })
    sleep(1)
}
