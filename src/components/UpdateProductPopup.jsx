import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Save, Loader2 } from 'lucide-react';
import { updateProduct } from '../utils/product';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function UpdateProductPopup({ isOpen, onClose, product }) {
    const queryClient = useQueryClient();
    const { register: updateProductForm, handleSubmit: productSubmit, formState: { errors: errorsProduct} } = useForm({
        values:{
            variant: product?.variant,
            price: product?.price,
            spice_level: product?.spice_level,
            description: product?.description,
            image_url: product?.image_url
        }
    });

    const mutation = useMutation({
        mutationFn: ({ id, data }) => updateProduct(id, data)
    });

    if (!isOpen) return null;

    const handleKirim = (dataProduct) => {
        toast.promise(
            new Promise((resolve, reject) => {
                mutation.mutate({ id: product.id, data: dataProduct }, {
                    onSuccess: (result) => {
                        queryClient.invalidateQueries({ queryKey: ['products'] })
                        setTimeout(() => onClose(), 500)
                        resolve(result)
                    },
                    onError: (error) => reject(error)
                })
            }),
            {
                loading: 'Updating...',
                success: (data) => data.message,
                error: (error) => error.message
            }
        )
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Update Product</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={productSubmit(handleKirim)} className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Variant (Nama Produk)</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            {...updateProductForm('variant', { required: 'Variant wajib diisi' })}
                        />
                        {errorsProduct.variant && <p className="absolute text-xs text-red-500">{errorsProduct.variant.message}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Harga (Rp)</label>
                            <input 
                                type="number" 
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                {...updateProductForm('price', { required: 'Harga wajib diisi'})}
                            />
                            {errorsProduct.price && <p className="absolute text-xs text-red-500">{errorsProduct.price.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Level Pedas (0-5)</label>
                            <input 
                                type="number" 
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                {...updateProductForm('spice_level', { required: 'Level pedas wajib diisi', min: { value: 0, message: 'Level pedas minimal 0' }, max: { value: 5, message: 'Level pedas maksimal 5' } })}
                            />
                            {errorsProduct.spice_level && <p className="absolute text-xs text-red-500">{errorsProduct.spice_level.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">URL Gambar</label>
                        <input 
                            type="url" 
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            {...updateProductForm('image_url', { required: 'URL gambar wajib diisi' })}
                        />
                        {errorsProduct.image_url && <p className="absolute text-xs text-red-500">{errorsProduct.image_url.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Deskripsi</label>
                        <textarea 
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                            {...updateProductForm('description', { required: 'Deskripsi wajib diisi' })}
                        ></textarea>
                        {errorsProduct.description && <p className="absolute text-xs text-red-500">{errorsProduct.description.message}</p>}
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
                            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>Simpan Perubahan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
