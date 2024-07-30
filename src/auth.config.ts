import Credentials from "next-auth/providers/credentials";
import {z} from 'zod'
import NextAuth, {NextAuthConfig} from "next-auth";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

const authenticatedRoutes = [
    '/checkout/address',
    '/profile',
    '/checkout',
    '/orders',
]

const adminRoutes = [
    '/admin/orders',
    '/admin/users',
    '/admin/products',
]

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account'
    },
    callbacks: {
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            const isAdmin = auth?.user?.role === 'admin';
            const isAnAuthenticatedRoute = authenticatedRoutes.includes(nextUrl.pathname)
            const isAnAdminRoute = adminRoutes.includes(nextUrl.pathname)
            if (!isLoggedIn && isAnAuthenticatedRoute) {
                return Response.redirect(new URL('/', nextUrl));
            }

            if (!isAdmin && isAnAdminRoute) {
                return Response.redirect(new URL('/auth/login', nextUrl));
            }

            return true;
        },
        jwt: async ({token, user}) => {
            if (user) token.data = user
            return token
        },
        session: async ({session, token}) => {
            session.user = token.data as any
            return session
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({email: z.string().email(), password: z.string().min(6)})
                    .safeParse(credentials);
                if (!parsedCredentials.success) return null

                const {email, password} = parsedCredentials.data
                const user = await prisma.user.findUnique({
                    where: {
                        email: email.toLowerCase()
                    }
                })
                if (!user) return null
                if (!bcryptjs.compareSync(password, user.password)) return null

                const {password: _, ...rest} = user
                return rest
            },
        }),
    ],
}

export const {signIn, signOut, auth, handlers} = NextAuth(authConfig)