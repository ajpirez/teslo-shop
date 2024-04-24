'use client'

import Link from "next/link";
import {useFormState, useFormStatus} from 'react-dom'
import {authenticate} from "@/actions";
import {IoInformationOutline} from "react-icons/io5";
import clsx from "clsx";
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation";

const LoginForm = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [state, dispatch] = useFormState(authenticate, undefined)


    useEffect(() => {
        if (state === "Success") {
            window.location.replace('/')
        }
    }, [router, state]);

    return (
        <form action={dispatch}
              className="flex flex-col">

            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="email"
                id="email"
                name="email"
            />

            <label htmlFor="password">Contraseña</label>
            <div className="relative">
                <button className="absolute top-2 right-8"
                        type="button"
                        onClick={() => setShowPassword(show => !show)}>{showPassword ? 'hidde' : 'show'}</button>
                <input
                    className="px-5 py-2 border bg-gray-200 rounded mb-5"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                />
            </div>

            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {state === "CredentialsSignin" && (
                    <div className="flex m-auto mb-2">
                        <IoInformationOutline className="h-5 w-5 text-red-500"/>
                        <p className="text-sm text-red-500">Invalid credentials</p>
                    </div>
                )}
            </div>

            <PendingButton/>


            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/new-account"
                className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>

        </form>
    );
};

export default LoginForm;

function PendingButton() {
    const {pending} = useFormStatus();

    return (
        <button
            type="submit"
            className={clsx({
                    "btn-primary": !pending,
                    "btn-disabled": pending
                }
            )}
            disabled={pending}
        >
            Ingresar
        </button>
    );
}