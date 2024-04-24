'use client'
import {titleFont} from "@/config/font";
import {useCallback, useEffect, useState} from "react";
import {getStockBySlug} from "@/actions";

interface Props {
    slug: string
}

const StockLabel = ({slug}: Props) => {
    const [stock, setStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)


    const getStock = useCallback(async () => {
        const inStock = await getStockBySlug(slug);
        setStock(inStock);
        setIsLoading(false);
    }, [slug, setStock, setIsLoading]);

    useEffect(() => {
        getStock()
    }, [getStock]);


    return (
        <>
            {
                isLoading
                    ?
                    <h1 className={`${titleFont.className} antialiased font-bold text-lg bg-gray-200 animate-pulse`}>
                        &nbsp;
                    </h1>
                    :
                    <h1 className={`${titleFont.className} antialiased font-bold text-lg`}>
                        Stock: {stock}
                    </h1>
            }
        </>
    );
};

export default StockLabel;