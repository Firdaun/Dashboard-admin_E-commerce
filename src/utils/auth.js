import { fetcher } from "./fetcher"

export const registerUser = async (data) => {
    const result = await fetcher('/users/register', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return result
}

export const verifyEmail = async (data) => {
    const result = await fetcher('/users/verify-email', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return result
}

export const login = async (data) => {
    const result = await fetcher('/users/login', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return result
}

export const resetPasswordRequest = async (data) => {
    const result = await fetcher('/users/reset-password/request', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return result
}

export const resetPassword = async (data) => {
    const result = await fetcher('/users/reset-password', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    return result
}