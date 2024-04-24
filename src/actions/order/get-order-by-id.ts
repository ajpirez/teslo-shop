'use server'
import prisma from "@/lib/prisma";
import {auth} from "@/auth.config";

export const getOrderById = async (id: string) => {


    const session = await auth()
    if (!session?.user) {
        return {
            ok: false,
            message: 'No hay usuario autenticado'
        }
    }
    try {

        const order = await prisma.order.findFirst({
            where: {
                id
            },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                      price: true,
                      quantity: true,
                      size: true,
                        product: {
                            select: {
                                title: true,
                                slug: true,
                                ProductImage:{
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    },
                }
            }
        })

        if(!order){
            throw `${id} no existe`
        }

        if(session.user.role === 'user'){
            if(session.user.id !== order.userId) {
                throw 'Acceso no autorizado'
            }
        }

        return {
            ok: true,
            order
        }

    } catch (error) {
        return {
            ok: false,
            message: error ?? 'Error al obtener la orden'
        }
    }
}