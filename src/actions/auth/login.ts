'use server'
import {signIn} from '@/auth.config';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false,
        });
        return 'Success';
    } catch (error) {
        if ((error as any)?.type === 'CredentialsSignin') {
            return 'CredentialsSignin';
        }
        // if (error instanceof AuthError) {
        //     switch (error.type) {
        //         case 'CredentialsSignin':
        //             return 'Invalid credentials.';
        //         default:
        //             return 'Something went wrong.';
        //     }
        // }
        return 'Unknown error.';
        // throw error;
    }
}

export const login = async (email: string, password: string) => {
    try {
        await signIn('credentials', {
            ...({email, password}),
            redirect: false
        })
        return {
            ok: true
        }

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'no se pudo iniciar sessión'
        }
    }

}