import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Sun,
  Moon,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { getAvatarUrl } from '../utils/api';

const Settings = () => {
  const {
    user,
    updateProfile,
    updatePassword,
    logout,
    theme,
    toggleTheme
  } = useApp();
  const navigate = useNavigate();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Profile submission handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileData.name.trim()) errs.name = 'Nama lengkap wajib diisi';
    if (!profileData.email.trim()) {
      errs.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errs.email = 'Format email tidak valid';
    }

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }

    const ok = await updateProfile(profileData.name, profileData.email);
    if (ok) {
      setIsEditingProfile(false);
      setProfileErrors({});
    }
  };

  // Password submission handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordData.oldPassword) errs.oldPassword = 'Password lama wajib diisi';
    if (!passwordData.newPassword) {
      errs.newPassword = 'Password baru wajib diisi';
    } else if (passwordData.newPassword.length < 6) {
      errs.newPassword = 'Password baru minimal 6 karakter';
    }
    if (!passwordData.confirmPassword) {
      errs.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      errs.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs);
      return;
    }

    const ok = await updatePassword(passwordData.oldPassword, passwordData.newPassword);
    if (ok) {
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto flex flex-col gap-6 text-left">
        {/* Header Title */}
        <div>
          <h2 className="text-2xl font-bold text-text">Pengaturan Akun</h2>
          <p className="text-text-secondary text-sm">Kelola informasi profil, keamanan sandi, dan tampilan aplikasi Anda.</p>
        </div>

        {/* 1. Profile Information Card */}
        <Card className="p-6 border border-border/80" hover={false}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/40">
              <div className="flex items-center gap-4">
                {user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover shadow-md ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {user ? getInitials(user.name) : 'U'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-text">Informasi Profil</h3>
                  <p className="text-text-secondary text-xs">Ubah data identitas dan email Anda.</p>
                </div>
              </div>
            
            {!isEditingProfile && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setProfileData({ name: user.name, email: user.email });
                  setIsEditingProfile(true);
                }}
              >
                Ubah Profil
              </Button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  icon={User}
                  error={profileErrors.name}
                />
                <Input
                  label="Alamat Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
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
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
              <div>
                <span className="text-text-secondary block mb-1">Nama Lengkap</span>
                <span className="font-semibold text-text text-base">{user?.name}</span>
              </div>
              <div>
                <span className="text-text-secondary block mb-1">Alamat Email</span>
                <span className="font-semibold text-text text-base">{user?.email}</span>
              </div>
            </div>
          )}
        </Card>

        {/* 2. Security / Change Password Card */}
        <Card className="p-6 border border-border/80" hover={false}>
          <div className="mb-6 pb-4 border-b border-border/40">
            <h3 className="text-lg font-bold text-text">Keamanan Sandi</h3>
            <p className="text-text-secondary text-xs">Perbarui password akun Anda secara berkala.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Password Lama"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                placeholder="••••••••"
                icon={Lock}
                error={passwordErrors.oldPassword}
              />
              <Input
                label="Password Baru"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Minimal 6 karakter"
                icon={Lock}
                error={passwordErrors.newPassword}
              />
              <Input
                label="Konfirmasi Password Baru"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Ulangi password baru"
                icon={Lock}
                error={passwordErrors.confirmPassword}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" size="sm">
                Perbarui Password
              </Button>
            </div>
          </form>
        </Card>

        {/* 3. Appearance Card */}
        <Card className="p-6 border border-border/80" hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text">Tampilan Aplikasi</h3>
              <p className="text-text-secondary text-xs">Pilih tema antarmuka gelap atau terang.</p>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-3 bg-surface-hover border border-border rounded-xl flex items-center gap-3 text-sm font-semibold hover:shadow-md transition-all duration-200 whitespace-nowrap"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="h-5 w-5 text-primary" />
                  <span>Mode Gelap (Aktif)</span>
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5 text-warning animate-spin-slow" />
                  <span>Mode Terang (Aktif)</span>
                </>
              )}
            </button>
          </div>
        </Card>

        {/* 4. Danger Zone Card */}
        <Card className="p-6 border border-danger/30 bg-danger/5" hover={false}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-danger/10 text-danger rounded-xl">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text">Zona Bahaya</h3>
                <p className="text-text-secondary text-xs">Keluar dari sesi akun Anda saat ini.</p>
              </div>
            </div>
            
            <Button
              variant="danger"
              icon={LogOut}
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              Keluar Akun
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
