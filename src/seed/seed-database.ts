import prisma from "../lib/prisma";
import {Category, initialData, Size, Type} from "./seed";
import {countries} from "./ seed-countries";

async function main(){
    //1 Borrrar registros previos
    await prisma.user.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.country.deleteMany()
    await prisma.orderAddress.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()

    //2 Crear categorias
    const {products,categories,users} = initialData

    await prisma.user.createMany({
        data: users
    })

    const categoriesData = categories.map(category => ({
        name: category
    }))
    await prisma.category.createMany({
        data: categoriesData
    })

    const categoriesDB = await prisma.category.findMany()

    const categoriesMap = categoriesDB.reduce((acc,item)=>{
        return{
            ...acc,
            [item.name]:item.id
        }
    },{} as Record<string, string>)

    //3 Crear Productos
    for (const product of products) {
        const { type, images, ...rest } = product;
        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type],
            },
        });
        const imagesData = images.map((image) => ({
            url: image,
            productId: dbProduct.id,
        }));
        await prisma.productImage.createMany({
            data: imagesData,
        });
    }

    await prisma.country.createMany({
        data: countries
    })

    // const productsCreated:any = await prisma.product.createMany({
    //     data: productsData
    // })

    //4 Crear imagenes


    // const productImagesData = productsCreated.flatMap((product, index) => {
    //     const images = products[index].images;
    //     return images.map((image) => ({
    //         url: image,
    //         productId: product.id,
    //     }));
    // });

    // await prisma.productImage.createMany({
    //     data: products.map(product => {
    //         return {
    //             url: product.images,
    //             productId: product.id
    //         }
    //     })
    // })

    console.log("Seed ejecuto correctamente")

}


(async ()=>{
    if(process.env.NODE_ENV === 'production') return
await main()
})()