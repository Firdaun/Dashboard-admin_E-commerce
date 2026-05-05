import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import MainAuth from './auth/MainAuth.jsx'
import { Toaster } from 'sonner'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error('🚨 GLOBAL ERROR TERDETEKSI:', error.message)
      console.error('🔍 Query Key yang bermasalah:', query.queryKey)
    }
  })
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-center" closeButton richColors theme="dark" />
        <Routes>
          <Route path='/' element={<App />}/>
          <Route path='/login' element={<MainAuth />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
