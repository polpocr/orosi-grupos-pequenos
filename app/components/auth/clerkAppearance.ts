import { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: '#06354C',
    colorText: '#1C1B1B',
    colorTextSecondary: '#0F232D',
    fontFamily: 'var(--font-outfit), system-ui, sans-serif',
    fontFamilyButtons: 'var(--font-outfit), system-ui, sans-serif',
    fontSize: '15px',
    borderRadius: '0.5rem',
  },
  elements: {
    formButtonPrimary: 
      "bg-[#06354C] hover:bg-[#0F232D] text-sm normal-case font-medium transition-colors duration-200",
    card: "shadow-xl border border-slate-200",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton: 
      "border-slate-300 hover:bg-slate-50 transition-colors duration-200",
    formFieldLabel: "text-slate-700 font-medium",
    formFieldInput: "border-slate-300 focus:border-[#06354C] focus:ring-[#06354C]",
    formFieldInputShowPasswordButton: "text-slate-500",
    footerActionLink: "text-[#06354C] hover:text-[#0F232D] font-medium transition-colors",
    dividerLine: "bg-slate-300",
    dividerText: "text-slate-500",
    identityPreviewText: "text-slate-700",
    identityPreviewEditButton: "text-[#06354C] hover:text-[#0F232D]",
    // Ocultar mensajes de validación en inglés que Clerk no traduce
    formFieldSuccessText: "hidden",
    formFieldErrorText: "text-red-600",
    formFieldWarningText: "text-orange-600",
    formFieldInfoText: "text-slate-600 font-outfit",
  },
  layout: {
    // CSS personalizado para ocultar elementos específicos en inglés
    unsafe_disableDevelopmentModeWarnings: true,
  },
};
