import { fetcher } from "./fetcher"

export const getOrders = async () => {
    const result = await fetcher('/admin/orders', {
        method: 'GET',
        requireAuth: true
    })
    return result.data
}

export const updateOrders = async (id, status) => {
    const result = await fetcher(`/admin/orders/${id}/status`, {
        method: 'PUT',
        requireAuth: true,
        body: JSON.stringify({ status })
    })
    return result
}