import http from 'k6/http'
import { check, sleep } from 'k6'
import { getToken } from '../../helper/authentication.k6.js'

export const options = {
    //iterations: 10,
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95) < 3000'],
    },

    stages: [
        { duration: '5s', target: 10 }, // 10 users requesting for 5 seconds
        { duration: '20s', target: 30 }, // 30 users requesting for 20sec
        { duration: '10s', target: 0 }, // 0 users requesting for 10 seconds
    ],
    //vus: 10,
    // duration: '30s',
}

export default function () {
    const token = getToken()
    const url = 'http://localhost:3000/api/patients'
    const res = http.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
    check(res, {
        'status is 200': (r) => r.status === 200,
    })
    sleep(1)
}