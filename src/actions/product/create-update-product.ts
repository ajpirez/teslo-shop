'use server'
import {z} from 'zod'
import {Gender, Size} from "@prisma/client";
import prisma from "@/lib/prisma";
import {Product} from "@/interfaces";
import {revalidatePath} from "next/cache";
import cloudinary from "@/lib/cloudinary";


const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    inStock: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender)
})
export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData)
    const productParsed = productSchema.safeParse(data)
    if (!productParsed.success) {
        console.log(productParsed.error)
        return {
            ok: false
        }
    }
    const product = productParsed.data
    product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim()

    const {id, ...productToSave} = product
    const tagsArray = productToSave.tags.split(',').map(tag => tag.trim())
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            let product: Product
            if (id) {
                //actualizar
                product = await tx.product.update({
                    where: {
                        id
                    },
                    data: {
                        ...productToSave,
                        sizes: {
                            set: productToSave.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })

            } else {
                //crear
                product = await tx.product.create({
                    data: {
                        ...productToSave,
                        sizes: {
                            set: productToSave.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            }
            // console.log({updatedProduct: product})
            if (formData.getAll('images')) {
                const images = await uploadImages(formData.getAll('images') as File[])
                if (!images) {
                    throw new Error('No se pudieron subir las imagenes')
                }
                await tx.productImage.createMany({
                    data: images.map((image, index) => ({
                        productId: product.id,
                        url: image!
                    }))
                })

            }


            return {
                product
            }
        })

        revalidatePath('/admin/products')
        revalidatePath(`/admin/product/${product.slug}`)
        revalidatePath(`/products/${product.slug}`)

        return {
            ok: true,
            product: prismaTx.product
        }

    } catch (error) {
        return {
            ok: false,
            message: 'Revisar los logs, no se pudo actualizar/crear'
        }
    }
}

const uploadImages = async (images: File[]) => {
    try {
        const uploadPromises = images.map(async (image) => {

            try {
                const buffer = await image.arrayBuffer()
                const base64Image = Buffer.from(buffer).toString('base64')
                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then(r => r.secure_url)
            } catch (error) {
                console.log(error)
                return null
            }
        })

        const uploadedImages = await Promise.all(uploadPromises)
        return uploadedImages

    } catch (error) {
        console.log(error)
        return null
    }
}