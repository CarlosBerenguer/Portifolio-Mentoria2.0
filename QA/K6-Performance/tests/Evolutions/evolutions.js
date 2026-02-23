import http from 'k6/http'
import { check, sleep } from 'k6'
import { getToken } from '../../helper/authentication.k6.js'

// Tornar base URL e ID configuráveis via environment
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const EVOLUCAO_ID = parseInt(__ENV.ID || '3', 10)

export const options = {
    vus:10,
    duration:'10s',
}
export default function () {
    const token = getToken()
    const url = `${BASE_URL}/api/evolucoes/${EVOLUCAO_ID}`
    const res = http.get(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    // Tentar parsear JSON com segurança
    const data = (() => { try { return res.json() } catch (e) { return null } })()

    check(res, {
        'status is 200': (r) => r.status === 200,
        'body not empty': (r) => !!r.body && r.body.length > 0,
        // Resposta pode ser o objeto da evolução OU { mensagem, evolucao: null }
        'has id or mensagem': () => data && (data.id !== undefined || data.mensagem !== undefined),
        'paciente_id = 5 ': () => data && data.paciente_id === 5,
    })
    sleep(1)
}
