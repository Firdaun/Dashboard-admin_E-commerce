import { Link } from "react-router"
import { Package, ShoppingCart, MoreHorizontal, LogIn } from "lucide-react"
import { getCurrentUser } from "../utils/user"
import { useQuery } from "@tanstack/react-query"

export default function Sidebar({ activeTab, setActiveTab }) {
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,
    })
    
    const listMenu = [
        {
            id: 1,
            name: 'Produk',
            icon: <Package className="w-5 h-5" />,
            active: 'products'
        },
        {
            id: 2,
            name: 'Orders',
            icon: <ShoppingCart className="w-5 h-5" />,
            active: 'orders'
        }
    ]

    return (
        <div className="h-screen bg-gray-950 w-[280px] p-5 flex flex-col justify-between border-r border-gray-800">
            <div>
                <div className="mb-10 px-2 mt-2">
                    <h1 className="text-2xl font-extrabold tracking-wider uppercase">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Dashboard
                        </span>
                        <br />
                        <span className="text-sm tracking-[0.2em] text-gray-400 font-medium">
                            Admin Panel
                        </span>
                    </h1>
                </div>

                <div className="flex flex-col space-y-2">
                    {listMenu.map((menu) => {
                        const isActive = activeTab === menu.active;
                        return (
                            <div 
                                key={menu.id}
                                onClick={() => setActiveTab(menu.active)}
                                className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors group ${
                                    isActive 
                                    ? 'bg-indigo-600/15 text-indigo-400 font-semibold' 
                                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                                }`}
                            >
                                <span className={`${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'} transition-colors`}>
                                    {menu.icon}
                                </span>
                                <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{menu.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto border-t border-gray-900 pt-5">
                {isLoading ? (
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse shrink-0"></div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="h-3.5 bg-gray-800 rounded animate-pulse w-24"></div>
                                <div className="h-2.5 bg-gray-800 rounded animate-pulse w-16"></div>
                            </div>
                        </div>
                    </div>
                ) : isError || !user ? (
                    <Link to="/login" className="flex items-center justify-center gap-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors w-full font-medium shadow-sm">
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                    </Link>
                ) : (
                    <div className="flex items-center justify-between p-2 hover:bg-gray-900 rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                                {user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-semibold text-gray-200 truncate">{user?.name || 'User'}</span>
                                <span className="text-xs text-gray-500 truncate">{user?.role.toLowerCase() || 'Guest'}</span>
                            </div>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 transition-colors shrink-0">
                            <MoreHorizontal className="w-4 h-4 text-gray-400 transition-colors" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}