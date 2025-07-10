export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
      <div className="bg-gradient-to-br text-white/90 text-lg font-bold from-[#6d89fa] to-[#33ff40] rounded-lg shadow-lg max-w-2xl border-4 border-red-700 max-h-2/3 h-full w-full p-6 relative overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-xl cursor-pointer"
        >
          ✖️
        </button>
        {children}
      </div>
    </div>
  );
}
