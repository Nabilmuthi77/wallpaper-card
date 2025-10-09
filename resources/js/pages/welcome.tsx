import React, { useEffect, useState } from "react";
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
  const API_URL = "http://wallpaper-card.test/api/wallpaper";

  const [wallpaper, setWallpaper] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [current, setCurrent] = useState(0);

  // Modal & form
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<any | null>(null);

  const [form, setForm] = useState({
    pict_name: "",
    element: "",
    file: null as File | null,
  });

  // === FETCH (GET) ===
  const fetchWallpaper = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.status && result.data) {
        setWallpaper(result.data);
      } else {
        throw new Error("Format data tidak sesuai");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallpaper();
  }, []);

  // === POST ===
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (form.file) formData.append("file", form.file);
      formData.append("pict_name", form.pict_name);
      formData.append("element", form.element);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal menambahkan wallpaper");

      await fetchWallpaper();
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // === PUT ===
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallpaper) return;

    try {
      const formData = new FormData();
      if (form.file) formData.append("file", form.file);
      formData.append("pict_name", form.pict_name);
      formData.append("element", form.element);

      const res = await fetch(`${API_URL}/${selectedWallpaper.id}`, {
        method: "POST", // Laravel kadang butuh _method=PUT untuk FormData
        body: (() => {
          formData.append("_method", "PUT");
          return formData;
        })(),
      });

      if (!res.ok) throw new Error("Gagal mengubah wallpaper");

      await fetchWallpaper();
      setShowEditModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // === DELETE ===
  const handleDelete = async () => {
    if (!selectedWallpaper) return;
    try {
      const res = await fetch(`${API_URL}/${selectedWallpaper.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus wallpaper");

      await fetchWallpaper();
      setShowDeleteModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, file, pict_name: file.name });
    }
  };

  // === Modal Components ===
  const ModalContainer = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );

  const ModalCard = ({
    title,
    onClose,
    onSubmit,
    children,
  }: {
    title: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
  }) => (
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

  // === UI ===
  if (loading)
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        Memuat data...
      </div>
    );

  if (error)
    return (
      <div className="text-red-400 flex justify-center items-center min-h-screen">
        Error: {error}
      </div>
    );

  const nextSlide = () => setCurrent((p) => (p + 1) % wallpaper.length);
  const prevSlide = () => setCurrent((p) => (p - 1 + wallpaper.length) % wallpaper.length);

  return (
    <div className="font-cormorant w-full min-h-screen flex flex-col justify-center items-center py-10 px-4 sm:px-8 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative">
      {/* Tambah */}
      <button
        onClick={() => {
          setForm({ pict_name: "", element: "", file: null });
          setShowAddModal(true);
        }}
        className="absolute top-6 right-6 flex items-center gap-2 bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 hover:scale-105 z-50"
      >
        <Plus className="w-5 h-5" /> Tambah Wallpaper
      </button>

      {/* Slider */}
      <div className="relative w-full max-w-6xl h-[75vh] sm:h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl border border-white/10">
        {wallpaper.map((w, i) => {
          const imageUrl = `/wallpaper/${w.pict_name}`;
          
          return (
            <div
              key={w.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === current ? "opacity-100 z-20" : "opacity-0 z-10"
              }`}
            >
              <div
                className="absolute inset-0 blur-2xl scale-110"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  opacity: 0.35,
                }}
              />
              <div className="flex justify-center items-center h-full">
                <img
                  src={imageUrl}
                  alt={w.pict_name}
                  className="max-h-[80vh] max-w-[90vw] object-contain drop-shadow-2xl"
                />
              </div>

              {/* Info + Buttons */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white px-6 sm:px-10 pb-10 text-center sm:text-left">
                <div className="max-w-2xl mx-auto sm:mx-0">
                  <h2 className="text-3xl font-bold mb-3 capitalize">
                    {w.pict_name.replace(".png", "")}
                  </h2>
                  <p className="text-lg opacity-90 capitalize">
                    Element: {w.element}
                  </p>
                </div>
                <div className="absolute bottom-5 right-5 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedWallpaper(w);
                      setForm({
                        pict_name: w.pict_name,
                        element: w.element,
                        file: null,
                      });
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded-md"
                  >
                    <Pencil className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWallpaper(w);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-700 hover:bg-red-800 p-2 rounded-md"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigasi */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-md z-30 shadow-md hover:scale-105 transition-all"
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-md z-30 shadow-md hover:scale-105 transition-all"
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>
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
                placeholder="Nama Gambar"
                value={form.pict_name}
                onChange={(e) =>
                  setForm({ ...form, pict_name: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Element"
                value={form.element}
                onChange={(e) => setForm({ ...form, element: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-white"
              />
              <button
                type="submit"
                className="mt-4 bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg"
              >
                Simpan
              </button>
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
                placeholder="Nama Gambar"
                value={form.pict_name}
                onChange={(e) =>
                  setForm({ ...form, pict_name: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Element"
                value={form.element}
                onChange={(e) => setForm({ ...form, element: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-white"
              />
              <button
                type="submit"
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg"
              >
                Update
              </button>
            </ModalCard>
          </ModalContainer>
        )}

        {/* === Modal Delete === */}
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
              <p className="text-center mb-4">
                Yakin ingin menghapus{" "}
                <strong>{selectedWallpaper?.pict_name}</strong>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg"
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
