import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-50 border-green-300 text-green-700",
    error: "bg-red-50 border-red-300 text-red-700",
    info: "bg-blue-50 border-blue-300 text-blue-700",
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slideIn">
      <div
        className={`min-w-[280px] max-w-sm px-4 py-3 border rounded-lg shadow-lg ${styles[type]}`}
      >
        <div className="flex justify-between items-center gap-4">
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
