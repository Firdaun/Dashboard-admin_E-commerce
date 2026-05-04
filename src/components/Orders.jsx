import { Search, Filter, Eye, MoreHorizontal, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

export default function Orders() {
    // Mock Data untuk UI
    const mockOrders = [
        {
            id: "ORD-2026-001",
            customer: "Budi Santoso",
            date: "2026-05-04",
            total: 1450000,
            status: "Completed",
            items: 3
        },
        {
            id: "ORD-2026-002",
            customer: "Siti Aminah",
            date: "2026-05-04",
            total: 250000,
            status: "Processing",
            items: 1
        },
        {
            id: "ORD-2026-003",
            customer: "Ahmad Rizky",
            date: "2026-05-03",
            total: 3200000,
            status: "Shipped",
            items: 4
        },
        {
            id: "ORD-2026-004",
            customer: "Dewi Lestari",
            date: "2026-05-03",
            total: 120000,
            status: "Pending",
            items: 2
        },
        {
            id: "ORD-2026-005",
            customer: "Rangga Pratama",
            date: "2026-05-02",
            total: 5500000,
            status: "Cancelled",
            items: 1
        }
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Completed': 
                return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <CheckCircle2 className="w-4 h-4" /> };
            case 'Processing': 
                return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Clock className="w-4 h-4" /> };
            case 'Shipped': 
                return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Truck className="w-4 h-4" /> };
            case 'Pending': 
                return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Clock className="w-4 h-4" /> };
            case 'Cancelled': 
                return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle className="w-4 h-4" /> };
            default: 
                return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: <Clock className="w-4 h-4" /> };
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

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
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 px-4 py-2.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer">
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex-1 flex flex-col shadow-xl">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-800 bg-gray-900/50">
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Order ID</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Tanggal</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Pelanggan</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Total</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {mockOrders.map((order) => {
                                const statusStyle = getStatusStyle(order.status);
                                return (
                                    <tr key={order.id} className="hover:bg-gray-800/50 transition-colors group cursor-pointer">
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors">
                                                {order.id}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-sm">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-gray-300 font-medium">{order.customer}</span>
                                                <span className="text-xs text-gray-500">{order.items} items</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-300 font-medium">
                                            {formatRupiah(order.total)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>
                                                {statusStyle.icon}
                                                <span>{order.status}</span>
                                            </div>
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Mock) */}
                <div className="border-t border-gray-800 p-4 flex items-center justify-between text-sm text-gray-400 bg-gray-900/80">
                    <span>Menampilkan 1 hingga 5 dari 142 pesanan</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-800 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-not-allowed" disabled>Prev</button>
                        <button className="px-3 py-1 border border-indigo-500 bg-indigo-500/20 text-indigo-400 rounded cursor-pointer">1</button>
                        <button className="px-3 py-1 border border-gray-800 rounded hover:bg-gray-800 transition-colors cursor-pointer">2</button>
                        <button className="px-3 py-1 border border-gray-800 rounded hover:bg-gray-800 transition-colors cursor-pointer">3</button>
                        <button className="px-3 py-1 border border-gray-800 rounded hover:bg-gray-800 transition-colors cursor-pointer">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
