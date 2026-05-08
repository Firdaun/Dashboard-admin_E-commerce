import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'
import { Search, Filter, Eye, CheckCircle2, Clock, Truck, XCircle, ChevronDown, CookingPot, Loader2 } from 'lucide-react'
import { getOrders, updateOrders } from '../utils/orders'
import { toast } from 'sonner'

const STATUS_LIST = ['Menunggu', 'Sedang Dimasak', 'Dikirim', 'Selesai', 'Dibatalkan']

function StatusDropdown({ currentStatus, orderId }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({ id, status }) => updateOrders(id, status),
    })

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleStatusChange = (newStatus) => {
        if (newStatus === currentStatus) {
            setIsOpen(false)
            return
        }
        toast.promise(
            new Promise((resolve, reject) => {
                mutation.mutate({
                    id: orderId,
                    status: newStatus
                }, {
                    onSuccess: (data) => {
                        queryClient.invalidateQueries({ queryKey: ['orders'] })
                        setIsOpen(false)
                        resolve(data)
                    },
                    onError: (error) => reject(error)
                })
            }),
            {
                loading: 'Memperbarui status...',
                success: (data) => data.message,
                error: (error) => error.message
            }
        )
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Selesai':
                return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <CheckCircle2 className="w-4 h-4" /> }
            case 'Sedang Dimasak':
                return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <CookingPot className="w-4 h-4" /> }
            case 'Dikirim':
                return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Truck className="w-4 h-4" /> }
            case 'Menunggu':
                return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Clock className="w-4 h-4" /> }
            case 'Dibatalkan':
                return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle className="w-4 h-4" /> }
            default:
                return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: <Clock className="w-4 h-4" /> }
        }
    }

    const currentStyle = getStatusStyle(currentStatus)

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                disabled={mutation.isPending}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 min-w-[180px] text-xs font-medium rounded-full border cursor-pointer transition-all hover:brightness-125 ${currentStyle.bg} ${currentStyle.color} ${currentStyle.border} ${mutation.isPending ? 'opacity-60' : ''}`}
            >
                {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    currentStyle.icon
                )}
                <span>{currentStatus}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl shadow-black/50 z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    {STATUS_LIST.map((status) => {
                        const style = getStatusStyle(status)
                        const isActive = status === currentStatus
                        return (
                            <button
                                key={status}
                                onClick={() => {
                                    handleStatusChange(status)
                                }}
                                className={` w-full whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors cursor-pointer ${isActive
                                        ? 'bg-gray-700/50 font-medium'
                                        : 'hover:bg-gray-700/40'
                                    } ${style.color}`}
                            >
                                {style.icon}
                                {status}
                                {isActive && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default function Orders() {
    const { data: orders, isLoading, isError } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 15
    })

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number)
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('id-ID', options)
    }

    return (
        <div className="h-full flex flex-col p-8 w-full bg-gray-950 text-white overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daftar Pesanan</h1>
                    <p className="text-gray-400 mt-1">Pantau dan kelola semua pesanan pelanggan yang masuk.</p>
                </div>
                {/* Optional: Export Button */}
                <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 px-5 py-2.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer shadow-lg shadow-black/20">
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari ID Pesanan atau Nama Pelanggan..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors placeholder-gray-500 text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                        <option value="">Semua Status</option>
                        <option value="Menunggu">Menunggu</option>
                        <option value="Sedang Dimasak">Sedang Dimasak</option>
                        <option value="Dikirim">Dikirim</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                    <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 px-4 py-2.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer">
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex-1 flex flex-col shadow-xl">
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead className="sticky top-0 z-10">
                            <tr className="border-b border-gray-800 bg-gray-900 shadow-sm">
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Order ID</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Tanggal</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Pelanggan</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Total</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="py-4 px-6"><div className="h-4 bg-gray-800 rounded w-24"></div></td>
                                        <td className="py-4 px-6"><div className="h-4 bg-gray-800 rounded w-28"></div></td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="h-4 bg-gray-800 rounded w-32"></div>
                                                <div className="h-3 bg-gray-800 rounded w-20"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6"><div className="h-4 bg-gray-800 rounded w-24"></div></td>
                                        <td className="py-4 px-6"><div className="h-6 bg-gray-800 rounded-full w-24"></div></td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end">
                                                <div className="h-8 bg-gray-800 rounded-lg w-20"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-red-400 bg-red-950/20">
                                        Gagal memuat data pesanan.
                                    </td>
                                </tr>
                            ) : orders?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">
                                        Belum ada pesanan yang masuk.
                                    </td>
                                </tr>
                            ) : (
                                orders?.map((order) => {
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-800/50 transition-colors group cursor-pointer">
                                            <td className="py-4 px-6">
                                                <span className="font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors">
                                                    #{order.id}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-400 text-sm">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-300 font-medium">{order.user?.name || order.username}</span>
                                                    <span className="text-xs text-gray-500">{order.orderItems?.length || 0} items</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-300 font-medium">
                                                {formatRupiah(order.total_price)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusDropdown currentStatus={order.status} orderId={order.id} />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium cursor-pointer" title="Lihat Detail">
                                                        <Eye className="w-4 h-4" />
                                                        Detail
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-800 p-4 flex items-center justify-between text-sm text-gray-400 bg-gray-900/80">
                    <span>Menampilkan {orders?.length || 0} pesanan</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-800 rounded hover:bg-gray-800 transition-colors disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border border-indigo-500 bg-indigo-500/20 text-indigo-400 rounded cursor-pointer">1</button>
                        <button className="px-3 py-1 border border-gray-800 rounded hover:bg-gray-800 transition-colors cursor-pointer">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
