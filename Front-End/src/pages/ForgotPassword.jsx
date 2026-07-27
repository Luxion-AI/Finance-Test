import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import axiosInstance from '../api/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Gagal mengirim email. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm mx-auto lg:mx-0 text-left">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text text-sm font-medium mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Login
        </Link>

        <h2 className="text-2xl font-bold text-text mb-1">Lupa Password</h2>
        <p className="text-text-secondary text-sm mb-8">
          Masukkan email kamu, kami akan kirim link reset password.
        </p>

        {sent ? (
          <div className="p-5 bg-success/10 border border-success/20 rounded-xl text-left">
            <p className="text-text font-semibold mb-1">Cek Email Kamu</p>
            <p className="text-text-secondary text-sm">
              Jika email <strong className="text-text">{email}</strong> terdaftar, link reset sudah dikirim. Cek folder spam jika tidak muncul.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              placeholder="nama@email.com"
              error={error}
            />
            <Button type="submit" variant="primary" fullWidth icon={Send} loading={loading} className="py-3 text-sm">
              Kirim Link Reset
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
