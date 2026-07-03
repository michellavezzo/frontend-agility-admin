const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export function websocketUrl(path: string): string {
    const base = new URL(BASE_URL, window.location.origin)
    base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:'
    base.pathname = `${base.pathname.replace(/\/$/, '')}${path}`
    base.search = ''
    base.hash = ''
    return base.toString()
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${path}`
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers }

    const res = await fetch(url, { ...options, headers })

    if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status}: ${body || res.statusText}`)
    }

    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return undefined as T
    }

    return res.json() as Promise<T>
}

export const api = {
    get<T>(path: string) {
        return request<T>(path)
    },

    post<T>(path: string, body: unknown) {
        return request<T>(path, { method: 'POST', body: JSON.stringify(body) })
    },

    put<T>(path: string, body: unknown) {
        return request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
    },

    delete<T = void>(path: string) {
        return request<T>(path, { method: 'DELETE' })
    },
}
