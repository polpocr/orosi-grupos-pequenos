import type { Metadata } from "next";
import { Outfit, Raleway } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ConvexClientProvider from "./lib/ConvexClientProvider";
import { headers } from "next/headers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Orosi - Grupos Pequeños",
  description: "Sistema de inscripción y gestión de grupos pequeños para la iglesia. Administra temporadas, categorías y registros de manera eficiente.",
  keywords: ["grupos pequeños", "iglesia", "inscripciones", "gestión", "orosi"],
  authors: [{ name: "Equipo Orosi" }],
  openGraph: {
    title: "Orosi - Gestión de Grupos Pequeños",
    description: "Sistema de inscripción y gestión de grupos pequeños para la iglesia",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Detectar si estamos en rutas de autenticación
  const isAuthPage = pathname.includes("/sign-in") || pathname.includes("/sign-up");

  return (
    <html lang="es">
      <body
        className={`${outfit.variable} ${raleway.variable} antialiased`}
      >
        <ConvexClientProvider>
          {!isAuthPage && <Header />}
          {children}
          {!isAuthPage && <Footer />}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
