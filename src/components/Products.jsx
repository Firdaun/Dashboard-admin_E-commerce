import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Filter, Edit, Trash2, Flame, CheckCircle, XCircle } from 'lucide-react'
import { getProducts, updateProduct, deleteProduct } from '../utils/product'
import { toast } from 'sonner'
import UpdateProductPopup from './UpdateProductPopup'
import CreateProductPopup from './CreateProductPopup'

export default function Products() {
    const queryClient = useQueryClient();

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        product: null
    });
    const contextMenuRef = useRef(null);
    const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
    const [selectedProductToUpdate, setSelectedProductToUpdate] = useState(null);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setContextMenu(prev => ({ ...prev, visible: false }));
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleContextMenu = (e, product) => {
        e.preventDefault();
        
        const menuWidth = 220; 
        const menuHeight = 220;

        let x = e.clientX;
        let y = e.clientY;

        if (x + menuWidth > window.innerWidth) {
            x = x - menuWidth;
        }

        if (y + menuHeight > window.innerHeight) {
            y = y - menuHeight;
        }

        setContextMenu({
            visible: true,
            x,
            y,
            product
        });
    };

    const toggleAvailabilityMutation = useMutation({
        mutationFn: ({ id, is_available }) => updateProduct(id, { is_available }),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (error) => {
            console.error('Failed to toggle availability:', error);
            alert('Gagal mengubah ketersediaan produk.');
        }
    });

    const deleteProductMutation = useMutation({
        mutationFn: (id) => deleteProduct(id)
    });

    const handleDeleteProduct = (product) => {
        toast('Hapus produk "' + product.variant + '"?', {
            description: 'Produk yang sudah dihapus tidak dapat dikembalikan.',
            action: {
                label: 'Hapus',
                onClick: () => {
                    toast.promise(
                        new Promise((resolve, reject) => {
                            deleteProductMutation.mutate(product.id, {
                                onSuccess: (result) => {
                                    queryClient.invalidateQueries({ queryKey: ['products'] })
                                    resolve(result)
                                },
                                onError: (error) => reject(error)
                            })
                        }),
                        {
                            loading: 'Menghapus produk...',
                            success: (data) => data.message || 'Produk berhasil dihapus!',
                            error: (error) => error.message || 'Gagal menghapus produk.'
                        }
                    )
                }
            },
            cancel: {
                label: 'Batal'
            }
        })
    };

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
        staleTime: 1000 * 60 * 15,
        gcTime: 1000 * 60 * 30
    })

    const formatDate = (d) => {
        let now = new Date()
        let date = new Date(d)
        let secs = Math.floor((now - date) / 1000)
        let minute = 60
        let hour = 60 * minute
        let day = 24 * hour
        let month = 30 * day
        let minutes = Math.floor(secs / minute)
        let hours = Math.floor(secs / hour)
        let days = Math.floor(secs / day)
        switch (true) {
            case secs < minute:
                return 'Baru saja'
            case secs < hour:
                return `${minutes} menit yang lalu`
            case secs < day:
                return `${hours} jam yang lalu`
            case secs < month:
                return `${days} hari yang lalu`
            default:
                let res = new Date(d)
                    .toLocaleDateString(
                        'id-ID',
                        {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }
                    )
                return res
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
                <button 
                    onClick={() => setIsCreatePopupOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 shrink-0 cursor-pointer"
                >
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
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-800/50 transition-colors group cursor-context-menu"
                                        onContextMenu={(e) => handleContextMenu(e, product)}
                                    >
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

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    ref={contextMenuRef}
                    className="fixed z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-2 min-w-[220px]"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div className="px-4 py-2 border-b border-gray-800 mb-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi Produk</p>
                        <p className="text-sm font-medium text-gray-300 truncate mt-1">{contextMenu.product?.variant}</p>
                    </div>
                    <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        onClick={() => {
                            setSelectedProductToUpdate(contextMenu.product);
                            setIsUpdatePopupOpen(true);
                            setContextMenu(prev => ({ ...prev, visible: false }));
                        }}
                    >
                        <Edit className="w-4 h-4 text-indigo-400" />
                        Update Product
                    </button>
                    <button
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
                        disabled={toggleAvailabilityMutation.isPending}
                        onClick={() => {
                            toggleAvailabilityMutation.mutate({
                                id: contextMenu.product.id,
                                is_available: !contextMenu.product.is_available
                            });
                            setContextMenu(prev => ({ ...prev, visible: false }));
                        }}
                    >
                        {contextMenu.product?.is_available ? (
                            <><XCircle className="w-4 h-4 text-orange-400" /> Set Tidak Tersedia</>
                        ) : (
                            <><CheckCircle className="w-4 h-4 text-emerald-400" /> Set Tersedia</>
                        )}
                    </button>
                    <div className="h-px bg-gray-800 my-1"></div>
                    <button
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
                        disabled={deleteProductMutation.isPending}
                        onClick={() => {
                            handleDeleteProduct(contextMenu.product);
                            setContextMenu(prev => ({ ...prev, visible: false }));
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus Product
                    </button>
                </div>
            )}

            {/* Update Product Popup */}
            <UpdateProductPopup
                isOpen={isUpdatePopupOpen}
                onClose={() => setIsUpdatePopupOpen(false)}
                product={selectedProductToUpdate}
            />

            {/* Create Product Popup */}
            <CreateProductPopup
                isOpen={isCreatePopupOpen}
                onClose={() => setIsCreatePopupOpen(false)}
            />
        </div>
    )
}
