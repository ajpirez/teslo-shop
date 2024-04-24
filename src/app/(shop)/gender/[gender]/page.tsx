export const revalidate = 60
import {Pagination, ProductGrid, Title} from "@/components";
import {getPaginatedProductsWithImages} from "@/actions";
import {redirect} from "next/navigation";
import {Gender} from "@prisma/client";

interface Props {
    params: {
        gender: string
    },
    searchParams: {
        page?: string
    }
}


const CategoryIdPage = async ({params, searchParams}: Props) => {
    const {gender} = params

    const page = Number(searchParams?.page) ?? 1

    const {products, totalPages, currentPage} = await getPaginatedProductsWithImages({page, gender: gender as Gender})

    if (products.length === 0) redirect(`/gender/${gender}`)

    const labels: Record<string, string> = {
        'men': 'para Hombres',
        'women': 'para Mujeres',
        'kid': 'para niños',
        'unisex': 'para todos'
    }
    // if(id === 'kids'){
    //     notFound()
    // }
    return (
        <>
            <Title title={`Articulos de ${labels[gender]}`}
                   subtitle="Todos los productos"
                   className="mb-2"/>
            <ProductGrid products={products!}/>
            <Pagination totalPages={totalPages}/>
        </>
    );
};

export default CategoryIdPage;