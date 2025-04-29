import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ataşehir Haritası',
  description: 'Yandex Maps API ile oluşturulmuş Ataşehir ilçesi haritası',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-white`}>
        <main className="container mx-auto py-4 px-4 bg-white">{children}</main>
      </body>
    </html>
  );
}
