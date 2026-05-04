import { fetcher } from "./fetcher"

export const registerUser = async (data) => {
    return await fetcher('/users/register', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export const verifyEmail = async (data) => {
    return await fetcher('/users/verify-email', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export const login = async (data) => {
    return await fetcher('/users/login', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export const resetPasswordRequest = async (data) => {
    return await fetcher('/users/reset-password/request', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export const resetPassword = async (data) => {
    return await fetcher('/users/reset-password', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}