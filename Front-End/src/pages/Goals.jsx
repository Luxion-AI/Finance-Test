import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Pencil, Trash2, Wallet, TrendingUp, Trophy, PiggyBank, Gift, Plane, Home, Smartphone } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

const goalIcons = { Target, Wallet, TrendingUp, Trophy, PiggyBank, Gift, Plane, Home, Smartphone };
const iconOptions = Object.keys(goalIcons).map((k) => ({ value: k, label: k }));

const colorOptions = [
  { value: '#3b82f6', label: 'Biru' },
  { value: '#10b981', label: 'Hijau' },
  { value: '#f59e0b', label: 'Kuning' },
  { value: '#ef4444', label: 'Merah' },
  { value: '#8b5cf6', label: 'Ungu' },
  { value: '#ec4899', label: 'Merah Muda' },
];

const Goals = () => {
  const { savingsGoals, addGoal, editGoal, deleteGoal, addFundsToGoal } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [fundModal, setFundModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: '', targetAmount: '', currentAmount: '0', deadline: '', icon: 'Target', color: '#3b82f6' });
  const [fundAmount, setFundAmount] = useState('');

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', targetAmount: '', currentAmount: '0', deadline: '', icon: 'Target', color: '#3b82f6' });
    setModalOpen(true);
  };

  const openEdit = (goal) => {
    setEditing(goal);
    setForm({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : '',
      icon: goal.icon || 'Target',
      color: goal.color || '#3b82f6',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount) return;
    setSubmitting(true);
    const ok = editing
      ? await editGoal(editing.id, form)
      : await addGoal(form);
    setSubmitting(false);
    if (ok) { setModalOpen(false); }
  };

  const handleAddFunds = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) return;
    await addFundsToGoal(fundModal.id, fundAmount);
    setFundModal(null);
    setFundAmount('');
  };

  const progress = (goal) => {
    if (!goal.targetAmount) return 0;
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  };

  const daysLeft = (goal) => {
    if (!goal.deadline) return null;
    const diff = new Date(goal.deadline) - new Date();
    return Math.max(0, Math.ceil(diff / 864e5));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">Goals Tabungan</h2>
            <p className="text-text-secondary text-sm">Atur target tabungan dan lacak progresmu.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={openAdd}>Goal Baru</Button>
        </div>

        {savingsGoals.length === 0 ? (
          <EmptyState
            title="Belum Ada Goal Tabungan"
            description="Buat target tabungan pertama kamu, misalnya 'Liburan ke Bali' atau 'PS5'."
            icon={Target}
            action={<Button variant="primary" icon={Plus} onClick={openAdd}>Buat Goal</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsGoals.map((goal, i) => {
              const pct = progress(goal);
              const days = daysLeft(goal);
              const IconComp = goalIcons[goal.icon] || Target;
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 border border-border/80 overflow-hidden relative" hover={false}>
                    {/* Progress bar background */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-border/40">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
                    </div>

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${goal.color}15` }}>
                          <IconComp className="h-5 w-5" style={{ color: goal.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-text">{goal.name}</h3>
                          {days !== null && (
                            <p className="text-xs text-text-secondary">{days} hari lagi</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(goal)} aria-label="Edit goal" className="p-1.5 hover:bg-surface-hover text-text-secondary hover:text-primary rounded-lg transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeletingId(goal.id)} aria-label="Hapus goal" className="p-1.5 hover:bg-surface-hover text-text-secondary hover:text-danger rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress bar large */}
                    <div className="h-3 bg-border/30 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full" style={{ backgroundColor: goal.color }}
                      />
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-bold text-text">{formatCurrency(goal.currentAmount)}</p>
                        <p className="text-xs text-text-secondary">dari {formatCurrency(goal.targetAmount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: goal.color }}>{pct.toFixed(0)}%</p>
                        <button
                          onClick={() => { setFundModal(goal); setFundAmount(''); }}
                          className="text-xs text-primary hover:underline font-semibold mt-1 inline-flex items-center gap-0.5"
                        >
                          <Plus className="h-3 w-3" /> Tambah dana
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Goal' : 'Goal Baru'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nama Goal" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Contoh: Liburan ke Bali" icon={Target} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <Input label="Target (Rp)" type="number" value={form.targetAmount} onChange={(e) => setForm((p) => ({ ...p, targetAmount: e.target.value }))} icon={Wallet} />
              <Input label="Dana Awal (Rp)" type="number" value={form.currentAmount} onChange={(e) => setForm((p) => ({ ...p, currentAmount: e.target.value }))} icon={Wallet} />
            </div>
            <Input label="Deadline (opsional)" type="date" value={form.deadline} onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select label="Ikon" value={form.icon} onChange={(v) => setForm((p) => ({ ...p, icon: v }))} options={iconOptions} />
              <Select label="Warna" value={form.color} onChange={(v) => setForm((p) => ({ ...p, color: v }))} options={colorOptions} />
            </div>
            <Button type="submit" variant="primary" fullWidth loading={submitting} className="py-2.5">
              {editing ? 'Simpan Perubahan' : 'Buat Goal'}
            </Button>
          </form>
        </Modal>

        {/* Add Funds Modal */}
        <Modal isOpen={!!fundModal} onClose={() => setFundModal(null)} title="Tambah Dana">
          {fundModal && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">Menambah dana untuk <strong className="text-text">{fundModal.name}</strong></p>
              <Input label="Jumlah (Rp)" type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} icon={Plus} placeholder="Masukkan jumlah" />
              <Button variant="primary" fullWidth onClick={handleAddFunds} className="py-2.5">Tambah</Button>
            </div>
          )}
        </Modal>

        <ConfirmModal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={async () => { await deleteGoal(deletingId); setDeletingId(null); }}
          title="Hapus Goal?"
          message="Goal ini akan dihapus permanen."
        />
      </div>
    </DashboardLayout>
  );
};

export default Goals;
