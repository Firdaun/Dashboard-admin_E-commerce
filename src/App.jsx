import Sidebar from "./components/Sidebar";
import { useState } from "react";
import Products from "./components/Products";
import Orders from "./components/Orders";
import { useOrderWebSocket } from "./hooks/useOrderWebSocket";

export default function App() {
    const [activeTab, setActiveTab] = useState('products')
    
    useOrderWebSocket()

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <Products />
            case 'orders':
                return <Orders />
            default:
                return <Products />
        }
    }

    return (
        <div className="bg-gray-950 h-screen flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderContent()}
        </div>
    )
}