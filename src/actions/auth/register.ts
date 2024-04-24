'use server'

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const registerUser = async (name:string, email:string, password:string) => {
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: await bcryptjs.hash(password, 10),
            },
            select:{
                id: true,
                name: true,
                email: true
            }
        })
        return {
            ok: true,
            user,
            message: 'Usuario creado correctamente.'
        }
    }catch (error){
        return{
            ok:false,
            message: "No se pudo crear el usuario."
        }
    }
}