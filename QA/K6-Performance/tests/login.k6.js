import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
    iterations: 10
    // vus: 10,
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
        },
    }
    
    const response = http.post(url, JSON.stringify(payload), params)

    check(response, {
        'status is 200': (r) => r.status === 200,
        'token is String': (r) => typeof(r.json().token) === 'string',
    })
    sleep(1)
}
