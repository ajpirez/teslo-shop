'use server'

import prisma from "@/lib/prisma";
import {Gender} from "@prisma/client";

interface PaginationOptions{
    page?: number
    take?: number
    gender?: Gender
}

export const getPaginatedProductsWithImages = async ({page = 1,take = 12,gender}: PaginationOptions) => {
    if(isNaN(Number(page))) page = 1
    if(page < 1) page = 1
    if(isNaN(Number(take))) take = 12
    try {
        // 1. Ontener los productos
        // 2. Obtener el total de pages
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                take,
                skip: (page - 1) * take,
                include: {
                    ProductImage: {
                        take: 2,
                        select: {
                            url: true
                        }
                    }
                },
                ...(gender && {where: {gender}})
            }),
            prisma.product.count({
                ...(gender && {where: {gender}})
            })
        ])
        // console.log(require('util').inspect(products, { showHidden: false, depth: null, colors: true }));
        return {
            currentPage: page,
            totalPages: Math.ceil(totalCount / take),
            products: products.map(product => ({
                ...product,
                images: product.ProductImage.map(image => image.url)
            }))
        }
    } catch (error) {
        throw new Error('No se pudo cargar los productos')
    }
}