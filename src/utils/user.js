import { fetcher } from "./fetcher"

export const getCurrentUser = async () => {
    const result = await fetcher('/users/current', {
        method: 'GET',
        requireAuth: true
    })
    return result.data
}