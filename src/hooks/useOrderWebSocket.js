import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useOrderWebSocket = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL
        
        const wsUrl = apiUrl ? new URL(apiUrl).origin.replace(/^http/, 'ws') + '/' : 'ws://localhost:8000/'
        
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
            console.log('🔗 WebSocket terhubung ke:', wsUrl)
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                
                if (data.type === 'NEW_ORDER') {
                    toast.success('Pesanan Baru!', {
                        description: data.message || 'Ada pesanan baru masuk.',
                        duration: 5000,
                    })

                    queryClient.invalidateQueries({ queryKey: ['orders'] })
                }
            } catch (error) {
                console.error('🚨 Gagal memproses pesan WebSocket:', error)
            }
        }

        ws.onerror = (error) => {
            console.error('🚨 WebSocket error:', error)
        }

        ws.onclose = () => {
            console.log('🔌 WebSocket terputus')
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close()
            }
        }
    }, [queryClient])
}
