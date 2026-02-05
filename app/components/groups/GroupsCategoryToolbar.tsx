import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import FilterButton from "../ui/FilterButton";
import { CategoryIcon } from "@/app/components/ui/Icons";
import { Doc } from "@/convex/_generated/dataModel";
import { useRef, useState, useEffect } from "react";

interface GroupsCategoryToolbarProps {
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    setShowMobileFilters: (show: boolean) => void;
    currentCategory: string;
    onSelectCategory: (category: string) => void;
    categories: Doc<"categories">[] | undefined;
}

export const GroupsCategoryToolbar = ({
    showFilters,
    setShowFilters,
    setShowMobileFilters,
    currentCategory,
    onSelectCategory,
    categories
}: GroupsCategoryToolbarProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const checkScroll = () => {
            // Verificar si hay contenido para desplazar a la derecha
            const isScrollable = container.scrollWidth > container.clientWidth;
            // Verificar si no estamos al final (usando una pequeña tolerancia)
            const isNotAtEnd = container.scrollLeft + container.clientWidth < container.scrollWidth - 2;
            // Verificar si no estamos al inicio
            const isNotAtStart = container.scrollLeft > 2;

            setShowRightArrow(isScrollable && isNotAtEnd);
            setShowLeftArrow(isScrollable && isNotAtStart);
        };

        // Verificación inicial
        checkScroll();

        // Agregar listeners
        container.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        return () => {
            container.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [categories]);

    return (
        <div className={`relative flex flex-col md:flex-row items-center justify-center mb-6 md:mb-12 min-h-[44px] mt-4 md:mt-0 ${!showFilters ? 'gap-20' : ''}`}>
            {/* Botón alternar Sidebar */}
            <div className={`hidden lg:flex w-full md:w-auto justify-start ${showFilters ? 'md:absolute md:left-0 md:top-0 md:z-10' : ''}`}>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`hidden lg:flex px-6 py-2 border border-white/30 rounded-full text-sm font-medium transition-colors items-center gap-2 hover:cursor-pointer bg-black ${showFilters
                        ? 'text-blue-secondary bg-white border-white'
                        : 'text-white hover:bg-white/20'
                        }`}
                >
                    {showFilters ? (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="opacity-40 font-light">|</span>
                            <span>Filtro</span>
                        </>
                    ) : (
                        <>
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filtro</span>
                        </>
                    )}
                </button>
            </div>

            {/* Scroll de Categorías Superiores */}
            <div
                ref={scrollContainerRef}
                className={`flex gap-3 overflow-x-auto md:overflow-x-visible no-scrollbar px-4 justify-start items-center md:flex-wrap transition-all duration-300 ${showFilters
                    ? 'w-full lg:pl-[280px] md:justify-center'
                    : 'w-full md:w-auto max-w-full md:px-0 md:justify-center'
                    }`}
            >
                <FilterButton
                    backgroundColor="bg-white"
                    hoverColor="bg-gray-100"
                    textColor="text-slate-900"
                    isActive={currentCategory === "all"}
                    onClick={() => onSelectCategory("all")}
                    className="whitespace-nowrap"
                >
                    Todos
                </FilterButton>

                {categories?.map((category) => (
                    <FilterButton
                        key={category._id}
                        backgroundColor={category.color || "bg-gray-500"}
                        hoverColor={category.color ? category.color.replace("bg-", "hover:bg-") : "hover:bg-gray-600"}
                        textColor="text-white"
                        isActive={currentCategory === category._id}
                        onClick={() => onSelectCategory(category._id)}
                        className="flex items-center gap-2 whitespace-nowrap"
                    >
                        <CategoryIcon iconName={category.icon} />
                        <span>{category.name}</span>
                    </FilterButton>
                ))}
            </div>

            {/* Flecha de Navegación Móvil Izquierda */}
            <div
                className={`md:hidden absolute left-0 top-1/2 -translate-y-1/2 h-[40px] w-20 bg-linear-to-r from-blue-secondary via-blue-secondary/90 to-transparent z-20 flex items-center justify-start pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <button
                    onClick={scrollLeft}
                    className={`pointer-events-auto p-1.5 bg-white rounded-full shadow-lg shadow-white/10 transition-transform active:scale-95 flex items-center justify-center ${!showLeftArrow ? 'pointer-events-none' : ''
                        }`}
                    aria-label="Scroll left"
                    tabIndex={showLeftArrow ? 0 : -1}
                >
                    <ChevronLeft className="w-5 h-5 text-blue-secondary" />
                </button>
            </div>

            {/* Flecha de Navegación Móvil Derecha */}
            <div
                className={`md:hidden absolute right-0 top-1/2 -translate-y-1/2 h-[40px] w-20 bg-linear-to-l from-blue-secondary via-blue-secondary/90 to-transparent z-20 flex items-center justify-end pointer-events-none pr-1 transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <button
                    onClick={scrollRight}
                    className={`pointer-events-auto p-1.5 bg-white rounded-full shadow-lg shadow-white/10 transition-transform active:scale-95 flex items-center justify-center ${!showRightArrow ? 'pointer-events-none' : ''
                        }`}
                    aria-label="Scroll right"
                    tabIndex={showRightArrow ? 0 : -1}
                >
                    <ChevronRight className="w-5 h-5 text-blue-secondary" />
                </button>
            </div>
        </div>
    );
};
