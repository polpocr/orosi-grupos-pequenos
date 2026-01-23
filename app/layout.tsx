import type { Metadata } from "next";
import { Outfit, Raleway } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./lib/ConvexClientProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${raleway.variable} antialiased`}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
