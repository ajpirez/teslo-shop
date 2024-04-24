// https://tailwindcomponents.com/component/hoverable-table
import {User} from "@/interfaces";

export const revalidate = 0

import {redirect} from "next/navigation";
import {Pagination, Title} from '@/components';

import {getPaginatedUsers} from "@/actions";
import UserTable from "@/app/(shop)/admin/users/ui/UserTable";

interface Props {
    searchParams: {
        page?: string
    }
}

export default async function OrderPage({searchParams}: Props) {
    const page = Number(searchParams?.page) ?? 1
    const {ok, users, totalPages = []} = await getPaginatedUsers({page})

    // if (!ok) {
    //     redirect('/auth/login')
    // }

    return (
        <>
            <Title title="Users"/>

            <div className="mb-10">
                <UserTable users={(users as User[])}/>
                <Pagination totalPages={(totalPages as number)}/>
            </div>
        </>
    );
}