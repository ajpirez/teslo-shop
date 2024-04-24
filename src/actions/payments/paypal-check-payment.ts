'use server'
import {PaypalOrderStatusResponse} from "@/interfaces";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string | undefined) => {
    const authToken = await getPaypalBearerToken()
    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de PayPal'
        }
    }
    const result = await verifyPaypalPayment(paypalTransactionId!, authToken)
    if (!result) {
        return {
            ok: false,
            message: 'No se pudo verificar el pago'
        }
    }
    const {status, purchase_units} = result
    const {invoice_id: orderId} = purchase_units[0]
    if (status !== 'COMPLETED') {
        return {
            ok: false,
            message: 'Aún no se ha pagado en Paypal'
        }
    }

    try {
        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        })
        revalidatePath(`/orders/${orderId}`)
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'El pago no se pudo realizar'
        }
    }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
    const base64Token = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`, 'utf-8').toString('base64')


    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
    };

    try {
        const result = await fetch(process.env.PAYPAL_OAUTH_URL!, {
            ...requestOptions,
            cache: 'no-store'
        })
            .then(r => r.json())
        return result.access_token
    } catch (error) {
        console.log(error)
        return null
    }
}

const verifyPaypalPayment = async (paypalTransactionId: string, bearerToken: string): Promise<PaypalOrderStatusResponse | null> => {


    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearerToken}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    try {
        const result = await fetch(`${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`, {
            ...requestOptions,
            cache: 'no-store'
        })
            .then(r => r.json())
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}