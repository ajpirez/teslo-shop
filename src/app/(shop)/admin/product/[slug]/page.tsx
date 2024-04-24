import {Title} from "@/components";
import {getCategories, getProductBySlug} from "@/actions";
import {redirect} from "next/navigation";
import {ProductForm} from "@/app/(shop)/admin/product/[slug]/ui/ProductForm";

interface Props {
    params: {
        slug: string
    }
}

const ProductPage = async ({params}: Props) => {
    const {slug} = params

    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ])

    if (!product && slug !== 'new') {
        redirect('/admin/products')
    }

    const title = slug === 'new' ? 'Nuevo producto' : 'Editar Producto'

    return (
        <>
            <Title title={title}/>
            <ProductForm product={product ?? {}}
                         categories={categories}/>
        </>
    );
};

export default ProductPage;