export const revalidate = 60
import {Pagination, ProductGrid, Title} from "@/components";
import {getPaginatedProductsWithImages} from "@/actions";
import {redirect} from "next/navigation";


interface Props{
    searchParams: {
        page?:string
    }
}

export default async function Home({searchParams}:Props) {
    const page = Number(searchParams?.page) ?? 1

    const {products,totalPages,currentPage} = await getPaginatedProductsWithImages({page})

    if(products.length === 0) redirect('/')

    return (
        <>
            <Title title="Tienda"
                   subtitle="Todos los productos"
                   className="mb-2"/>
            <ProductGrid products={products}/>
            <Pagination totalPages={totalPages}/>
        </>
    );
}
