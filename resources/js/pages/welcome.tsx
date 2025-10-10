import React, { useEffect, useState, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Pencil,
  Trash2,
  ImageIcon,
} from "lucide-react";

// ================== CONFIG / PALETTE ==================
const PALETTE = {
  bg: "bg-gradient-to-b from-[#081122] via-[#0A2345] to-[#0B1326]",
  accent: "#00B4FF",
  muted: "#A4C8E1",
  card: "rgba(8,20,38,0.6)",
  glass: "rgba(255,255,255,0.05)",
};

const ELEMENT_COLORS: Record<string, string> = {
  Pyro: "#FF7A59",
  Hydro: "#00A8FF",
  Dendro: "#8CDB47",
  Electro: "#D28CFF",
  Anemo: "#4CE0C7",
  Cryo: "#8CE2EE",
  Geo: "#FFD166",
};

// ==================== SMALL REUSABLE COMPONENTS ====================
const IconButton = ({ children, ...props }: any) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center p-2 rounded-xl transition-transform shadow-md hover:scale-105 ${props.className || ""}`}
  >
    {children}
  </button>
);

const ModalShell = memo(({ children, onClose }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="relative z-10 w-full max-w-2xl p-6 rounded-2xl"
      style={{ background: PALETTE.card, border: `1px solid rgba(255,255,255,0.06)` }}
    >
      {children}
    </motion.div>
  </motion.div>
));

// ==================== MAIN COMPONENT ====================
export default function WallpaperSlider() {
  const API_URL = "http://wallpaper-card.test/api/wallpaper";

  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selected, setSelected] = useState<any | null>(null);

  const [form, setForm] = useState({ char_name: "", element: "", file: null as File | null });

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<number | null>(null);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    fetchList();
    // Keyboard Nav
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") {
        setShowAdd(false);
        setShowEdit(false);
        setShowDelete(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Simple Autoplay
  useEffect(() => {
    if (!autoplay || wallpapers.length <= 1) return;
    autoplayRef.current = window.setInterval(() => setCurrent((p) => (p + 1) % wallpapers.length), 5000);
    return () => { if (autoplayRef.current) window.clearInterval(autoplayRef.current); };
  }, [autoplay, wallpapers.length]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json?.status && Array.isArray(json.data)) setWallpapers(json.data);
      else throw new Error("Format response tidak sesuai");
    } catch (err: any) {
      setError(err.message || "Gagal memuat wallpaper");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setForm((s) => ({ ...s, file: f }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("char", form.char_name);
      fd.append("element", form.element);
      if (form.file) fd.append("file", form.file);
      const res = await fetch(API_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Gagal menambahkan");
      await fetchList();
      setShowAdd(false);
    } catch (err: any) { alert(err.message); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      const fd = new FormData();
      fd.append("char", form.char_name);
      fd.append("element", form.element);
      if (form.file) fd.append("file", form.file);
      fd.append("_method", "PUT");
      const res = await fetch(`${API_URL}/${selected.id}`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Gagal mengedit");
      await fetchList();
      setShowEdit(false);
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`${API_URL}/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      await fetchList();
      setShowDelete(false);
    } catch (err: any) { alert(err.message); }
  };

  const next = () => setCurrent((p) => (p + 1) % wallpapers.length);
  const prev = () => setCurrent((p) => (p - 1 + wallpapers.length) % wallpapers.length);

  // Touch Swipe
  useEffect(() => {
    let startX = 0;
    const el = carouselRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
    };
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [wallpapers.length]);

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${PALETTE.bg}`}>
        <div className="text-center text-white/90">
          <div className="mb-4">Memuat wallpaper...</div>
          <div className="animate-pulse text-sm">Tunggu sebentar</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className={`min-h-screen flex items-center justify-center ${PALETTE.bg}`}>
        <div className="text-red-400">Error: {error}</div>
      </div>
    );

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-8 ${PALETTE.bg} text-white font-sans`}> 
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Thumbnail list (mobile collapses to bottom) */}
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Gallery</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setForm({ char_name: "", element: "", file: null }); setShowAdd(true); }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="sr-only" checked={autoplay} onChange={() => setAutoplay((s) => !s)} />
                <span className={`px-2 py-1 rounded-full text-xs ${autoplay ? "bg-white/8" : "bg-white/4"}`}>{autoplay ? "Autoplay" : "Pause"}</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            {wallpapers.map((w, i) => (
              <button
                key={w.id}
                onClick={() => setCurrent(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-shadow hover:shadow-lg text-left ${i === current ? 'ring-2 ring-white/10 bg-white/4' : 'bg-white/2'}`}
              >
                <div className="w-14 h-10 rounded-md bg-black overflow-hidden flex-shrink-0">
                  <img src={`wallpaper/${w.pict_name}`} alt={w.char_name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1">
                  <div className="font-medium truncate">{w.char_name}</div>
                  <div className="text-xs text-white/60">{w.element}</div>
                </div>
                <div style={{ width: 10, height: 10, borderRadius: 6, background: ELEMENT_COLORS[w.element] || PALETTE.accent }} />
              </button>
            ))}
          </div>
        </aside>

        {/* CENTER: Big viewer */}
        <main className="lg:col-span-6 order-1 lg:order-2">
          <div ref={carouselRef} className="relative rounded-2xl overflow-hidden shadow-2xl" onMouseEnter={() => setAutoplay(false)} onMouseLeave={() => setAutoplay(true)}>
            <div className="absolute inset-0 -z-10 opacity-40" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.35))` }} />
            <AnimatePresence initial={false} mode="wait">
              {wallpapers.slice(current, current + 1).map((w) => (
                <motion.div key={w.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5 }}>
                  <div className="relative h-[60vh] sm:h-[72vh] flex items-center justify-center" style={{ background: PALETTE.glass }}>
                    <img src={`wallpaper/${w.pict_name}`} alt={w.char_name} className="max-h-[60vh] sm:max-h-[72vh] w-auto object-contain rounded-2xl drop-shadow-[0_12px_40px_rgba(0,230,195,0.18)]" />

                    <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="bg-gradient-to-r from-black/70 to-transparent rounded-xl p-4 max-w-xl">
                        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: ELEMENT_COLORS[w.element] || PALETTE.muted }}>{w.char_name}</h2>
                        <p className="text-sm text-white/70 mt-1">Element: <span style={{ color: ELEMENT_COLORS[w.element] || PALETTE.muted }}>{w.element}</span></p>
                      </div>

                      <div className="flex items-center gap-3">
                        <IconButton onClick={() => { setSelected(w); setForm({ char_name: w.char_name, element: w.element, file: null }); setShowEdit(true); }} className="bg-yellow-500/90 text-white">
                          <Pencil className="w-4 h-4" />
                        </IconButton>
                        <IconButton onClick={() => { setSelected(w); setShowDelete(true); }} className="bg-red-600/90 text-white">
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                        <div className="hidden sm:flex items-center gap-2 bg-white/6 px-3 py-2 rounded-lg">
                          <button onClick={prev} aria-label="previous" className="p-1 rounded-md hover:bg-white/4"><ChevronLeft className="w-5 h-5" /></button>
                          <button onClick={next} aria-label="next" className="p-1 rounded-md hover:bg-white/4"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* small indicators */}
            <div className="absolute top-4 left-4 flex gap-2">
              {wallpapers.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'scale-125 bg-white' : 'bg-white/30'}`} aria-label={`Go to ${i + 1}`} />
              ))}
            </div>

            {/* mobile controls */}
            <div className="absolute left-4 right-4 bottom-4 flex justify-between sm:hidden">
              <button onClick={prev} className="bg-white/6 p-3 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={next} className="bg-white/6 p-3 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </main>

        {/* RIGHT: Details / actions */}
        <aside className="lg:col-span-3 order-3">
          <div className="p-4 rounded-2xl" style={{ background: PALETTE.glass }}>
            <h4 className="text-lg font-semibold mb-2">Detail</h4>
            {wallpapers[current] ? (
              <div className="space-y-3">
                <div className="text-sm text-white/70">Nama</div>
                <div className="font-medium">{wallpapers[current].char_name}</div>

                <div className="text-sm text-white/70">Element</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: ELEMENT_COLORS[wallpapers[current].element] || PALETTE.accent }} />
                  <div className="font-medium">{wallpapers[current].element}</div>
                </div>

                <div className="text-sm text-white/70">Preview</div>
                <div className="w-full h-40 rounded-lg overflow-hidden bg-black/10 flex items-center justify-center">
                  <img src={`wallpaper/${wallpapers[current].pict_name}`} alt="preview" className="object-contain max-h-full" />
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setSelected(wallpapers[current]); setForm({ char_name: wallpapers[current].char_name, element: wallpapers[current].element, file: null }); setShowEdit(true); }} className="flex-1 px-3 py-2 rounded-lg bg-white/6">Edit</button>
                  <button onClick={() => { setSelected(wallpapers[current]); setShowDelete(true); }} className="flex-1 px-3 py-2 rounded-lg bg-red-700">Hapus</button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-white/60">Tidak ada wallpaper</div>
            )}
          </div>
        </aside>
      </div>

      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {showAdd && (
          <ModalShell onClose={() => setShowAdd(false)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Tambah Wallpaper</h3>
              <button onClick={() => setShowAdd(false)} className="p-2"><X /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input value={form.char_name} onChange={(e) => setForm((f) => ({ ...f, char_name: e.target.value }))} placeholder="Nama Karakter" className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10" />
              <select
                value={form.element}
                onChange={(e) => setForm((f) => ({ ...f, element: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 text-white border border-white/10 focus:border-cyan-400 appearance-none"
              >
                <option value="" style={{ backgroundColor: "rgba(15, 25, 45, 0.95)", }}>
                  --- Pilih Element ---
                </option>
                {Object.keys(ELEMENT_COLORS).map((el) => (
                  <option
                    key={el}
                    value={el}
                    style={{
                      backgroundColor: "rgba(15, 25, 45, 0.95)",
                      color: ELEMENT_COLORS[el],
                    }}
                  >
                    {el}
                  </option>
                ))}
              </select>
              <label className="w-full p-3 text-center cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon />
                  <div className="text-sm">Klik untuk memilih file atau drag & drop</div>
                </div>
              </label>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg bg-white/6">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#1467E2] text-black font-medium">Simpan</button>
              </div>
            </form>
          </ModalShell>
        )}

        {showEdit && selected && (
          <ModalShell onClose={() => setShowEdit(false)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Edit Wallpaper</h3>
              <button onClick={() => setShowEdit(false)} className="p-2"><X /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <input value={form.char_name} onChange={(e) => setForm((f) => ({ ...f, char_name: e.target.value }))} placeholder="Nama Karakter" className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/10" />
              <select
                value={form.element}
                onChange={(e) => setForm((f) => ({ ...f, element: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/30 text-white border border-white/10 appearance-none"
              >
                <option
                  value=""
                  style={{ backgroundColor: 'rgba(15, 25, 45, 0.95)' }}
                >
                  --- Pilih Element ---
                </option>
                {Object.keys(ELEMENT_COLORS).map((el) => (
                  <option
                    key={el}
                    value={el}
                    style={{
                      backgroundColor: 'rgba(15, 25, 45, 0.95)',
                      color: ELEMENT_COLORS[el],
                    }}
                  >
                    {el}
                  </option>
                ))}
              </select>

              <label className="w-full p-3 text-center cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon />
                  <div className="text-sm">Pilih file baru (Opsional)</div>
                </div>
              </label>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 rounded-lg bg-white/6">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-medium">Update</button>
              </div>
            </form>
          </ModalShell>
        )}

        {showDelete && selected && (
          <ModalShell onClose={() => setShowDelete(false)}>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Hapus Wallpaper</h3>
            </div>
            <p className="mb-4">Yakin ingin menghapus <strong style={{ color: PALETTE.accent }}>{selected.char_name}</strong> ?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 rounded-lg bg-white/6">Batal</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600">Hapus</button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

    </div>
  );
}
