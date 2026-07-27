import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Lightbulb, Bug, MessageSquareText, Sparkles } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useApp } from "../context/AppContext";
import Button from "./Button";

const typeOptions = [
  { value: "saran", icon: Lightbulb, label: "Saran", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", desc: "Ide atau usulan fitur" },
  { value: "bug", icon: Bug, label: "Bug", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", desc: "Laporan error atau masalah" },
  { value: "lainnya", icon: MessageSquareText, label: "Lainnya", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", desc: "Kritik atau pertanyaan" },
];

const FeedbackModal = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [type, setType] = useState("saran");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const charLimit = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await axiosInstance.post("/feedback", { type, message: message.trim() });
      addToast("Terima kasih atas masukannya!", "success");
      setMessage("");
      setType("saran");
      onClose();
    } catch {
      addToast("Gagal mengirim masukan", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Decorative gradient header */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary" />

            <div className="px-6 pt-6 pb-2 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 border border-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text">Kirim Masukan</h3>
                  <p className="text-text-secondary text-sm mt-0.5">Bantu kami makin baik dengan saran atau laporan kamu</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="text-text-muted hover:text-text p-1.5 hover:bg-surface-hover rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
              {/* Type Selection as interactive cards */}
              <div>
                <label className="text-text-secondary text-sm font-semibold mb-3 block">Pilih tipe masukan</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {typeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const selected = type === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setType(opt.value)}
                        className={`
                          flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 active:scale-95
                          ${selected
                            ? `${opt.bg} ${opt.border}`
                            : "border-border/60 hover:border-border bg-surface-hover/50"
                          }
                        `}
                      >
                        <Icon className={`h-5 w-5 ${selected ? opt.color : "text-text-muted"}`} />
                        <span className={`text-xs font-semibold ${selected ? "text-text" : "text-text-secondary"}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[10px] leading-tight text-center ${selected ? "text-text-secondary" : "text-text-muted"}`}>
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-text-secondary text-sm font-semibold">Pesan</label>
                  <span className={`text-xs ${message.length > charLimit ? "text-danger" : "text-text-muted"}`}>
                    {message.length}/{charLimit}
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, charLimit))}
                  placeholder="Ceritakan saran, bug, atau pertanyaanmu di sini..."
                  rows={4}
                  className="w-full bg-input-bg border border-border rounded-xl px-4 py-3 text-text text-sm transition-all resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth icon={Send} loading={sending} className="py-2.5">
                {sending ? "Mengirim..." : "Kirim Masukan"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;