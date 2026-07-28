import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Briefcase,
  Laptop,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  TrendingUp,
  Wallet,
  Heart,
  Home,
  Smartphone,
  GraduationCap,
  Plane,
  Gift
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Skeleton from "../components/Skeleton";
import Select from "../components/Select";

// Mapping string names in database to actual Lucide component instances
export const iconMap = {
  Briefcase,
  Laptop,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  TrendingUp,
  Wallet,
  Heart,
  Home,
  Smartphone,
  GraduationCap,
  Plane,
  Gift
};

const PRESET_COLORS = [
  '#10b981', // Emerald Green
  '#3b82f6', // Blue
  '#f59e0b', // Amber/Yellow
  '#8b5cf6', // Violet/Purple
  '#ec4899', // Pink
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#64748b'  // Slate/Gray
];

const Categories = () => {
  const {
    dataLoading,
    categories,
    addCategory,
    editCategory,
    deleteCategory
  } = useApp();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: 'ShoppingBag',
    color: '#3b82f6'
  });
  const [errors, setErrors] = useState({});

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || cat.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [categories, search, typeFilter]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense',
      icon: 'ShoppingBag',
      color: PRESET_COLORS[0]
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      type: cat.type,
      icon: cat.icon,
      color: cat.color
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const err = {};
    if (!formData.name.trim()) {
      err.name = 'Nama kategori wajib diisi';
    }
    return err;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const err = validateForm();
      if (Object.keys(err).length > 0) {
        setErrors(err);
        return;
      }

      setSubmitting(true);
      let ok;
      if (editingCategory) {
        ok = await editCategory(editingCategory.id, formData);
      } else {
        ok = await addCategory(formData);
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
              <Skeleton height="h-8" className="w-40 mb-2" />
              <Skeleton height="h-4" className="w-72" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-surface border border-border/70 rounded-2xl p-5 h-44">
                <div className="flex justify-between mb-4">
                  <Skeleton height="h-12 w-12" className="!rounded-2xl" />
                  <Skeleton height="h-5" className="w-20 !rounded-full" />
                </div>
                <Skeleton height="h-5" className="w-32 mb-2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
      <div className="flex flex-col gap-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-text">Daftar Kategori</h2>
            <p className="text-text-secondary text-sm">Kelola kategori untuk mengklasifikasikan pengeluaran dan pemasukan Anda.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
            Kategori Baru
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4" hover={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Cari nama kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-input-bg border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <Select
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
              options={[
                { label: "Semua Tipe", value: "all" },
                { label: "Pemasukan", value: "income" },
                { label: "Pengeluaran", value: "expense" },
              ]}
              className="min-w-[140px]"
            />
          </div>
        </Card>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            <AnimatePresence initial={false}>
              {filteredCategories.map((cat, idx) => {
                const IconComponent = iconMap[cat.icon] || ShoppingBag;
                const isIncome = cat.type === 'income';

                return (
                  <motion.div
                    key={cat.id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, y: 15 },
                      visible: { opacity: 1, scale: 1, y: 0 },
                    }}
                    layout
                  >
                    <Card
                    key={cat.id}
                    className="flex flex-col justify-between text-left h-44 hover:shadow-lg border-border/80"
                    animated={true}
                    hover={true}
                  >
                    <div>
                      {/* Icon & Title */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="p-3.5 rounded-2xl flex items-center justify-center text-white"
                          style={{
                            backgroundColor: `${cat.color}15`,
                            color: cat.color,
                            border: `1.5px solid ${cat.color}30`
                          }}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>

                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${isIncome
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger'
                          }
                        `}>
                          {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </div>

                      {/* Info */}
                      <h3 className="text-lg font-bold text-text mb-1 truncate">
                        {cat.name}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-border/40 mt-auto">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-2 hover:bg-surface-hover text-text-secondary hover:text-primary rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Ubah
                      </button>
                      <button
                        onClick={() => setDeletingId(cat.id)}
                        className="p-2 hover:bg-surface-hover text-text-secondary hover:text-danger rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            title="Tidak Ada Kategori"
            description="Anda belum memiliki kategori keuangan."
            action={
              <Button variant="secondary" size="sm" onClick={handleOpenAddModal}>
                Tambah Kategori Baru
              </Button>
            }
          />
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? 'Edit Kategori' : 'Kategori Baru'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Category Name */}
            <Input
              label="Nama Kategori"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Contoh: Kopi / Hobi / Gaji"
              error={errors.name}
            />

            {/* Type Toggle */}
            <div className="flex flex-col">
              <span className="text-text-secondary text-sm font-medium mb-1.5">Tipe Kategori</span>
              <div className="flex p-1 bg-input-bg border border-border rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                    ${formData.type === 'expense'
                      ? 'bg-danger text-white glow-danger'
                      : 'text-text-secondary hover:text-text'
                    }
                  `}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                    ${formData.type === 'income'
                      ? 'bg-success text-white glow-success'
                      : 'text-text-secondary hover:text-text'
                    }
                  `}
                >
                  Pemasukan
                </button>
              </div>
            </div>

            {/* Icon Picker Grid */}
            <div className="flex flex-col">
              <span className="text-text-secondary text-sm font-medium mb-2">Pilih Ikon</span>
              <div className="grid grid-cols-5 gap-2.5 p-3 bg-input-bg border border-border rounded-xl">
                {Object.keys(iconMap).map((iconName) => {
                  const IconComp = iconMap[iconName];
                  const isSelected = formData.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                      className={`p-3 rounded-lg flex items-center justify-center border transition-all duration-200
                        ${isSelected
                          ? 'bg-primary/10 border-primary text-primary shadow-sm'
                          : 'border-transparent text-text-secondary hover:bg-surface-hover hover:text-text'
                        }
                      `}
                    >
                      <IconComp className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Picker Grid */}
            <div className="flex flex-col">
              <span className="text-text-secondary text-sm font-medium mb-2">Pilih Warna</span>
              <div className="flex flex-wrap gap-2.5 p-3 bg-input-bg border border-border rounded-xl justify-center sm:justify-start">
                {PRESET_COLORS.map((color) => {
                  const isSelected = formData.color === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                      style={{ backgroundColor: color }}
                    >
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={submitting}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteCategory(deletingId)}
          title="Hapus Kategori"
          message="Apakah Anda yakin ingin menghapus kategori ini? Menghapus kategori ini juga akan menghapus transaksi yang berkaitan."
        />
      </div>
      )}
    </DashboardLayout>
  );
};

export default Categories;
