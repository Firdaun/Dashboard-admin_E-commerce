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

export const createProduct = async (data) => {
    const result = await fetcher('/products', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify(data)
    })
    return result
}

export const deleteProduct = async (id) => {
    const result = await fetcher(`/products/${id}`, {
        method: 'DELETE',
        requireAuth: true
    })
    return result
}