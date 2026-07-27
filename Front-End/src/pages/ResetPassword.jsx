import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import axiosInstance from '../api/axiosInstance';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
    } catch {
      setError('Token tidak valid atau sudah kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="w-full max-w-sm mx-auto lg:mx-0 text-left">
          <div className="p-5 bg-danger/10 border border-danger/20 rounded-xl">
            <p className="text-text font-semibold mb-1">Link Tidak Valid</p>
            <p className="text-text-secondary text-sm mb-4">Link reset password tidak ditemukan.</p>
            <Link to="/forgot-password" className="text-primary hover:underline font-semibold text-sm">Minta link baru</Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-sm mx-auto lg:mx-0 text-left">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text text-sm font-medium mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Login
        </Link>

        <h2 className="text-2xl font-bold text-text mb-1">Buat Password Baru</h2>
        <p className="text-text-secondary text-sm mb-8">Masukkan password baru untuk akun kamu.</p>

        {done ? (
          <div className="p-5 bg-success/10 border border-success/20 rounded-xl text-left space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-success" />
              <div>
                <p className="text-text font-semibold">Password Berhasil Diubah</p>
                <p className="text-text-secondary text-sm">Kamu bisa login dengan password baru sekarang.</p>
              </div>
            </div>
            <Link to="/login">
              <Button variant="primary" fullWidth className="py-2.5 text-sm">
                Masuk Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Password Baru"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              placeholder="Minimal 6 karakter"
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              rightIconLabel={showPassword ? 'Sembunyikan' : 'Tampilkan'}
            />
            <Input
              label="Konfirmasi Password"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              icon={Lock}
              placeholder="Ulangi password baru"
              error={error}
            />
            <Button type="submit" variant="primary" fullWidth loading={loading} className="py-3 text-sm">
              Ubah Password
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
