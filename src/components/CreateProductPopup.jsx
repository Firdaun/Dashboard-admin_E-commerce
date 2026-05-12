import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Loader2 } from 'lucide-react';
import { createProduct } from '../utils/product';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function CreateProductPopup({ isOpen, onClose }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            variant: '',
            price: '',
            spice_level: '',
            description: '',
            image_url: ''
        }
    });

    const mutation = useMutation({
        mutationFn: (data) => createProduct(data)
    });

    if (!isOpen) return null;

    const handleKirim = (dataProduct) => {
        // Pastikan price dan spice_level dikirim sebagai number
        const payload = {
            ...dataProduct,
            price: Number(dataProduct.price),
            spice_level: Number(dataProduct.spice_level)
        };

        toast.promise(
            new Promise((resolve, reject) => {
                mutation.mutate(payload, {
                    onSuccess: (result) => {
                        queryClient.invalidateQueries({ queryKey: ['products'] })
                        reset()
                        setTimeout(() => onClose(), 500)
                        resolve(result)
                    },
                    onError: (error) => reject(error)
                })
            }),
            {
                loading: 'Menambahkan produk...',
                success: (data) => data.message || 'Produk berhasil ditambahkan!',
                error: (error) => error.message || 'Gagal menambahkan produk.'
            }
        )
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Tambah Produk Baru</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(handleKirim)} className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Variant (Nama Produk)</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="Contoh: Seblak Original"
                            {...register('variant', { required: 'Variant wajib diisi' })}
                        />
                        {errors.variant && <p className="text-xs text-red-500 mt-1">{errors.variant.message}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Harga (Rp)</label>
                            <input 
                                type="number" 
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="15000"
                                {...register('price', { required: 'Harga wajib diisi', min: { value: 1, message: 'Harga minimal 1' } })}
                            />
                            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Level Pedas (0-5)</label>
                            <input 
                                type="number" 
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="0"
                                {...register('spice_level', { required: 'Level pedas wajib diisi', min: { value: 0, message: 'Minimal 0' }, max: { value: 5, message: 'Maksimal 5' } })}
                            />
                            {errors.spice_level && <p className="text-xs text-red-500 mt-1">{errors.spice_level.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">URL Gambar</label>
                        <input 
                            type="url" 
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="https://example.com/gambar.jpg"
                            {...register('image_url', { required: 'URL gambar wajib diisi' })}
                        />
                        {errors.image_url && <p className="text-xs text-red-500 mt-1">{errors.image_url.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Deskripsi</label>
                        <textarea 
                            rows={3}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                            placeholder="Deskripsi singkat tentang produk..."
                            {...register('description')}
                        ></textarea>
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-gray-800">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-500/20"
                        >
                            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            <span>Tambah Produk</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
