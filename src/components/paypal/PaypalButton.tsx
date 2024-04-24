'use client'
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData} from "@paypal/paypal-js";
import {paypalCheckPayment, setTransactionId} from "@/actions";
import {useUIStore} from "@/store";


interface Props {
    orderId: string,
    amount: number
}

export const PaypalButton = ({amount, orderId}: Props) => {
    const [{isPending}] = usePayPalScriptReducer()
    const roundedAmount = (Math.round(amount * 100)) / 100
    if (isPending) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-10 bg-gray-300 rounded"/>
                <div className="h-10 bg-gray-300 rounded mt-3"/>
                <div className="h-10 bg-gray-300 rounded mt-3"/>
            </div>
        )
    }

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{
                invoice_id: orderId,
                amount: {
                    value: roundedAmount.toString(),
                    currency_code: 'USD'
                }
            }]
        })

        const {ok} = await setTransactionId(orderId, transactionId)
        if (!ok) {
            throw new Error('No se pudo actualizar el id de la transacción')
        }
        return transactionId
    }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture();
        if (!details) return

        await paypalCheckPayment(details.id)
    }

    return (

        <div className='relative z-0'>
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>


    )
}
