import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Camera,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { getAvatarUrl } from "../utils/api";

const Profile = () => {
  const {
    user,
    transactions,
    categories,
    budgets,
    updateProfile,
    updatePassword,
    uploadAvatar,
    addToast,
    theme,
    toggleTheme,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileErrors, setProfileErrors] = useState({});

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpense, total: transactions.length };
  }, [transactions]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast("Ukuran file maksimal 2MB", "error");
      return;
    }
    // Revoke previous preview URL to avoid memory leak
    if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    const url = URL.createObjectURL(file);
    setPreviewAvatar(url);
    setUploading(true);
    uploadAvatar(file).finally(() => {
      setUploading(false);
      URL.revokeObjectURL(url);
      setPreviewAvatar(null);
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileData.name.trim()) errs.name = "Nama wajib diisi";
    if (!profileData.email.trim()) {
      errs.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errs.email = "Format email tidak valid";
    }
    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }
    updateProfile(profileData.name, profileData.email).then((ok) => {
      if (ok) {
        setIsEditingProfile(false);
        setProfileErrors({});
      }
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordData.oldPassword) errs.oldPassword = "Password lama wajib diisi";
    if (!passwordData.newPassword) {
      errs.newPassword = "Password baru wajib diisi";
    } else if (passwordData.newPassword.length < 6) {
      errs.newPassword = "Minimal 6 karakter";
    }
    if (!passwordData.confirmPassword) {
      errs.confirmPassword = "Konfirmasi wajib diisi";
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      errs.confirmPassword = "Tidak cocok";
    }
    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs);
      return;
    }
    updatePassword(passwordData.oldPassword, passwordData.newPassword).then(
      (ok) => {
        if (ok) {
          setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
          setPasswordErrors({});
        }
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 text-left">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-text">Profil Saya</h2>
          <p className="text-text-secondary text-sm">
            Kelola informasi akun dan keamanan password Anda.
          </p>
        </div>

        {/* Profile Hero Card */}
        <Card className="p-6 border border-border/80" hover={false}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                id="avatarInput"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="avatarInput"
                className="block cursor-pointer"
              >
                {previewAvatar || user?.avatar ? (
                  <img
                    src={previewAvatar || getAvatarUrl(user.avatar)}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-primary/20"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg ring-4 ring-primary/20">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  {uploading ? (
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </div>
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-black text-text mb-1">
                {user?.name}
              </h3>
              <p className="text-text-secondary text-sm mb-3">{user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5" />
                  Bergabung sejak{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-2xl font-black text-text">{stats.total}</p>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  Transaksi
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-text">{categories.length}</p>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  Kategori
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-text">{budgets.length}</p>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  Budget
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border border-border/80" hover={false}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-success/10 rounded-xl text-success">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  Total Pemasukan
                </p>
                <p className="text-lg font-black text-success">
                  Rp {stats.totalIncome.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border border-border/80" hover={false}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-danger/10 rounded-xl text-danger">
                <ArrowDownRight className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  Total Pengeluaran
                </p>
                <p className="text-lg font-black text-danger">
                  Rp {stats.totalExpense.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border border-border/80" hover={false}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  Saldo Bersih
                </p>
                <p className="text-lg font-black text-primary">
                  Rp{" "}
                  {(stats.totalIncome - stats.totalExpense).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Profile */}
        <Card className="p-6 border border-border/80" hover={false}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
            <div>
              <h3 className="text-lg font-bold text-text">Informasi Profil</h3>
              <p className="text-text-secondary text-xs">
                Ubah nama dan email akun Anda.
              </p>
            </div>
            {!isEditingProfile && (
              <Button
                variant="secondary"
                size="sm"
                icon={Pencil}
                onClick={() => {
                  setProfileData({ name: user.name, email: user.email });
                  setIsEditingProfile(true);
                }}
              >
                Ubah
              </Button>
            )}
          </div>

          {isEditingProfile ? (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleProfileSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  icon={User}
                  error={profileErrors.name}
                />
                <Input
                  label="Alamat Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  icon={Mail}
                  error={profileErrors.email}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setProfileErrors({});
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Simpan Perubahan
                </Button>
              </div>
            </motion.form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
              <div>
                <span className="text-text-secondary block mb-1">
                  Nama Lengkap
                </span>
                <span className="font-semibold text-text text-base">
                  {user?.name}
                </span>
              </div>
              <div>
                <span className="text-text-secondary block mb-1">
                  Alamat Email
                </span>
                <span className="font-semibold text-text text-base">
                  {user?.email}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Change Password */}
        <Card className="p-6 border border-border/80" hover={false}>
          <div className="mb-6 pb-4 border-b border-border/40">
            <h3 className="text-lg font-bold text-text">Keamanan Sandi</h3>
            <p className="text-text-secondary text-xs">
              Perbarui password akun Anda secara berkala.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Password Lama"
                type={showOldPassword ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
                placeholder="Masukkan password lama"
                icon={Lock}
                rightIcon={showOldPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowOldPassword(!showOldPassword)}
                error={passwordErrors.oldPassword}
              />
              <Input
                label="Password Baru"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Minimal 6 karakter"
                icon={Lock}
                rightIcon={showNewPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                error={passwordErrors.newPassword}
              />
              <Input
                label="Konfirmasi Password Baru"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Ulangi password baru"
                icon={Lock}
                rightIcon={showConfirmPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                error={passwordErrors.confirmPassword}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" icon={Lock}>
                Perbarui Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Theme Quick Toggle */}
        <Card className="p-6 border border-border/80" hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text">Tampilan</h3>
              <p className="text-text-secondary text-xs">
                Mode gelap atau terang.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-surface-hover border border-border rounded-xl text-sm font-semibold hover:shadow-md transition-all whitespace-nowrap"
            >
              {theme === "dark" ? "Mode Gelap" : "Mode Terang"}
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
