import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Filter, Edit, Trash2, Flame } from 'lucide-react'
import { getProducts } from '../utils/product'

export default function Products() {
    
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
        staleTime: 1000 * 60 * 15,
        gcTime: 1000 * 60 * 30
    })

    const formatDate = (dateString) => {
        const now = new Date()
        const date = new Date(dateString)
        const diffInSeconds = Math.floor((now - date) / 1000)

        const minute = 60
        const hour = 60 * minute
        const day = 24 * hour
        const month = 30 * day

        switch (true) {
            case diffInSeconds < minute:
                return 'Baru saja'
            case diffInSeconds < hour:
                return `${Math.floor(diffInSeconds / minute)} menit yang lalu`
            case diffInSeconds < day:
                return `${Math.floor(diffInSeconds / hour)} jam yang lalu`
            case diffInSeconds < month:
                return `${Math.floor(diffInSeconds / day)} hari yang lalu`
            default:
                return new Date(dateString).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                })
        }
    }

    return (
        <div className="h-full flex flex-col p-8 w-full bg-gray-950 text-white overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-gray-400 mt-1">Kelola katalog produk, harga, dan ketersediaan barang.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 shrink-0 cursor-pointer">
                    <Plus className="w-5 h-5" />
                    <span>Tambah Produk</span>
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Cari varian produk..." 
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors placeholder-gray-500 text-white"
                    />
                </div>
                <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 px-4 py-2.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer">
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex-1 flex flex-col shadow-xl">
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead className="sticky top-0 z-10">
                            <tr className="border-b border-gray-800 bg-gray-900 shadow-sm">
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Produk</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider w-1/3">Deskripsi</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Level Pedas</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Harga</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider text-right">Waktu dibuat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-800 shrink-0"></div>
                                                <div className="flex flex-col gap-2 w-32">
                                                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                                                    <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6"><div className="h-4 bg-gray-800 rounded w-full"></div></td>
                                        <td className="py-4 px-6"><div className="h-4 bg-gray-800 rounded w-16"></div></td>
                                        <td className="py-4 px-6"><div className="h-4 bg-gray-800 rounded w-24"></div></td>
                                        <td className="py-4 px-6"><div className="h-6 bg-gray-800 rounded-full w-20"></div></td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end gap-2">
                                                <div className="w-8 h-8 bg-gray-800 rounded-lg"></div>
                                                <div className="w-8 h-8 bg-gray-800 rounded-lg"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-red-400 bg-red-950/20">
                                        Gagal memuat data produk.
                                    </td>
                                </tr>
                            ) : products?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">
                                        Belum ada produk yang ditambahkan.
                                    </td>
                                </tr>
                            ) : (
                                products?.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-800/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden border border-gray-700 shrink-0">
                                                    <img src={product.image_url} alt={product.variant} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors">{product.variant}</span>
                                                    <span className="text-xs text-gray-500">ID: {product.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-sm">
                                            <span title='description'>
                                                {product.description ? product.description.substring(0, 50) + (product.description.length > 50 ? '...' : '') : 'Tidak ada deskripsi'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-300">
                                            <div className="flex items-center gap-1 text-orange-500">
                                                <Flame className="w-4 h-4" />
                                                <span className="font-medium">Lv. {product.spice_level}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-300 font-medium">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${product.is_available ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {product.is_available ? 'Tersedia' : 'Habis'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {formatDate(product.createdAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="border-t border-gray-800 p-4 flex items-center justify-between text-sm text-gray-400 bg-gray-900/80">
                    <span>Menampilkan {products?.length || 0} produk</span>
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
