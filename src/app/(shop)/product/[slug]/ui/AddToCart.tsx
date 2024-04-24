'use client'
import {QuantitySelector, SizeSelector} from "@/components";
import type{CartProduct, Product, Size} from "@/interfaces";
import {useState} from "react";
import {useCartStore} from "@/store";

interface Props {
    product: Product
}

const AddToCart = ({product}: Props) => {

    const addProductToCart = useCartStore(state=> state.addProductToCart)

    const [size, setSize] = useState<Size | undefined>()
    const [quantity, setQuantity] = useState<number>(0)
    const [posted, setPosted] = useState(false)

    const addToCart = () => {
        setPosted(true)
        if (!size) return
        const cartProduct:CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            size,
            quantity,
            image: product.images![0]

        }
        addProductToCart(cartProduct)
        setPosted(false)
        setQuantity(1)
        setSize(undefined)
    }
    return (
        <>
            {
                posted && !size && (
                    <span className="mt-2 text-red-500 fade-in">
                Debe de seleccionar una talla
            </span>
                )
            }
            {/*Selector de tallas*/}
            <SizeSelector availableSizes={product.sizes}
                          selectedSize={size}
                          onSizeChanged={setSize}
            />
            {/*Selector de cantidad*/}
            <QuantitySelector quantity={quantity}
                              onQuantityChanged={setQuantity}/>
            {/*Button*/}
            <button onClick={addToCart}
                    className="btn-primary my-5">
                Agregar al carrito
            </button>
        </>
    );
};

export default AddToCart;