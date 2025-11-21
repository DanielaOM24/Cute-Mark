// app/layout.tsx
import "./globals.css"; // o tus estilos globales
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Cute Mark - Tienda de Camisetas",
    description: "Tienda online de camisetas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <ClientProviders>
                    <Header />
                    {children}
                    <Footer />
                </ClientProviders>
            </body>
        </html>
    );
}
