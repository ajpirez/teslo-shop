'use server'
import {auth} from "@/auth.config";
import prisma from "@/lib/prisma";

interface PaginationOptions{
    page?: number
    take?: number
}
export const getPaginatedUsers = async ({page = 1,take = 12}:PaginationOptions) => {
    const session = await auth()
    if(session?.user.role !== 'admin'){
        return{
            ok:false,
            message:'Debe ser un usuario administrador'
        }
    }
    if(isNaN(Number(page))) page = 1
    if(page < 1) page = 1
    if(isNaN(Number(take))) take = 12

    try {
        const [users, totalCount] = await Promise.all([
            prisma.user.findMany({
                orderBy:{
                    name: 'desc'
                },
                take,
                skip: (page - 1) * take,
            }),
            prisma.user.count()
        ])
        return {
            ok: true,
            currentPage: page,
            totalPages: Math.ceil(totalCount / take),
            users
        }
    }catch (error){
        throw new Error('No se pudo cargar las ordenes')
    }
}