'use server'


import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            error: 'No se pueden borrar imagenes de FS'
        }
    }
    const imageName = imageUrl
        .split('/')
        .pop()
        ?.split('.')[0] ?? ''
    console.log(imageName)
    try {
        const [, deleteImage] = await Promise.all([
            cloudinary.uploader.destroy(imageName),
            prisma.productImage.delete(
                {
                    where: {
                        id: imageId
                    },
                    select: {
                        product: {
                            select: {
                                slug: true
                            }
                        }
                    }
                })
        ])

        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/product/${deleteImage.product.slug}`)
        revalidatePath(`/product/${deleteImage.product.slug}`)

        return {}
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            error: 'No se pudo borrar la imagen'
        }
    }

}