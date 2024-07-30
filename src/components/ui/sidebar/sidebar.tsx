'use client'
import {
    IoCloseOutline,
    IoLogInOutline,
    IoLogOutOutline,
    IoPersonOutline,
    IoSearchOutline, IoShieldOutline, IoShirtOutline,
    IoTicketOutline
} from "react-icons/io5";
import Link from "next/link";
import {useUIStore} from "@/store";
import clsx from "clsx";
import {logout} from "@/actions";
import {useSession} from "next-auth/react";

export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen)
    const closeMenu = useUIStore(state => state.closeSideMenu)

    const {data: session, status} = useSession()
    const isAuthenticated = !!session?.user
    const isAdmin = session?.user?.role === 'admin'

    if (status === 'loading') {
        return (
            <button className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group">
                <IoShieldOutline/>
                <span className="group-hover:text-gray-700">Espere...</span>
            </button>
        )
    }

    return (
        <div onClick={() => closeMenu()}>
            {
                isSideMenuOpen && (
                    <>
                        {/*Background black*/}
                        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"/>
                        {/*Blur*/}
                        <div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"/>
                    </>
                )
            }

            {/*Sidemanu*/}
            <nav onClick={(e) => e.stopPropagation()}
                //TODO efecto de slide
                 className={
                     clsx(
                         "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300 ",
                         {
                             'translate-x-full': !isSideMenuOpen
                         }
                     )
                 }>

                <IoCloseOutline
                    size={50}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => closeMenu()}
                />

                {/*Input*/}
                <div className="relative mt-14">
                    <IoSearchOutline size={20}
                                     className="absolute top-2 left-2"/>
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 rounded pl-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {
                    isAuthenticated && (
                        <>
                            {/*Menú*/}
                            <Link
                                href="/profile"
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoPersonOutline size={30}/>
                                <span className="ml-3 text-xl">Perfil</span>

                            </Link>

                            <Link
                                href="/orders"
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoTicketOutline size={30}/>
                                <span className="ml-3 text-xl">Ordenes</span>

                            </Link>
                        </>
                    )
                }

                {
                    isAuthenticated && (<button
                        className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        onClick={() => logout()}
                    >
                        <IoLogOutOutline size={30}/>
                        <span className="ml-3 text-xl">Salir</span>
                    </button>)
                }
                {
                    !isAuthenticated && (
                        <Link
                            href="/auth/login"
                            onClick={() => closeMenu()}
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoLogInOutline size={30}/>
                            <span className="ml-3 text-xl">Ingresar</span>

                        </Link>
                    )
                }

                {
                    isAdmin && (
                        <>
                            {/*Line Separaton*/}
                            <div className="w-full h-px bg-gray-200 my-10"/>

                            <Link
                                href="/admin/products"
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoShirtOutline size={30}/>
                                <span className="ml-3 text-xl">Productos</span>

                            </Link>

                            <Link
                                href="/admin/orders"
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoTicketOutline size={30}/>
                                <span className="ml-3 text-xl">Ordenes</span>

                            </Link>

                            <Link
                                href="/admin/users"
                                onClick={() => closeMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoPersonOutline size={30}/>
                                <span className="ml-3 text-xl">Usuarios</span>

                            </Link>
                        </>
                    )
                }

            </nav>


        </div>
    );
};

