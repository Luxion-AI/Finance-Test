import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/Button";

const Login = () => {
  const { login, loading } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [oauthError, setOauthError] = useState("");
  const [inputReady, setInputReady] = useState(false);

  useEffect(() => {
    const err = searchParams.get("oauth_error");
    if (err) {
      setOauthError(decodeURIComponent(err));
    }
  }, [searchParams]);

  useEffect(() => {
    // Bikin input siap setelah mount — biar browser gak autofill
    setInputReady(true);
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) {
        error = "Email wajib diisi";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Format email tidak valid";
      }
    }
    if (name === "password") {
      if (!value) {
        error = "Password wajib diisi";
      } else if (value.length < 6) {
        error = "Password minimal 6 karakter";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (isSubmitted) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const emailErr = validateField("email", formData.email);
    const passErr = validateField("password", formData.password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col text-left">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-text mb-1 tracking-tight">
          Selamat Datang
        </h2>
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          Silakan masuk ke akun Anda untuk mengakses dashboard keuangan.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email Floating Label Input */}
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-5 w-5 text-text-muted pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly={!inputReady}
                className={`w-full bg-input-bg border border-border rounded-xl pl-12 pr-4 pt-6 pb-2 text-text text-sm input-glow transition-all duration-200 peer shadow-sm
                  ${errors.email ? "border-danger/80 focus:border-danger/80" : "focus:border-primary"}
                `}
              />
              <label
                className={`absolute left-12 top-4 text-text-muted text-sm transition-all duration-200 pointer-events-none origin-[0]
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-[.85] peer-focus:-translate-y-2.5 peer-focus:text-primary
                ${formData.email ? "scale-[.85] -translate-y-2.5 text-primary" : ""}
              `}
              >
                Alamat Email
              </label>
            </div>
            {errors.email && (
              <span className="text-danger text-xs mt-1.5 flex items-center gap-1 font-medium">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Floating Label Input */}
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-5 w-5 text-text-muted pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly={!inputReady}
                className={`w-full bg-input-bg border border-border rounded-xl pl-12 pr-12 pt-6 pb-2 text-text text-sm input-glow transition-all duration-200 peer shadow-sm
                  ${errors.password ? "border-danger/80 focus:border-danger/80" : "focus:border-primary"}
                `}
              />
              <label
                className={`absolute left-12 top-4 text-text-muted text-sm transition-all duration-200 pointer-events-none origin-[0]
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-[.85] peer-focus:-translate-y-2.5 peer-focus:text-primary
                ${formData.password ? "scale-[.85] -translate-y-2.5 text-primary" : ""}
              `}
              >
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-4 text-text-muted hover:text-text p-1 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-danger text-xs mt-1.5 flex items-center gap-1 font-medium">
                {errors.password}
              </span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-text-secondary select-none font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
              />
              Ingat Saya
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline font-semibold">
              Lupa Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            icon={LogIn}
            className="py-3 mt-4 text-sm"
          >
            Masuk ke Aplikasi
          </Button>
        </form>

        {/* Social Login Separator */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-surface px-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
            Atau masuk dengan
          </span>
        </div>

        {/* OAuth Error */}
        {oauthError && (
          <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{oauthError}</p>
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <a
            href={`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')}/auth/google`}
            className="flex items-center justify-center gap-3 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-surface-hover transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </a>
        </div>

        {/* Link to Register */}
        <div className="text-center mt-8">
          <p className="text-sm text-text-secondary">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-semibold"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
