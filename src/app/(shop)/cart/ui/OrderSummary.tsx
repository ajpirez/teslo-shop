'use client'
import {useEffect, useState} from "react";
import {useCartStore} from "@/store";
import {currencyFormat} from "@/utils";
import {useRouter} from "next/navigation";

const OrderSummary = () => {
    const router = useRouter()
    const [loaded, setLoaded] = useState(false)

    const {itemInCart, tax, total, subtotal} = useCartStore(state => state.getSummaryInformation())

    useEffect(() => {
        setLoaded(true)
    }, []);


    useEffect(() => {
        if (itemInCart === 0 && loaded) {
            router.replace('/empty')
        }
    }, [itemInCart, loaded, router]);

    if (!loaded) {
        return <p>Loading...</p>
    }

    return (
        <div className="{/*absolute top-10 right-10 */}bg-white rounded-xl shadow-xl p-7 {/*h-[300px]*/} h-fit">
            <h2 className="text-2xl">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">{itemInCart === 1 ? '1 artículo' : `${itemInCart} artículos`}</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subtotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

            </div>
        </div>
    );
};

export default OrderSummary;