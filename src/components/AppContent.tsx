'use client';

import Header from "./Header";
import Footer from "./Footer";

interface AppContentProps {
    children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
