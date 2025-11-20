// app/layout.tsx
import "./globals.css"; // o tus estilos globales
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
    title: "Mi Ecomerce",
    description: "Tienda de camisetas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                {/* ClientProviders es un Client Component — Next lo permite */}
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    );
}
