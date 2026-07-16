import { EyeOff } from "lucide-react";

export default function PanicButton() {
  const handlePanicRedirect = () => {
    // Immediate escape redirect to preserve privacy
    window.location.href = "https://www.google.com";
  };

  return (
    <button
      id="panic-button"
      onClick={handlePanicRedirect}
      title="Thoát nhanh (Bảo vệ riêng tư)"
      className="fixed top-4 left-4 z-50 p-2.5 rounded-full bg-slate-100/50 hover:bg-slate-200/80 backdrop-blur-md border border-slate-200/40 text-slate-400 hover:text-slate-600 transition-all duration-300 shadow-sm opacity-60 hover:opacity-100 group"
    >
      <EyeOff className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
      <span className="sr-only">Thoát nhanh</span>
    </button>
  );
}
