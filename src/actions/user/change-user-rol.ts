'use server'
import {auth} from "@/auth.config";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export const changeUserRole = async (userId:string, role: 'admin' | 'user')=>{

    const session = await auth()
    if(session?.user.role !== 'admin'){
        return{
            ok:false,
            message:'Debe ser un usuario administrador'
        }
    }
    try {

        const user = await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                role
            }
        })
        revalidatePath('/admin/users')
        return{
            ok:true,
        }

    }catch (error){
        console.log(error)
        return{
            ok:false,
            message:'Error al cambiar el rol'
        }
    }
}