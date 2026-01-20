"use client";

import { useState } from "react";
import FilterButton from "../ui/FilterButton";

const GroupsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    modality: "",
    location: "",
    day: "",
    schedule: "",
    age: "",
    dirigidoA: "",
    modo: "",
  });

  return (
    <section className="bg-blue-secondary text-white font-outfit">
      <div className="max-w-[1920px] mx-auto px-6 py-16 md:px-16 lg:px-32 font-light">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-xl mb-6 md:text-4xl md:mb-10">Grupos Conexión</h1>
          <h2 className="text-xl mb-1 md:text-4xl md:mb-2">
            Temporada de Grupos
          </h2>
          <p className="text-xl md:text-4xl opacity-90">
            Desde - Hasta (Fecha Pendiente)
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-3 sm:px-0">
          <div className="w-full h-10 sm:h-12 bg-black rounded-full flex items-center px-4 sm:px-6 shadow-lg relative z-10">
            <div className="shrink-0 pointer-events-none">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Busco..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 ml-3 sm:ml-4 bg-transparent text-white text-base sm:text-lg placeholder-neutral-700 placeholder:font-medium border-b border-b-gray-400 focus:outline-none focus:border-white transition-colors leading-tight"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-2 border border-white/30 rounded-full text-sm font-medium transition-colors flex items-center gap-2 hover:cursor-pointer bg-black text-white md:mr-52 ${
              showFilters 
                ? 'text-blue-secondary' 
                : 'hover:bg-white/20'
            }`}
          >
            Filtro
          </button>
          <FilterButton 
            backgroundColor="#ffffff" 
            hoverColor="#f3f4f6" 
            textColor="text-blue-secondary"
          >
            Todos
          </FilterButton>
          
          <FilterButton 
            backgroundColor="#C83737" 
            hoverColor="#b91c1c"
          >
            Bíblico
          </FilterButton>
          
          <FilterButton 
            backgroundColor="#0090E6" 
            hoverColor="#0284c7"
          >
            Interés
          </FilterButton>
          
          <FilterButton 
            backgroundColor="#356128" 
            hoverColor="#15803d"
          >
            Apoyo
          </FilterButton>
          
          <FilterButton 
            backgroundColor="#7E2D79" 
            hoverColor="#a21caf"
          >
            Acción Social
          </FilterButton>
        </div>

        {/* Sidebar Filters */}
        <div className={`grid gap-8 ${showFilters ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {/* Left Sidebar - Filters */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="space-y-6">
              {/* Categoría de Grupos */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Categoría de Grupos
                </h3>
              </div>

              {/* Modalidad */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Modalidad
                </h3>
              </div>

              {/* Ubicación */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Ubicación
                </h3>
              </div>

              {/* Día */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Día
                </h3>
              </div>

              {/* Horario */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Horario
                </h3>
              </div>

              {/* Edad */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Edad
                </h3>
              </div>

              {/* Dirigido a */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Dirigido a
                </h3>
              </div>

              {/* Modo */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Modo
                </h3>
              </div>

              {/* Apply Button */}
              <button className="w-full bg-white text-blue-secondary py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Aplicar
              </button>
              </div>
            </div>
          )}

          {/* Right Content - Groups Grid */}
          <div className={showFilters ? "lg:col-span-3" : "col-span-1"}>
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-2">Próximamente</h3>
              <p className="text-lg opacity-80">
                Aquí aparecerán las tarjetas de grupos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupsSection;
