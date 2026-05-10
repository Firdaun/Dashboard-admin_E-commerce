import { fetcher } from "./fetcher"

export const getProducts = async () => {
    const result = await fetcher('/products', {
        method: 'GET'
    })
    return result.data
}

export const updateProduct = async (id, data) => {
    const result = await fetcher(`/products/${id}`, {
        method: 'PUT',
        requireAuth: true,
        body: JSON.stringify(data)
    })
    return result
}