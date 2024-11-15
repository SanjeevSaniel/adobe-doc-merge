import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Document Generation: Using Adobe DG API',
  description: 'Document Generation using Adobe APIs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`w-full min-h-screen p-10 bg-white text-black`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
