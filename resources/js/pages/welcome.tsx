import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    src: "",
  });

  const nextSlide = () => setCurrent((prev) => (prev + 1) % wallpapers.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + wallpapers.length) % wallpapers.length);

  const openAddModal = () => {
    setForm({ title: "", description: "", src: "" });
    setShowAddModal(true);
  };

  const openEditModal = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setForm({
      title: wallpaper.title,
      description: wallpaper.description,
      src: wallpaper.src,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setShowDeleteModal(true);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.src || !form.title) return;
    setWallpapers((prev) => [...prev, { id: Date.now(), ...form }]);
    setShowAddModal(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setWallpapers((prev) =>
      prev.map((w) =>
        w.id === selectedWallpaper.id ? { ...w, ...form } : w
      )
    );
    setShowEditModal(false);
  };

  const handleDelete = () => {
    setWallpapers((prev) => prev.filter((w) => w.id !== selectedWallpaper.id));
    setShowDeleteModal(false);
    if (current >= wallpapers.length - 1) setCurrent(0);
  };

  const ModalContainer = ({ children }) => (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );

  const ModalCard = ({ title, onClose, onSubmit, children }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: -30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 30 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-gray-900 text-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
      >
        <X className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {children}
      </form>
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-10 px-4 sm:px-8 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative">
      {/* Button Tambah */}
      <button
        onClick={openAddModal}
        className="absolute top-6 right-6 flex items-center gap-2 bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 hover:scale-105 z-50"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Tambah</span>
      </button>

      {/* Slider */}
      <div className="relative w-full max-w-6xl h-[75vh] sm:h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl border border-white/10">
        {wallpapers.map((wallpaper, index) => (
          <div
            key={wallpaper.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            {/* Background */}
            <div
              className="absolute inset-0 blur-2xl scale-110"
              style={{
                backgroundImage: `url(${wallpaper.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.35,
              }}
            />
            {/* Wallpaper */}
            <div className="flex justify-center items-center h-full">
              <img
                src={wallpaper.src}
                alt={wallpaper.title}
                className="max-h-[80vh] max-w-[90vw] object-contain drop-shadow-2xl"
              />
            </div>
            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white px-6 sm:px-10 pb-10 text-center sm:text-left">
              <div className="max-w-2xl mx-auto sm:mx-0">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                  {wallpaper.title}
                </h2>
                <p className="text-sm sm:text-lg md:text-xl opacity-90 leading-relaxed mt-5">
                  {wallpaper.description}
                </p>
              </div>
              {/* Buttons Edit & Delete */}
              <div className="absolute bottom-5 right-5 flex gap-3">
                <button
                  onClick={() => openEditModal(wallpaper)}
                  className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded-md transition-all duration-300 hover:scale-105 shadow"
                >
                  <Pencil className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => openDeleteModal(wallpaper)}
                  className="bg-red-700 hover:bg-red-800 p-2 rounded-md transition-all duration-300 hover:scale-105 shadow"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation */}
        <button
          onClick={prevSlide}
          aria-label="Previous"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-md z-30 shadow-md hover:scale-105 transition-all"
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-md z-30 shadow-md hover:scale-105 transition-all"
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 w-full flex justify-center gap-2 z-30">
          {wallpapers.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current
                  ? "bg-white shadow-lg scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* === Modal Tambah === */}
      <AnimatePresence>
        {showAddModal && (
          <ModalContainer>
            <ModalCard
              title="Tambah Wallpaper"
              onClose={() => setShowAddModal(false)}
              onSubmit={handleAdd}
            >
              <input
                type="text"
                placeholder="Judul"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Deskripsi"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <input
                type="text"
                placeholder="URL Gambar"
                value={form.src}
                onChange={(e) => setForm({ ...form, src: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 font-semibold"
                >
                  Simpan
                </button>
              </div>
            </ModalCard>
          </ModalContainer>
        )}

        {/* === Modal Edit === */}
        {showEditModal && (
          <ModalContainer>
            <ModalCard
              title="Edit Wallpaper"
              onClose={() => setShowEditModal(false)}
              onSubmit={handleEdit}
            >
              <input
                type="text"
                placeholder="Judul"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Deskripsi"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <input
                type="text"
                placeholder="URL Gambar"
                value={form.src}
                onChange={(e) => setForm({ ...form, src: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 font-semibold"
                >
                  Simpan
                </button>
              </div>
            </ModalCard>
          </ModalContainer>
        )}

        {/* === Modal Hapus === */}
        {showDeleteModal && (
          <ModalContainer>
            <ModalCard
              title="Hapus Wallpaper?"
              onClose={() => setShowDeleteModal(false)}
              onSubmit={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              <p className="text-center text-gray-300 mb-4">
                Apakah kamu yakin ingin menghapus{" "}
                <span className="font-semibold text-white">
                  {selectedWallpaper?.title}
                </span>
                ?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 font-semibold"
                >
                  Hapus
                </button>
              </div>
            </ModalCard>
          </ModalContainer>
        )}
      </AnimatePresence>
    </div>
  );
}
