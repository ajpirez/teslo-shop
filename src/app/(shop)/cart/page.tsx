'use client'
import {QuantitySelector, Title} from "@/components";
import Link from "next/link";
import {initialData} from "@/seed/seed";
import Image from "next/image";
import {redirect} from "next/navigation";
import {useCartStore} from "@/store";
import ProductsInCart from "@/app/(shop)/cart/ui/ProductsInCart";
import OrderSummary from "@/app/(shop)/cart/ui/OrderSummary";
//
// const productsInCart = [
//     initialData.products[0],
//     initialData.products[1],
//     initialData.products[2],
// ]

const CartPage = () => {
    // const productsInCart = useCartStore(state => state.cart)
    //
    // if(!productsInCart.length) redirect('/empty')
    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title="Carrito"/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {/*Carrito*/}
                    <div className="flex flex-col mt-5">
                        <span className="text-xl">Agregar más items</span>
                        <Link href="/"
                              className="underline mb-5">
                            Continúa comprando
                        </Link>
                        {/*items*/}
                        <ProductsInCart/>
                    </div>

                    {/*Checkout - Resumen de orden*/}

                        <OrderSummary/>
                        <div className='mt-5 mb-2 w-full'>
                            <Link href='/checkout/address' className='flex btn-primary justify-center'>
                                Checkout
                            </Link>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;