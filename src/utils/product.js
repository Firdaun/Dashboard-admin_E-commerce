import { fetcher } from "./fetcher"

export const getProducts = async () => {
    const result = await fetcher('/products', {
        method: 'GET'
    })
    return result.data
}