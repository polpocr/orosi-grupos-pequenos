import FilterButton from "../ui/FilterButton";
import { CategoryIcon } from "@/app/components/ui/Icons";
import { Doc } from "@/convex/_generated/dataModel";

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
    return (
        <div className={`relative flex flex-col md:flex-row items-center justify-center mb-12 min-h-[44px] ${!showFilters ? 'gap-20' : ''}`}>
            {/* Botón alternar Sidebar */}
            <div className={`w-full md:w-auto flex justify-start ${showFilters ? 'md:absolute md:left-0 md:top-0 md:z-10' : ''}`}>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`hidden lg:flex px-6 py-2 border border-white/30 rounded-full text-sm font-medium transition-colors items-center gap-2 hover:cursor-pointer bg-black ${showFilters
                        ? 'text-blue-secondary bg-white border-white'
                        : 'text-white hover:bg-white/20'
                        }`}
                >
                    {showFilters ? (
                        <>
                            <span className="opacity-40 font-light">|</span>
                            <span>Filtro</span>
                        </>
                    ) : (
                        <span>Filtro</span>
                    )}
                </button>

                {/* Alternar Móvil */}
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex px-6 py-2 border border-white/30 rounded-full text-sm font-medium transition-colors items-center gap-2 hover:cursor-pointer bg-black text-white hover:bg-white/20"
                >
                    <span>Filtro</span>
                </button>
            </div>

            {/* Scroll de Categorías Superiores */}
            <div className={`flex gap-3 overflow-x-auto no-scrollbar px-4 justify-start items-center transition-all duration-300 ${showFilters
                ? 'w-full lg:pl-[280px] md:justify-center'
                : 'w-full md:w-auto max-w-full md:px-0 md:justify-start'
                }`}>
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
        </div>
    );
};
