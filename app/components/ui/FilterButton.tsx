"use client";

interface FilterButtonProps {
  children: React.ReactNode;
  backgroundColor: string;
  hoverColor: string;
  textColor?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const FilterButton = ({ 
  children, 
  backgroundColor, 
  hoverColor, 
  textColor = "text-white",
  onClick,
  isActive = false 
}: FilterButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 hover:cursor-pointer ${textColor}`}
      style={{
        backgroundColor: backgroundColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = backgroundColor;
      }}
    >
      {children}
    </button>
  );
};

export default FilterButton;
