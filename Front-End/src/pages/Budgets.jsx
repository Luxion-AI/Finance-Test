import { useState, useMemo } from "react";
import Skeleton from "../components/Skeleton";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Wallet,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import Select from "../components/Select";
import { formatCurrency } from "../utils/formatters";

const Budgets = () => {
  const {
    dataLoading,
    categories,
    budgets,
    transactions,
    addBudget,
    editBudget,
    deleteBudget,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [search, setSearch] = useState("");

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "expense"),
    [categories]
  );

  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => {
      const cat = categories.find((c) => c.id === b.categoryId);
      const catName = cat ? cat.name.toLowerCase() : "";
      const matchesSearch = catName.includes(search.toLowerCase());
      const matchesPeriod = b.month === selectedMonth && b.year === selectedYear;
      return matchesPeriod && matchesSearch;
    });
  }, [budgets, categories, selectedMonth, selectedYear, search]);

  const totalBudget = useMemo(
    () => filteredBudgets.reduce((sum, b) => sum + b.amount, 0),
    [filteredBudgets]
  );

  const totalSpent = useMemo(
    () => filteredBudgets.reduce((sum, b) => sum + (b.spent || 0), 0),
    [filteredBudgets]
  );

  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = now.getFullYear() - 1; y <= now.getFullYear() + 1; y++) {
      years.push(y);
    }
    return years;
  }, []);

  const handleOpenAddModal = () => {
    setEditingBudget(null);
    setFormData({ amount: "", categoryId: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bud) => {
    setEditingBudget(bud);
    setFormData({ amount: bud.amount.toString(), categoryId: bud.categoryId });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = "Nominal budget harus lebih dari Rp 0";
    }
    if (!formData.categoryId) {
      errors.categoryId = "Pilih kategori";
    }
    const duplicate = filteredBudgets.find(
      (b) =>
        b.categoryId === Number(formData.categoryId) &&
        (!editingBudget || b.id !== editingBudget.id)
    );
    if (duplicate) {
      errors.categoryId = "Budget untuk kategori ini sudah ada";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        amount: Number(formData.amount),
        categoryId: Number(formData.categoryId),
        month: selectedMonth,
        year: selectedYear,
      };

      setSubmitting(true);
      let ok;
      if (editingBudget) {
        ok = await editBudget(editingBudget.id, payload);
      } else {
        ok = await addBudget(payload);
      }
      setSubmitting(false);
      if (ok) setIsModalOpen(false);
    };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "text-danger";
    if (percentage >= 80) return "text-warning";
    return "text-success";
  };

  const getBarColor = (percentage) => {
    if (percentage >= 100) return "bg-danger";
    if (percentage >= 80) return "bg-warning";
    return "bg-success";
  };

  const getBarWidth = (percentage) => Math.min(percentage, 100);

  return (
    <DashboardLayout>
            {dataLoading ? (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between">
            <div>
              <Skeleton height="h-8" className="w-48 mb-2" />
              <Skeleton height="h-4" className="w-72" />
            </div>
          </div>
          <div className="bg-surface border border-border/70 rounded-2xl p-5">
            <div className="flex gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton height="h-9 w-9" className="!rounded-xl" />
                  <div>
                    <Skeleton height="h-3" className="w-20 mb-1" />
                    <Skeleton height="h-5" className="w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-surface border border-border/70 rounded-2xl p-5">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton height="h-10 w-10" className="!rounded-xl" />
                    <div>
                      <Skeleton height="h-3.5" className="w-24 mb-1" />
                      <Skeleton height="h-2.5" className="w-20" />
                    </div>
                  </div>
                </div>
                <Skeleton height="h-6" className="w-32 mb-1" />
                <Skeleton height="h-3" className="w-24 mb-3" />
                <Skeleton height="h-2.5" className="w-full !rounded-full mb-3" />
                <Skeleton height="h-3" className="w-16" />
              </div>
            ))}
          </div>
        </div>
      ) : (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-text">Anggaran Bulanan</h2>
            <p className="text-text-secondary text-sm">
              Tetapkan batas pengeluaran per kategori dan pantau penggunaannya.
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
            Budget Baru
          </Button>
        </div>

        <Card className="p-4" hover={false}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">
                  Total Anggaran
                </p>
                <p className="text-lg font-black text-text">
                  {formatCurrency(totalBudget)}
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger/10 rounded-xl text-danger">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">
                  Total Terpakai
                </p>
                <p className="text-lg font-black text-danger">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" />
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${totalBudget - totalSpent >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                <Wallet className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">
                  Sisa
                </p>
                <p className={`text-lg font-black ${totalBudget - totalSpent >= 0 ? "text-success" : "text-danger"}`}>
                  {formatCurrency(Math.max(0, totalBudget - totalSpent))}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex gap-3">
            <Select
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(Number(val))}
              options={monthNames.map((name, idx) => ({
                label: name,
                value: idx + 1,
              }))}
              className="min-w-[130px]"
            />
            <Select
              value={selectedYear}
              onChange={(val) => setSelectedYear(Number(val))}
              options={yearOptions.map((y) => ({
                label: String(y),
                value: y,
              }))}
              className="min-w-[100px]"
            />
          </div>
          <div className="relative flex items-center flex-1 min-w-0">
            <Search className="absolute left-3.5 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input-bg border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {filteredBudgets.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <AnimatePresence initial={false}>
              {filteredBudgets.map((bud) => {
                const cat = categories.find((c) => c.id === bud.categoryId);
                const pct = bud.percentage || 0;
                const overBudget = pct >= 100;

                return (
                  <motion.div
                    key={bud.id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.95, y: 15 },
                      visible: { opacity: 1, scale: 1, y: 0 },
                    }}
                    layout
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  >
                    <Card
                      className={`p-5 border ${overBudget ? "border-danger/40" : "border-border/80"} flex flex-col text-left`}
                      hover={false}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2.5 rounded-xl text-white flex items-center justify-center"
                            style={{
                              backgroundColor: cat ? `${cat.color}20` : "#64748b20",
                              color: cat ? cat.color : "#64748b",
                            }}
                          >
                            <Wallet className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-text text-sm">
                              {cat ? cat.name : "Tidak Diketahui"}
                            </h4>
                            <p className="text-[10px] text-text-secondary">
                              {monthNames[selectedMonth - 1]} {selectedYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(bud)}
                            aria-label="Edit budget"
                            className="p-1.5 hover:bg-surface-hover text-text-secondary hover:text-primary rounded-lg transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(bud.id)}
                            aria-label="Hapus budget"
                            className="p-1.5 hover:bg-surface-hover text-text-secondary hover:text-danger rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-xl font-black text-text">
                            {formatCurrency(bud.spent || 0)}
                          </span>
                          <span className="text-xs text-text-secondary font-medium">
                            dari {formatCurrency(bud.amount)}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2.5 bg-input-bg border border-border/50 rounded-full overflow-hidden mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getBarWidth(pct)}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${getBarColor(pct)}`}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${getStatusColor(pct)}`}>
                          {overBudget ? (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Over budget!
                            </span>
                          ) : pct >= 80 ? (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Mendekati batas
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Aman
                            </span>
                          )}
                        </span>
                        <span className="text-xs font-bold text-text">{pct}%</span>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            title="Belum Ada Anggaran"
            description="Buat budget untuk membatasi pengeluaran per kategori bulan ini."
            action={
              <Button variant="secondary" size="sm" onClick={handleOpenAddModal}>
                Buat Budget
              </Button>
            }
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingBudget ? "Edit Budget" : "Budget Baru"}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="p-3 bg-surface-hover rounded-xl text-xs text-text-secondary font-medium">
              Periode: <span className="font-bold text-text">{monthNames[selectedMonth - 1]} {selectedYear}</span>
            </div>

            <div className="flex flex-col">
              <Select
                label="Kategori Pengeluaran"
                value={formData.categoryId || ""}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, categoryId: val }))
                }
                disabled={!!editingBudget}
                placeholder="Pilih Kategori"
                options={expenseCategories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
                error={formErrors.categoryId}
              />
            </div>

            <Input
              label="Nominal Budget (Rp)"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="Contoh: 500000"
              error={formErrors.amount}
            />

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" className="flex-1" loading={submitting}>
                {submitting ? "Menyimpan..." : editingBudget ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </form>
        </Modal>

        <ConfirmModal
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteBudget(deletingId)}
          title="Hapus Budget"
          message="Apakah Anda yakin ingin menghapus budget ini?"
        />
      </div>
      )}
    </DashboardLayout>
  );
};

export default Budgets;
