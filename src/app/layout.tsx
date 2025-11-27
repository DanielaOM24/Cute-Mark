// app/layout.tsx
import "./globals.css"; // o tus estilos globales
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
    title: "Cute Mark - Tienda de Camisetas",
    description: "Tienda online de camisetas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
