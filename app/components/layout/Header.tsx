"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
  WhatsAppIcon,
} from "../ui/Icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full">
      <section className="bg-blue-primary text-white font-outfit py-4 md:py-5 px-4">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="uppercase font-light">Consejería:</span>
            <div className="flex items-center gap-1.5">
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span className="font-semibold">(+506) 0000-0000</span>
            </div>
          </div>

          <div className="hidden md:block bg-white w-px h-4 opacity-60"></div>

          <div className="flex items-center gap-2">
            <span className="uppercase font-light">Escríbenos al:</span>
            <div className="flex items-center gap-1.5">
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span className="font-semibold">(+506) 8782 7621</span>
            </div>
          </div>

          <div className="hidden md:block bg-white w-px h-4 opacity-60"></div>

          <div className="flex items-center gap-3">
            <span className="uppercase font-medium">Síguenos en:</span>
            <div className="flex items-center gap-2">
              <Link
                className="hover:text-gray-300 cursor-pointer border p-[2.5px] rounded-full border-white"
                href="https://www.facebook.com/oasis.cr"
              >
                <FacebookIcon className="w-[13px] h-[13px]" />
              </Link>
              <Link
                className="hover:text-gray-300 cursor-pointer border p-[2.5px] rounded-full border-white"
                href="https://www.instagram.com/oasis.cr/"
              >
                <InstagramIcon className="w-[13px] h-[13px]" />
              </Link>
              <Link
                className="hover:text-gray-300 cursor-pointer border p-[2.5px] rounded-full border-white"
                href="https://www.youtube.com/@oasis.cr"
              >
                <YoutubeIcon className="w-[13px] h-[13px]" />
              </Link>
              <Link
                className="hover:text-gray-300 cursor-pointer border p-[2.5px] rounded-full border-white"
                href="https://www.tiktok.com/@oasis.cr"
              >
                <TiktokIcon className="w-[13px] h-[13px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark text-white py-6 px-6 md:px-16 md:py-5 lg:px-32">
        <div className="max-w-[1920px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="oasis" 
              width={100} 
              height={100} 
              className="w-28 h-8 md:w-36 md:h-10"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-9 text-xs font-medium tracking-wider md:ml-52">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-gray-300 uppercase">
                Sobre Nosotros
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-gray-300 uppercase">
                Únete a un Grupo
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <Link href="/valores" className="hover:text-gray-300 uppercase">
              Nuestros Valores
            </Link>
            <Link href="/agenda" className="hover:text-gray-300 uppercase">
              Agenda
            </Link>
            <Link href="/dar" className="hover:text-gray-300 uppercase">
              Dar
            </Link>
            <Link href="/contacto" className="hover:text-gray-300 uppercase">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="bg-white text-teal-900 p-2 hover:bg-gray-200 rounded-full transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <button
              className="md:hidden p-2 hover:bg-blue-primary rounded"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-teal-600">
            <nav className="flex flex-col space-y-3 pt-4">
              <button className="text-left hover:text-gray-300 uppercase font-medium">
                Sobre Nosotros
              </button>
              <button className="text-left hover:text-gray-300 uppercase font-medium">
                Únete a un Grupo
              </button>
              <Link
                href="/valores"
                className="hover:text-gray-300 uppercase font-medium"
              >
                Nuestros Valores
              </Link>
              <Link
                href="/agenda"
                className="hover:text-gray-300 uppercase font-medium"
              >
                Agenda
              </Link>
              <Link
                href="/dar"
                className="hover:text-gray-300 uppercase font-medium"
              >
                Dar
              </Link>
              <Link
                href="/contacto"
                className="hover:text-gray-300 uppercase font-medium"
              >
                Contacto
              </Link>
            </nav>
          </div>
        )}
      </section>
    </header>
  );
};

export default Header;
