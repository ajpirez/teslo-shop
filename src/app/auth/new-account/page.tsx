import Link from 'next/link';
import {titleFont} from "@/config/font";
import RegisterForm from "@/app/auth/new-account/ui/RegisterForm";

export default function Register() {
    return (
        <div className="flex flex-col min-h-screen pt-32 sm:pt-52">

            <h1 className={`${titleFont.className} text-4xl mb-5`}>Nueva cuenta</h1>

            <RegisterForm/>

        </div>
    );
}