import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const geist = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pneu.Shop — Vos pneumatiques en un seul clic',
  description: 'Achetez vos pneus en ligne au Maroc. Livraison rapide partout au Maroc.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={geist.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}