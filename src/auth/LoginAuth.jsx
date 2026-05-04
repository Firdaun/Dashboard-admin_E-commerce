import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { login } from "../utils/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

export default function LoginAuth() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { register: loginForm, handleSubmit: loginSubmit, formState: { errors: errorsLogin } } = useForm({
        values: {
            email: '',
            password: ''
        }
    })

    const loginAPi = useMutation({
        mutationFn: login
    })

    const Submit = (formLogin) => {
        const { remember, ...loginPayload } = formLogin

        toast.promise(
            new Promise((resolve, reject) => {
                loginAPi.mutate(loginPayload, {
                    onSuccess: (result) => {
                        localStorage.setItem('token', result.data.token)
                        queryClient.invalidateQueries({ queryKey: ['user'] })
                        setTimeout(() => navigate('/'), 300)
                        resolve(result)
                    },
                    onError: (error) => reject(error)
                })
            }),
            {
                loading: 'Memverifikasi...',
                success: (data) => data.message,
                error: (e) => e.message
            }
        )
    }

    return (
        <div className="w-[450px] flex flex-col justify-center">

            <div className="md:hidden mb-12">
                <h2 className="text-xl font-bold tracking-widest text-white uppercase mb-4">App_Name</h2>
                <h1 className="text-4xl font-bold text-white">Log in</h1>
            </div>

            <div className="hidden md:block mb-12">
                <h2 className="text-3xl font-semibold text-white">Log in</h2>
                <p className="text-gray-500 mt-2">Masukkan detail akun untuk melanjutkan.</p>
            </div>

            <form onSubmit={loginSubmit(Submit)} className="space-y-8">
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="nama@email.com"
                        {...loginForm('email', { required: 'Email wajib diisi' })}
                    />
                    {errorsLogin.email && <p className="absolute text-xs text-red-500">{errorsLogin.email.message}</p>}
                </div>

                <div className="relative">
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-medium text-gray-400" htmlFor="password">
                            Password
                        </label>
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                            Lupa sandi?
                        </a>
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                        {...loginForm('password', { required: 'Password wajib diisi' })}
                    />
                    {errorsLogin.password && <p className="absolute text-xs text-red-500">{errorsLogin.password.message}</p>}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full text-white bg-gray-900 font-bold py-4 px-4 rounded-none transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-950"
                    >
                        Masuk Sekarang
                    </button>
                </div>
            </form>

            <div className="mt-16 border-t border-gray-800/60 pt-6">
                <p className="text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <a href="#" className="text-white border-b border-white hover:text-gray-300 transition-colors pb-0.5">
                        Buat akun baru
                    </a>
                </p>
            </div>

        </div>
    );
}