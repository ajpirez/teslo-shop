'use server'
import {auth} from "@/auth.config";
import prisma from "@/lib/prisma";



interface PaginationOptions{
    page?: number
    take?: number
}
export const getPaginatedOrders = async ({page = 1,take = 12}:PaginationOptions)=>{
    const session = await auth()
    if(session?.user.role !== 'admin'){
        return{
            ok: false,
            message: 'Debe estar autenticado.'
        }
    }

    if(isNaN(Number(page))) page = 1
    if(page < 1) page = 1
    if(isNaN(Number(take))) take = 12

   try {
       const [orders, totalCount] = await Promise.all([
           prisma.order.findMany({
               orderBy:{
                   createAt: 'desc'
               },
               take,
               skip: (page - 1) * take,
               include:{
                   OrderAddress:{
                       select:{
                           firstName:true,
                           lastName: true
                       }
                   }
               }
           }),
           prisma.order.count()
       ])
       // console.log(require('util').inspect(products, { showHidden: false, depth: null, colors: true }));
       return {
           ok: true,
           currentPage: page,
           totalPages: Math.ceil(totalCount / take),
           orders
       }
   } catch (error){
       throw new Error('No se pudo cargar las ordenes')
   }
}