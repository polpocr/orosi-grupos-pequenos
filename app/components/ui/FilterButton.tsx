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
  isActive = false,
  className = ""
}: FilterButtonProps & { className?: string }) => {
  // Check if backgroundColor is a Tailwind class (starts with 'bg-')
  const isTailwindBg = backgroundColor?.startsWith('bg-');
  
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 hover:cursor-pointer ${textColor} ${isTailwindBg ? backgroundColor : ''} ${isTailwindBg ? `hover:${hoverColor}` : ''} ${className} ${isActive ? 'ring-2 ring-white/50' : ''}`}
      style={!isTailwindBg ? {
        backgroundColor: backgroundColor,
      } : undefined}
      onMouseEnter={(e) => {
        if (!isTailwindBg) e.currentTarget.style.backgroundColor = hoverColor;
      }}
      onMouseLeave={(e) => {
        if (!isTailwindBg) e.currentTarget.style.backgroundColor = backgroundColor;
      }}
    >
      {children}
    </button>
  );
};

export default FilterButton;
