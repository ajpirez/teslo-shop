import {User} from "@/interfaces/user.interface";



export interface OrderItem{
    id: string
    name: string
    price: number
    quantity: number
    image: string
    createAt : Date
    updateAt :Date
}

export interface OrderAddress{
    id: string
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
    createAt : Date
    updateAt :Date
}

export interface Order{
    id: string
    subtotal :number
    tax:number
    total    :number
    itemsInOrder :number
    isPaid       :boolean
    paidAt? :Date | null

    createAt : Date
    updateAt :Date

    user?         :User
    userId       :string
    OrderItem?    :OrderItem[]
    OrderAddress? : OrderAddress
    transactionId?:string
}