import Image from "next/image";
import GroupsSection from "../components/groups/GroupsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <section className="w-full">
        <Image
          src="/hero-home.webp"
          alt="Personas compartiendo en grupo"
          width={1920}
          height={694}
          className="w-full h-[300px] sm:h-[400px] md:h-auto object-cover object-center"
          priority
        />
      </section>

      {/* Sección de Grupos */}
      <GroupsSection />

    </div>
  );
}
