import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Calendar,
  Tag,
  DollarSign,
  FileText,
  Download,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Select from "../components/Select";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatDateShort } from "../utils/formatters";

const Transactions = () => {
  const {
    dataLoading,
    transactions,
    categories,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addToast,
  } = useApp();

  const location = useLocation();

  // Filters State
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  // Filter transaksi berdasarkan search, tipe, kategori, & bulan
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const cat = categories.find((c) => c.id === tx.categoryId);
      const catName = cat ? cat.name.toLowerCase() : "";
      const matchesSearch =
        (tx.description && tx.description.toLowerCase().includes(search.toLowerCase())) ||
        catName.includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || tx.categoryId === categoryFilter;
      const matchesMonth =
        monthFilter === "all" || (tx.date && tx.date.startsWith(monthFilter));
      const matchesDateStart = !dateStart || tx.date >= dateStart;
      const matchesDateEnd = !dateEnd || tx.date <= dateEnd;

      return matchesSearch && matchesType && matchesCategory && matchesMonth && matchesDateStart && matchesDateEnd;
    });
  }, [transactions, categories, search, typeFilter, categoryFilter, monthFilter, dateStart, dateEnd]);

  // Mengambil daftar bulan unik dari daftar transaksi (YYYY-MM)
  const uniqueMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach((tx) => {
      if (tx.date) {
        months.add(tx.date.substring(0, 7));
      }
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // Sort filtered transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    switch (sortBy) {
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "amount-asc":
        return sorted.sort((a, b) => a.amount - b.amount);
      case "amount-desc":
        return sorted.sort((a, b) => b.amount - a.amount);
      default:
        return sorted;
    }
  }, [filteredTransactions, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setMonthFilter("all");
    setSortBy("date-desc");
    setDateStart("");
    setDateEnd("");
  };

  // Modal open helpers
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setFormData({
      type: "expense",
      amount: "",
      categoryId: categories.find((c) => c.type === "expense")?.id || "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      type: tx.type,
      amount: tx.amount.toString(),
      categoryId: tx.categoryId,
      date: tx.date,
      note: tx.description,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Auto trigger Add Modal from Dashboard click
  useEffect(() => {
    if (location.state?.openAddModal) {
      handleOpenAddModal();
      // Clear location state history so it doesn't reopen on reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle category dropdown change based on transaction type
  const filteredCategoriesForForm = useMemo(() => {
    return categories.filter((cat) => cat.type === formData.type);
  }, [categories, formData.type]);

  const handleExportCSV = () => {
    const headers = ["Tanggal", "Tipe", "Kategori", "Catatan", "Jumlah"];
    const rows = filteredTransactions.map((tx) => {
      const cat = categories.find((c) => c.id === tx.categoryId);
      const date = new Date(tx.date).toLocaleDateString("id-ID");
      const type = tx.type === "income" ? "Pemasukan" : "Pengeluaran";
      const catName = cat ? cat.name : "Lainnya";
      const note = (tx.description || "").replace(/,/g, " ");
      const amount = tx.amount;
      return [date, type, catName, note, amount].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transaksi-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast("Berhasil export transaksi ke CSV!", "success");
  };

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Header
    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246);
    doc.text('FinTrack', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Laporan Transaksi', 14, 30);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Dicetak: ${today}`, 14, 36);
    if (monthFilter !== 'all') {
      const [y, m] = monthFilter.split('-');
      const monthName = new Date(y, m - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      doc.text(`Periode: ${monthName}`, 14, 42);
    }

    const cols = ['Tanggal', 'Kategori', 'Catatan', 'Tipe', 'Jumlah'];
    const rows = filteredTransactions.map((tx) => {
      const cat = categories.find((c) => c.id === tx.categoryId);
      const date = new Date(tx.date).toLocaleDateString('id-ID');
      const type = tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
      const catName = cat ? cat.name : 'Lainnya';
      const note = tx.description || '-';
      const amount = tx.type === 'income' ? `Rp ${Number(tx.amount).toLocaleString('id-ID')}` : `-Rp ${Number(tx.amount).toLocaleString('id-ID')}`;
      return [date, catName, note, type, amount];
    });

    autoTable(doc, {
      head: [cols],
      body: rows,
      startY: monthFilter !== 'all' ? 48 : 42,
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [59, 130, 246], fontSize: 8, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 28 },
        2: { cellWidth: 55 },
        3: { cellWidth: 28 },
        4: { cellWidth: 35, halign: 'right' },
      },
      footStyles: { fillColor: [241, 245, 249], fontStyle: 'bold', fontSize: 8 },
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY || 50;
    const totalIncome = filteredTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = filteredTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text(`Total Pemasukan: Rp ${totalIncome.toLocaleString('id-ID')}`, 14, finalY + 12);
    doc.setTextColor(239, 68, 68);
    doc.text(`Total Pengeluaran: Rp ${totalExpense.toLocaleString('id-ID')}`, 14, finalY + 20);
    doc.setTextColor(30, 41, 59);
    doc.setFont('Helvetica', 'bold');
    const balance = totalIncome - totalExpense;
    doc.setTextColor(balance >= 0 ? 16 : 239, balance >= 0 ? 185 : 68, balance >= 0 ? 129 : 68);
    doc.text(`Saldo: Rp ${Math.abs(balance).toLocaleString('id-ID')}`, 14, finalY + 28);

    doc.save(`laporan-transaksi-${new Date().toISOString().slice(0, 10)}.pdf`);
    addToast('Berhasil export transaksi ke PDF!', 'success');
  };

  const handleTypeChange = (type) => {
    const matchedCats = categories.filter((c) => c.type === type);
    setFormData((prev) => ({
      ...prev,
      type,
      categoryId: matchedCats.length > 0 ? matchedCats[0].id : "",
    }));
  };

  // Form validations
  const validateForm = () => {
    const errors = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = "Nominal harus lebih dari Rp 0";
    }
    if (!formData.categoryId) {
      errors.categoryId = "Silakan pilih kategori";
    }
    if (!formData.date) {
      errors.date = "Tanggal wajib diisi";
    }
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    let ok;
    if (editingTransaction) {
      ok = await editTransaction(editingTransaction.id, formData);
    } else {
      ok = await addTransaction(formData);
    }
    setSubmitting(false);
    if (ok) setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      {dataLoading ? (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between">
            <div>
              <Skeleton height="h-8" className="w-48 mb-2" />
              <Skeleton height="h-4" className="w-64" />
            </div>
          </div>
          <div className="bg-surface border border-border/70 rounded-2xl p-4">
            <Skeleton height="h-10" count={1} />
          </div>
          <div className="bg-surface border border-border/70 rounded-2xl p-0 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4 border-b border-border/30 last:border-0"
              >
                <Skeleton height="h-4" className="w-24" />
                <Skeleton height="h-4" className="w-28" />
                <Skeleton height="h-4" className="w-40" />
                <Skeleton height="h-4" className="w-20" />
                <Skeleton height="h-4" className="w-28" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-text">
                Riwayat Transaksi
              </h2>
              <p className="text-text-secondary text-sm">
                Kelola seluruh pemasukan dan pengeluaran Anda.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={Download}
                onClick={handleExportCSV}
                className="text-sm"
              >
                Export CSV
              </Button>
              <Button
                variant="secondary"
                icon={FileText}
                onClick={handleExportPDF}
                className="text-sm"
              >
                Export PDF
              </Button>
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleOpenAddModal}
              >
                Transaksi Baru
              </Button>
            </div>
          </div>

        {/* Filters Box */}
        <Card className="p-4" hover={false}>
          {/* Mobile: Collapsible toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text transition-colors md:hidden mb-3"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filtersOpen ? "Sembunyikan Filter" : "Tampilkan Filter"}
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              {[typeFilter, categoryFilter, monthFilter, sortBy, dateStart, dateEnd].filter(v => v && v !== "all" && v !== "date-desc").length}
            </span>
          </button>

          {/* Search always visible */}
          <div className="relative flex items-center md:hidden mb-3">
            <Search className="absolute left-3.5 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Cari catatan atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input-bg border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Filter rows - visible on md+, animated collapsible on mobile */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              filtersOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            } md:max-h-[500px] md:opacity-100`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search (desktop only) */}
              <div className="relative hidden md:flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Cari catatan atau kategori..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-input-bg border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Type Filter */}
              <Select
                value={typeFilter}
                onChange={(val) => setTypeFilter(val)}
                options={[
                  { label: "Semua Tipe", value: "all" },
                  { label: "Pemasukan (+)", value: "income" },
                  { label: "Pengeluaran (-)", value: "expense" },
                ]}
                className=""
              />

              {/* Category Filter */}
              <Select
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val)}
                options={[
                  { label: "Semua Kategori", value: "all" },
                  ...categories.map((cat) => ({
                    label: `${cat.name} (${cat.type === "income" ? "Pemasukan" : "Pengeluaran"})`,
                    value: cat.id,
                  })),
                ]}
                className=""
              />

              {/* Month Filter */}
              <Select
                value={monthFilter}
                onChange={(val) => setMonthFilter(val)}
                options={[
                  { label: "Semua Bulan", value: "all" },
                  ...uniqueMonths.map((m) => {
                    const [year, month] = m.split("-");
                    const monthName = new Date(year, parseInt(month) - 1).toLocaleString("id-ID", { month: "long", year: "numeric" });
                    return { label: monthName, value: m };
                  }),
                ]}
                className=""
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {/* Sort */}
              <Select
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                options={[
                  { label: "Tanggal Terbaru", value: "date-desc" },
                  { label: "Tanggal Terlama", value: "date-asc" },
                  { label: "Jumlah Terbesar", value: "amount-desc" },
                  { label: "Jumlah Terkecil", value: "amount-asc" },
                ]}
                className=""
              />

              {/* Date Start */}
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                placeholder="Dari tanggal"
                className="bg-input-bg border border-border rounded-xl px-4 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />

              {/* Date End */}
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                placeholder="Sampai tanggal"
                className="bg-input-bg border border-border rounded-xl px-4 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />

              {/* Reset */}
              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-xl hover:bg-surface-hover hover:text-text transition-all cursor-pointer"
              >
                <ArrowUpDown className="h-4 w-4" />
                Reset Filter
              </button>
            </div>
          </div>
        </Card>

        {/* Result Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {sortedTransactions.length} transaksi ditemukan
          </span>
        </div>

          {/* Transactions Table */}
          <Card
            className="flex flex-col p-0 overflow-hidden text-left"
            hover={false}
          >
            {sortedTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider font-semibold bg-surface/50">
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Catatan</th>
                      <th className="px-6 py-4">Tipe</th>
                      <th className="px-6 py-4 text-right">Jumlah</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <AnimatePresence initial={false}>
                      {sortedTransactions.map((tx) => {
                        const cat = categories.find(
                          (c) => c.id === tx.categoryId,
                        );
                        const isIncome = tx.type === "income";

                        return (
                        <motion.tr
                          key={tx.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15, transition: { duration: 0.15 } }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="group hover:bg-surface-hover/20 transition-colors"
                        >
                            <td className="px-6 py-4 text-text-secondary font-medium whitespace-nowrap">
                              {formatDateShort(tx.date)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor: cat
                                      ? cat.color
                                      : "#64748b",
                                  }}
                                />
                                <span className="font-semibold text-text">
                                  {cat ? cat.name : "Lainnya"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-text-secondary max-w-[240px] truncate">
                              {tx.description || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                              ${
                                isIncome
                                  ? "bg-success/10 text-success"
                                  : "bg-danger/10 text-danger"
                              }
                            `}
                              >
                                {isIncome ? "Pemasukan" : "Pengeluaran"}
                              </span>
                            </td>
                            <td
                              className={`px-6 py-4 text-right font-bold whitespace-nowrap
                            ${isIncome ? "text-success" : "text-danger"}
                          `}
                            >
                              {isIncome ? "+" : "-"} {formatCurrency(tx.amount)}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenEditModal(tx)}
                                  aria-label="Edit transaksi"
                                  className="p-1.5 hover:bg-surface-hover text-text-secondary hover:text-primary rounded-lg transition-colors"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingId(tx.id)}
                                  aria-label="Hapus transaksi"
                                  className="p-1.5 hover:bg-surface-hover text-text-secondary hover:text-danger rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12">
                <EmptyState
                  title="Tidak Ada Transaksi Cocok"
                  description="Cobalah ubah filter pencarian atau buat transaksi baru."
                  action={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleOpenAddModal}
                    >
                      Buat Transaksi Baru
                    </Button>
                  }
                />
              </div>
            )}
          </Card>

          {/* Modal Add/Edit */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingTransaction ? "Edit Transaksi" : "Transaksi Baru"}
            size="md"
          >
            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              {/* Type Toggles */}
              <div className="flex flex-col">
                <span className="text-text-secondary text-sm font-medium mb-1.5">
                  Tipe Transaksi
                </span>
                <div className="flex p-1 bg-input-bg border border-border rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("expense")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                    ${
                      formData.type === "expense"
                        ? "bg-danger text-white glow-danger"
                        : "text-text-secondary hover:text-text"
                    }
                  `}
                  >
                    Pengeluaran (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("income")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                    ${
                      formData.type === "income"
                        ? "bg-success text-white glow-success"
                        : "text-text-secondary hover:text-text"
                    }
                  `}
                  >
                    Pemasukan (+)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <Input
                label="Nominal Uang (Rp)"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="Contoh: 50000"
                icon={DollarSign}
                error={formErrors.amount}
              />

              {/* Category Select */}
              <Select
                label="Kategori"
                value={formData.categoryId || ""}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, categoryId: val }))
                }
                icon={Tag}
                placeholder="Pilih Kategori"
                options={filteredCategoriesForForm.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
                error={formErrors.categoryId}
              />

            {/* Date */}
            <Input
              label="Tanggal"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              icon={Calendar}
              error={formErrors.date}
            />

            {/* Note */}
            <Input
              label="Catatan / Keterangan"
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              placeholder="Contoh: Beli nasi goreng ayam"
              icon={FileText}
            />
              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="flex-1" loading={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </Modal>

          {/* Delete Confirmation */}
          <ConfirmModal
            isOpen={deletingId !== null}
            onClose={() => setDeletingId(null)}
            onConfirm={() => deleteTransaction(deletingId)}
            title="Hapus Transaksi"
            message="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Transactions;
