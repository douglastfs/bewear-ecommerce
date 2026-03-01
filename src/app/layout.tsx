import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Toaster } from "@/components/ui/sonner";
import { getCategories } from "@/data-access/category";
import ReactQueryProvider from "@/providers/react-query";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | BEWEAR",
    default: "BEWEAR | Moda com Estilo",
  },
  description:
    "Descubra as últimas tendências em moda. Roupas, acessórios e muito mais com entrega para todo o Brasil.",
  openGraph: {
    title: "BEWEAR | Moda com Estilo",
    description:
      "Descubra as últimas tendências em moda. Roupas, acessórios e muito mais com entrega para todo o Brasil.",
    type: "website",
    locale: "pt_BR",
    siteName: "BEWEAR",
    images: ["/banner-01.png"], // Fallback global
  },
  twitter: {
    card: "summary_large_image",
    title: "BEWEAR | Moda com Estilo",
    description:
      "Descubra as últimas tendências em moda. Roupas, acessórios e muito mais com entrega para todo o Brasil.",
    images: ["/banner-01.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} flex min-h-dvh flex-col font-sans antialiased`}
      >
        <ReactQueryProvider>
          <Header initialCategories={categories} />
          <main className="mx-auto my-8 w-full max-w-[1440px] flex-1">
            {children}
          </main>
          <Footer />
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
