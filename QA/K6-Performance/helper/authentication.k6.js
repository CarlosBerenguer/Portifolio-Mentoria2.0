import http from 'k6/http'
export function getToken() {
    const url = 'http://localhost:3000/api/auth/login'
    const payload = {
        usuario: 'carlos',
        senha: '123',
    }
    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = http.post(url, JSON.stringify(payload), params)

    return response.json("token")

}