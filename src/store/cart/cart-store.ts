import {CartProduct} from "@/interfaces";
import {create} from "zustand";
import {persist} from "zustand/middleware";

interface State {
    cart: CartProduct[]
    getTotalItems: () => number
    getSummaryInformation: () => { total: number, subtotal: number, itemInCart: number, tax: number }
    addProductToCart: (product: CartProduct) => void
    updateProductQuantity: (product: CartProduct, quantity: number) => void
    removeProduct: (product: CartProduct) => void
    clearCart: () => void
}

export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],
            getTotalItems: () => {
                const {cart} = get()
                return cart.reduce((acc, item) => acc + item.quantity, 0)
            },
            getSummaryInformation: () => {
                const {cart, getTotalItems} = get()
                const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0)
                const tax = subtotal * 0.15
                const total = subtotal + tax
                const itemInCart = getTotalItems()
                return {
                    subtotal,
                    tax,
                    total,
                    itemInCart
                }
            },
            addProductToCart: (product: CartProduct) => {
                const {cart} = get()
                //1. Revisar si el prodcuto existe en el carrito con la talla seleccionada
                const productInCart = cart.some((item) => item.id === product.id && item.size === product.size)
                if (!productInCart) {
                    set({cart: [...cart, product]})
                    return
                }
                //2. se que el producto exsite por talla...tengo que incrementarlo
                const updateCartProduct = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return {...item, quantity: item.quantity + product.quantity}
                    }
                    return item
                })
                set({cart: updateCartProduct})
            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const {cart} = get()
                const updateCartProduct = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return {...item, quantity}
                    }
                    return item
                })
                set({cart: updateCartProduct})
            },
            removeProduct: (Product: CartProduct) => {
                const {cart} = get()
                const updateCartProduct = cart.filter((item) => !(item.id === Product.id && item.size === Product.size))
                set({cart: updateCartProduct})
            },
            clearCart: () => set({cart: []})
        })
        , {
            name: 'shopping-cart'
        }
    )
);