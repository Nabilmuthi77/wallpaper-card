import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WallpaperSlider() {
  const [wallpapers, setWallpapers] = useState([
    {
      id: 1,
      src: "/wallpapers/ayaka.webp",
      title: "Kamisato Ayaka",
      description:
        "Daughter of the Yashiro Commission's Kamisato Clan. Dignified and elegant, as well as wise and strong.",
    },
    {
      id: 2,
      src: "/wallpapers/raiden.webp",
      title: "Raiden Shogun",
      description:
        "Her Excellency, the Almighty Narukami Ogosho, who promised the people of Inazuma an unchanging Eternity.",
    },
    {
      id: 3,
      src: "/wallpapers/shenhe.webp",
      title: "Shenhe",
      description:
        "An adepti disciple with a most unusual air about her. Having spent much time cultivating in isolation in Liyue's mountains, she has become every bit as cool and distant as the adepti themselves.",
    },
  ]);

  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newWallpaper, setNewWallpaper] = useState({
    title: "",
    description: "",
    src: "",
  });

  const nextSlide = () => setCurrent((prev) => (prev + 1) % wallpapers.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + wallpapers.length) % wallpapers.length);

  const handleAddWallpaper = (e) => {
    e.preventDefault();
    if (!newWallpaper.src || !newWallpaper.title)
      return alert("Lengkapi semua field!");
    setWallpapers((prev) => [...prev, { id: Date.now(), ...newWallpaper }]);
    setNewWallpaper({ title: "", description: "", src: "" });
    setShowModal(false);
    setCurrent(wallpapers.length);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-10 px-4 sm:px-8 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative">
      {/* Button Tambah Wallpaper */}
      <button
        onClick={() => setShowModal(true)}
        className="font-cormorant absolute top-6 right-6 flex items-center gap-2 bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 hover:scale-105 z-50"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Tambah Wallpaper</span>
      </button>

      {/* Slider Container */}
      <div className="relative w-full max-w-6xl h-[75vh] sm:h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl border border-white/10">
        {wallpapers.map((wallpaper, index) => (
          <div
            key={wallpaper.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            {/* Background Blur */}
            <div
              className="absolute inset-0 blur-2xl scale-110"
              style={{
                backgroundImage: `url(${wallpaper.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.35,
              }}
            />

            {/* Image (original ratio) */}
            <div className="flex justify-center items-center h-full w-full">
              <img
                src={wallpaper.src}
                alt={wallpaper.title}
                className="max-h-[80vh] max-w-[90vw] object-contain transition-all duration-700 drop-shadow-2xl"
              />
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white px-6 sm:px-10 pb-10 text-center sm:text-left">
              <div className="max-w-2xl mx-auto sm:mx-0">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                  {wallpaper.title}
                </h2>
                <p className="text-sm sm:text-lg md:text-xl opacity-90 drop-shadow-md leading-relaxed mt-5">
                  {wallpaper.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          aria-label="Previous wallpaper"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-md p-2 sm:p-3 rounded-md z-30 transition-all shadow-md hover:scale-105"
        >
          <ChevronLeft className="text-white w-5 h-5 sm:w-7 sm:h-7" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next wallpaper"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-md p-2 sm:p-3 rounded-md z-30 transition-all shadow-md hover:scale-105"
        >
          <ChevronRight className="text-white w-5 h-5 sm:w-7 sm:h-7" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-5 w-full flex justify-center gap-2 z-30">
          {wallpapers.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                i === current
                  ? "bg-white shadow-lg scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal Tambah Wallpaper */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal"
            className="font-cormorant fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="content"
              initial={{ scale: 0.8, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-gray-900 text-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">
                Tambah Wallpaper
              </h2>

              <form onSubmit={handleAddWallpaper} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Judul Wallpaper"
                  value={newWallpaper.title}
                  onChange={(e) =>
                    setNewWallpaper({ ...newWallpaper, title: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Deskripsi (opsional)"
                  value={newWallpaper.description}
                  onChange={(e) =>
                    setNewWallpaper({
                      ...newWallpaper,
                      description: e.target.value,
                    })
                  }
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={3}
                ></textarea>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-800 hover:bg-indigo-900 transition-all font-semibold"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
