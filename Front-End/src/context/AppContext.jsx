import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("fintrack_theme");
    if (stored) return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Toast notification helper
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fintrack_theme", theme);
  }, [theme]);

  // Cek sesi login & ambil data dari backend saat app pertama dibuka
  useEffect(() => {
    const initApp = async () => {
      const startTime = Date.now();
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const resUser = await axiosInstance.get("/auth/me");
          setUser(resUser.data.user);
          await fetchData();
        } catch (error) {
          console.error("Session expired or invalid:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 800 - elapsed);
      await new Promise((r) => setTimeout(r, remaining));
      setLoading(false);
      setDataLoading(false);
    };

    initApp();
  }, []);

  // Fungsi untuk ambil Ulang Data Kategori & Transaksi dari Backend
  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [resCat, resTx, resBud, resGoal] = await Promise.all([
        axiosInstance.get("/categories"),
        axiosInstance.get("/transactions"),
        axiosInstance.get("/budgets"),
        axiosInstance.get("/savings-goals"),
      ]);
      setCategories(resCat.data.data);
      setTransactions(resTx.data.data);
      setBudgets(resBud.data.data);
      setSavingsGoals(resGoal.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // --- AUTHENTICATION ACTIONS ---
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      addToast(`Selamat datang kembali, ${res.data.user.name}!`, "success");

      // Ambil data user dari DB
      await fetchData();
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || "Email atau password salah!";
      addToast(msg, "error");
      return false;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      addToast("Akun berhasil dibuat!", "success");

      await fetchData();
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || "Gagal mendaftar!";
      addToast(msg, "error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCategories([]);
    setTransactions([]);
    setBudgets([]);
    addToast("Anda telah keluar dari akun.", "info");
  };

  // --- CATEGORIES CRUD (BACKEND CONNECTED) ---
  const addCategory = async (catData) => {
    try {
      const res = await axiosInstance.post("/categories", catData);
      setCategories((prev) => [...prev, res.data.data]);
      addToast(
        `Kategori "${res.data.data.name}" berhasil ditambahkan!`,
        "success",
      );
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal menambah kategori",
        "error",
      );
      return false;
    }
  };

  const editCategory = async (id, catData) => {
    try {
      const res = await axiosInstance.put(`/categories/${id}`, catData);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? res.data.data : cat)),
      );
      addToast("Kategori berhasil diperbarui!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal memperbarui kategori",
        "error",
      );
      return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      addToast("Kategori berhasil dihapus!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal menghapus kategori",
        "error",
      );
    }
  };

  // --- TRANSACTIONS CRUD (BACKEND CONNECTED) ---
  const addTransaction = async (txData) => {
    try {
      const res = await axiosInstance.post("/transactions", txData);
      setTransactions((prev) => [res.data.data, ...prev]);
      addToast("Transaksi berhasil ditambahkan!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal menambah transaksi",
        "error",
      );
      return false;
    }
  };

  const editTransaction = async (id, txData) => {
    try {
      const res = await axiosInstance.put(`/transactions/${id}`, txData);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? res.data.data : tx)),
      );
      addToast("Transaksi berhasil diperbarui!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal memperbarui transaksi",
        "error",
      );
      return false;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axiosInstance.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      addToast("Transaksi berhasil dihapus!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal menghapus transaksi",
        "error",
      );
    }
  };

  // --- BUDGETS CRUD (BACKEND CONNECTED) ---
  const addBudget = async (budData) => {
    try {
      const res = await axiosInstance.post("/budgets", budData);
      setBudgets((prev) => [...prev, res.data.data]);
      addToast("Budget berhasil ditambahkan!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal menambah budget",
        "error",
      );
      return false;
    }
  };

  const editBudget = async (id, budData) => {
    try {
      const res = await axiosInstance.put(`/budgets/${id}`, budData);
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...res.data.data,
                spent: b.spent,
                remaining: b.remaining,
                percentage: b.percentage,
              }
            : b,
        ),
      );
      addToast("Budget berhasil diperbarui!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal memperbarui budget",
        "error",
      );
      return false;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axiosInstance.delete(`/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      addToast("Budget berhasil dihapus!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal menghapus budget",
        "error",
      );
    }
  };

  // --- SAVINGS GOALS CRUD ---
  const addGoal = async (goalData) => {
    try {
      const res = await axiosInstance.post("/savings-goals", goalData);
      setSavingsGoals((prev) => [res.data.data, ...prev]);
      addToast('Goal tabungan berhasil dibuat!', 'success');
      return true;
    } catch (error) {
      addToast(error.response?.data?.message || 'Gagal membuat goal', 'error');
      return false;
    }
  };

  const editGoal = async (id, goalData) => {
    try {
      const res = await axiosInstance.put(`/savings-goals/${id}`, goalData);
      setSavingsGoals((prev) => prev.map((g) => (g.id === id ? res.data.data : g)));
      addToast('Goal berhasil diperbarui!', 'success');
      return true;
    } catch (error) {
      addToast(error.response?.data?.message || 'Gagal memperbarui goal', 'error');
      return false;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axiosInstance.delete(`/savings-goals/${id}`);
      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
      addToast('Goal berhasil dihapus!', 'success');
      return true;
    } catch (error) {
      addToast(error.response?.data?.message || 'Gagal menghapus goal', 'error');
      return false;
    }
  };

  const addFundsToGoal = async (id, amount) => {
    try {
      const res = await axiosInstance.put(`/savings-goals/${id}/add-funds`, { amount });
      setSavingsGoals((prev) => prev.map((g) => (g.id === id ? res.data.data : g)));
      addToast('Dana berhasil ditambahkan!', 'success');
      return true;
    } catch (error) {
      addToast(error.response?.data?.message || 'Gagal menambah dana', 'error');
      return false;
    }
  };

  const readStreak = () => {
    try {
      const raw = localStorage.getItem('fintrack_streak');
      return raw ? JSON.parse(raw) : { count: 0, lastDate: null };
    } catch { return { count: 0, lastDate: null }; }
  };

  const updateStreak = () => {
    const s = readStreak();
    const today = new Date().toISOString().slice(0, 10);
    if (s.lastDate === today) return s;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const newCount = s.lastDate === yesterday ? s.count + 1 : 1;
    const newStreak = { count: newCount, lastDate: today };
    localStorage.setItem('fintrack_streak', JSON.stringify(newStreak));
    return newStreak;
  };

  // --- PROFILE UPDATE ---
  const updateProfile = async (name, email) => {
    try {
      const res = await axiosInstance.put("/auth/profile", { name, email });
      setUser(res.data.user);
      addToast("Profil berhasil diperbarui!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal memperbarui profil",
        "error",
      );
      return false;
    }
  };

  const updatePassword = async (oldPassword, newPassword) => {
    try {
      await axiosInstance.put("/auth/password", { oldPassword, newPassword });
      addToast("Password berhasil diperbarui!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal memperbarui password",
        "error",
      );
      return false;
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axiosInstance.post("/auth/upload-avatar", formData);
      setUser(res.data.user);
      addToast("Foto profil berhasil diperbarui!", "success");
      return true;
    } catch (error) {
      addToast(
        error.response?.data?.message || "Gagal mengupload foto",
        "error",
      );
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        uploadAvatar,
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        budgets,
        addBudget,
        editBudget,
        deleteBudget,
        savingsGoals,
        addGoal,
        editGoal,
        deleteGoal,
        addFundsToGoal,
        readStreak,
        updateStreak,
        theme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        loading,
        setLoading,
        dataLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
