// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/lib/mongodb";
import Users from "@/Database/models/users";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    await connect();
                    const user = await Users.findOne({ email: credentials.email });

                    if (!user) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Error en authorize:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Si es login con Google, crear o actualizar usuario en BD
            if (account?.provider === "google") {
                try {
                    await connect();
                    const existingUser = await Users.findOne({ email: user.email });

                    if (!existingUser) {
                        // Crear nuevo usuario con Google
                        await Users.create({
                            email: user.email?.toLowerCase(),
                            name: user.name || "Usuario",
                            password: "", // Sin contraseña para usuarios de Google
                            role: "user",
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error en signIn callback:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            // Si es login con Google, obtener datos del usuario desde BD
            if (account?.provider === "google" && user?.email) {
                try {
                    await connect();
                    const dbUser = await Users.findOne({ email: user.email.toLowerCase() });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.role = dbUser.role;
                    }
                } catch (error) {
                    console.error("Error obteniendo usuario de BD:", error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

