const BASE_URL = import.meta.env.VITE_API_URL

export const fetcher = async ( endpoint, options = {}) => {
    const { requireAuth = false, ...fetchOptions } = options

    const headers = {
        'Content-Type': 'application/json',
        ...options.header,
    }

    if (requireAuth) {
        const token = localStorage.getItem('token')
        if(!token) {
            throw new Error("Unauthorized")
        }
        headers['x-api-key'] = `Bearer ${token}`
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...fetchOptions,
            headers: headers
        })

        const res = await response.json()

        if (!response.ok) {
            if (requireAuth && response.status === 401) {
                localStorage.removeItem('token')
                sessionStorage.removeItem('token')
                window.location.href = '/login'
            }
            throw new Error(res.errors || res.message || "Terjadi kesalahan pada server")
        }

        return res
    } catch (e) {
        console.error(`🚨 Fetch Error (${endpoint}):`, e.message)
        throw e
    }
}