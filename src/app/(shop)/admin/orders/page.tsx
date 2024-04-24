// https://tailwindcomponents.com/component/hoverable-table
import {redirect} from "next/navigation";

export const revalidate = 0
import {Pagination, Title} from '@/components';

import {getPaginatedOrders} from "@/actions";
import OrdersTable from "@/app/(shop)/admin/orders/ui/OrdersTable";

interface Props {
    searchParams: {
        page?: string
    }
}

export default async function OrderPage({searchParams}: Props) {
    const page = Number(searchParams?.page) ?? 1
    const {ok, orders, totalPages = []} = await getPaginatedOrders({page})

    if (!ok) {
        redirect('/auth/login')
    }

    return (
        <>
            <Title title="All Orders"/>
            <div className="mb-10">
                <OrdersTable orders={orders}/>
                <Pagination totalPages={(totalPages as number)}/>
            </div>
        </>
    );
}