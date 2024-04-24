import {auth} from "@/auth.config";

export const revalidate = 60

import {Title} from '@/components';
import AddressForm from "@/app/(shop)/checkout/address/ui/AddressForm";
import {getCountries, getUserAddress} from "@/actions";

export default async function AddressPage() {

    const session = await auth()
    if(!session?.user){
        return (
            <h3 className='text-5xl'>500 - No hay una sesion de usuario</h3>
        )
    }

   const countries = await getCountries()
    const userAddress = await getUserAddress(session.user.id) ?? undefined

    return (
        <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
            <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
                <Title title="Dirección"
                       subtitle="Dirección de entrega"/>
                <AddressForm countries={countries} userStoreAddress={userAddress}/>
            </div>
        </div>
    );
}