import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import {fetchWrapper} from "@/utils/fetchWrapper";
import {router} from "next/client";

interface User {
    access_token: string
}

export default NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'my-project',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'jsmith@example.com',
                },
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials: any, req) {
                try {
                    const jsonData = {
                        email: credentials?.email,
                        password: credentials?.password,
                    }

                    const endpoint = 'http://localhost:4000/user/login'
                    const config = {
                        method: 'POST',
                        body: JSON.stringify(jsonData),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                    const user: any = await fetchWrapper(endpoint, config)
                    console.log('API response data:', user)
                    if (user) {
                        return user
                    }
                } catch (error: any) {
                    console.log('API response status:', error?.status)
                    throw new Error(error?.message)
                }

                return null
            }


        }),
    ],

    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            if (user) {
                return true;
            } else {
                return false;
            }
        },
        async jwt({token, user, account}) {
            if (account && user) {
                const typedUser = user as any; // Type casting

                return {
                    ...token,
                    accessToken: typedUser.access_token
                }
            }
            return token
        },

        async session({session, token}: any) {
            session.user.access_token = token.accessToken
            return session
        }
    },

    theme: {
        colorScheme: 'auto',
        brandColor: '',
        logo: '/vercel.svg',
    },
    debug: process.env.NODE_ENV === 'development',
})
