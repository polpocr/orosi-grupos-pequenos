"use client";

import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from "../ui/Icons";

const Footer = () => {
  return (
    <footer className="bg-dark text-white font-outfit font-light">
      <div className="max-w-[1920px] mx-auto px-6 py-12 md:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">

          {/* Logo */}
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <Image
              src="/logo.png"
              alt="Oasis Logo"
              width={120}
              height={40}
              className="w-28 h-8 md:w-36 md:h-10"
            />
          </div>

          {/* Ubicación */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Ubicación:</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Casa Oasis,</p>
                <p>Ruta 32 contiguo a DEKRA.</p>
              </div>
              <div>
                <p className="font-medium">Iglesia Oasis,</p>
                <p>Moravia 175 mts norte del</p>
                <p>Banco de Costa Rica</p>
              </div>
            </div>
          </div>

          {/* Contactos */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Contactos:</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">WhatsApp:</p>
                <p>+506 8782-7621</p>
              </div>
              <div>
                <p className="font-medium">Teléfono:</p>
                <p>+506 2507-9801</p>
              </div>
              <div>
                <p className="font-medium">Correo:</p>
                <Link
                  href="mailto:pastoral@iglesiaoasis.com"
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  pastoral@iglesiaoasis.com
                </Link>
              </div>
            </div>
          </div>

          {/* Administración */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Administración:</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Teléfono:</p>
                <p>+506 2507-9863</p>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Redes Sociales:</h3>
            <div className="flex gap-2">
              <Link
                href="https://www.facebook.com/oasis.cr"
                className="p-[3px] bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FacebookIcon className="w-[15px] h-[15px] text-dark" />
              </Link>
              <Link
                href="https://www.instagram.com/oasis.cr/"
                className="p-[3px] bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <InstagramIcon className="w-[15px] h-[15px] text-dark" />
              </Link>
              <Link
                href="https://www.youtube.com/@oasis.cr"
                className="p-[3px] bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <YoutubeIcon className="w-[15px] h-[15px] text-dark" />
              </Link>
              <Link
                href="https://www.tiktok.com/@oasis.cr"
                className="p-[3px] bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <TiktokIcon className="w-[15px] h-[15px] text-dark" />
              </Link>
            </div>
          </div>

          {/* Sedes */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Sedes:</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Casa Oasis</p>
                <p>Oasis Moravia</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-primary hover:bg-blue-secondary text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-50"
        aria-label="Volver arriba"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
