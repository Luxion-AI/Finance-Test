import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Percent,
  TrendingUp as TrendIcon,
  ShoppingBag,
  Car,
  UtensilsCrossed,
  Briefcase,
  Receipt,
  Gamepad2,
  Laptop,
  HelpCircle,
  Target,
  Flame,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardSkeleton from "../components/DashboardSkeleton";
import Card from "../components/Card";
import Button from "../components/Button";
import AnimatedCounter from "../components/AnimatedCounter";
import EmptyState from "../components/EmptyState";
import {
  formatCurrency,
  formatDateShort,
  getMonthShort,
} from "../utils/formatters";

// Recharts components
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Merchant Icon mapper for Recent Transactions
const getMerchantIcon = (note, catIcon) => {
  const noteLower = (note || "").toLowerCase();

  if (
    noteLower.includes("makan") ||
    noteLower.includes("bakso") ||
    noteLower.includes("goreng") ||
    noteLower.includes("kopi")
  ) {
    return { icon: UtensilsCrossed, bg: "bg-amber-500/15 text-amber-500" };
  }
  if (
    noteLower.includes("bensin") ||
    noteLower.includes("toll") ||
    noteLower.includes("transport") ||
    noteLower.includes("grab") ||
    noteLower.includes("gojek")
  ) {
    return { icon: Car, bg: "bg-purple-500/15 text-purple-500" };
  }
  if (
    noteLower.includes("belanja") ||
    noteLower.includes("baju") ||
    noteLower.includes("supermarket")
  ) {
    return { icon: ShoppingBag, bg: "bg-pink-500/15 text-pink-500" };
  }
  if (
    noteLower.includes("listrik") ||
    noteLower.includes("wifi") ||
    noteLower.includes("tagihan") ||
    noteLower.includes("pulsa")
  ) {
    return { icon: Receipt, bg: "bg-red-500/15 text-red-500" };
  }
  if (
    noteLower.includes("game") ||
    noteLower.includes("steam") ||
    noteLower.includes("bioskop") ||
    noteLower.includes("nonton")
  ) {
    return { icon: Gamepad2, bg: "bg-cyan-500/15 text-cyan-500" };
  }
  if (noteLower.includes("gaji") || noteLower.includes("bulanan")) {
    return { icon: Briefcase, bg: "bg-emerald-500/15 text-emerald-500" };
  }
  if (
    noteLower.includes("projek") ||
    noteLower.includes("freelance") ||
    noteLower.includes("landing") ||
    noteLower.includes("logo")
  ) {
    return { icon: Laptop, bg: "bg-blue-500/15 text-blue-500" };
  }

  // Fallback to category icon name
  switch (catIcon) {
    case "Briefcase":
      return { icon: Briefcase, bg: "bg-emerald-500/15 text-emerald-500" };
    case "Laptop":
      return { icon: Laptop, bg: "bg-blue-500/15 text-blue-500" };
    case "UtensilsCrossed":
      return { icon: UtensilsCrossed, bg: "bg-amber-500/15 text-amber-500" };
    case "Car":
      return { icon: Car, bg: "bg-purple-500/15 text-purple-500" };
    case "ShoppingBag":
      return { icon: ShoppingBag, bg: "bg-pink-500/15 text-pink-500" };
    case "Receipt":
      return { icon: Receipt, bg: "bg-red-500/15 text-red-500" };
    case "Gamepad2":
      return { icon: Gamepad2, bg: "bg-cyan-500/15 text-cyan-500" };
    default:
      return { icon: HelpCircle, bg: "bg-slate-500/15 text-slate-400" };
  }
};

// Chart Styling Custom Tooltips
const CustomTooltipCurrency = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 rounded-xl shadow-lg text-left">
        <p className="text-xs text-text-secondary font-bold mb-1.5">
          {payload[0].payload.name}
        </p>
        {payload.map((item, index) => (
          <p
            key={index}
            className="text-xs font-semibold"
            style={{ color: item.color }}
          >
            {item.name === "income" ? "Pemasukan: " : "Pengeluaran: "}
            {formatCurrency(item.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface border border-border p-3 rounded-xl shadow-lg text-left">
        <p className="text-xs font-bold" style={{ color: data.color }}>
          {data.name}: {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { transactions, categories, user, dataLoading, readStreak, updateStreak, savingsGoals } = useApp();
  const navigate = useNavigate();
  const [hoveredStatCard, setHoveredStatCard] = useState(null);

  // Streak & date
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const streak = readStreak();
  const isNewDay = streak.lastDate !== today;
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);

  // Monthly report check
  useEffect(() => {
    const lastMonth = localStorage.getItem('fintrack_last_month');
    const thisMonth = today.slice(0, 7);
    if (lastMonth && lastMonth !== thisMonth) {
      setShowMonthlyReport(true);
    }
    localStorage.setItem('fintrack_last_month', thisMonth);
  }, [today]);

  // Update streak on mount
  useEffect(() => {
    if (isNewDay) {
      updateStreak();
    }
  }, []);

  // 1. CALCULATE TIMELY GREETING
  const [greetingText] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 11 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    if (hour >= 18 || hour < 4) return "Selamat Malam";
    return "Selamat Pagi";
  });

  const [todayFormatted] = useState(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  // Typing animation state
  const [displayedGreeting, setDisplayedGreeting] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fullGreeting = `${greetingText}, ${user?.name || 'User'} 👋`;

  useEffect(() => {
    let timeout;
    if (!isDeleting && displayedGreeting.length < fullGreeting.length) {
      timeout = setTimeout(() => {
        setDisplayedGreeting(fullGreeting.slice(0, displayedGreeting.length + 1));
      }, 80);
    } else if (!isDeleting && displayedGreeting.length === fullGreeting.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedGreeting.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedGreeting(displayedGreeting.slice(0, -1));
      }, 40);
    } else if (isDeleting && displayedGreeting.length === 0) {
      setIsDeleting(false);
    }
    return () => clearTimeout(timeout);
  }, [displayedGreeting, isDeleting, fullGreeting]);

  // 2. CALCULATE BALANCE STATS
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    transactions.forEach((tx) => {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }

      const txDate = new Date(tx.date);
      if (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      ) {
        if (tx.type === "income") {
          monthlyIncome += tx.amount;
        } else {
          monthlyExpense += tx.amount;
        }
      }
    });

    const totalBalance = totalIncome - totalExpense;
    const savings =
      totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      monthlyIncome,
      monthlyExpense,
      savings: Math.max(0, savings),
    };
  }, [transactions]);

  // 3. PREPARE 6-MONTH CHART DATA
  const monthlyChartData = useMemo(() => {
    const monthsData = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsData.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        name: getMonthShort(d.getMonth()),
        income: 0,
        expense: 0,
      });
    }

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();

      const bucket = monthsData.find(
        (m) => m.monthIndex === txMonth && m.year === txYear,
      );

      if (bucket) {
        if (tx.type === "income") {
          bucket.income += tx.amount;
        } else {
          bucket.expense += tx.amount;
        }
      }
    });

    return monthsData;
  }, [transactions]);

  // 4. PREPARE PIE CHART DATA (EXPENSE BY CATEGORY)
  const categoryChartData = useMemo(() => {
    const expenseMap = {};

    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        const cat = categories.find((c) => c.id === tx.categoryId);
        const catName = cat ? cat.name : "Lainnya";
        const catColor = cat ? cat.color : "#64748b";

        if (expenseMap[catName]) {
          expenseMap[catName].value += tx.amount;
        } else {
          expenseMap[catName] = {
            name: catName,
            value: tx.amount,
            color: catColor,
          };
        }
      }
    });

    return Object.values(expenseMap).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  // 5. RECENT 5 TRANSACTIONS
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  // 6. GENERATE INTELLIGENT SAAS INSIGHTS
  const insights = useMemo(() => {
    const list = [];
    if (transactions.length < 5) {
      list.push({
        text: "Catat setidaknya 5 transaksi untuk mendapatkan wawasan analisis AI pribadi Anda.",
        type: "info",
        icon: Sparkles,
      });
      return list;
    }

    // Insight 1: Savings rate
    if (stats.savings > 20) {
      list.push({
        text: `Rasio tabungan Anda sehat! Anda menyisihkan ${stats.savings.toFixed(0)}% dari pendapatan bersih bulan ini.`,
        type: "success",
        icon: PiggyBank,
      });
    } else {
      list.push({
        text: "Rasio tabungan Anda di bawah 20%. Cobalah batasi belanja barang non-primer.",
        type: "warning",
        icon: Percent,
      });
    }

    // Insight 2: Food Expense Insight
    const foodCat = categories.find((c) => c.name.toLowerCase() === "makanan");
    if (foodCat) {
      const foodTxs = transactions.filter((t) => t.categoryId === foodCat.id);
      const totalFood = foodTxs.reduce((sum, t) => sum + t.amount, 0);
      if (totalFood > 0 && stats.totalExpense > 0) {
        const foodPercent = (totalFood / stats.totalExpense) * 100;
        if (foodPercent > 35) {
          list.push({
            text: `Pengeluaran kuliner Anda mencakup ${foodPercent.toFixed(0)}% total anggaran. Pertimbangkan memasak di rumah.`,
            type: "warning",
            icon: UtensilsCrossed,
          });
        } else {
          list.push({
            text: `Hebat! Pengeluaran makanan terkontrol dengan baik di angka ${foodPercent.toFixed(0)}% pengeluaran Anda.`,
            type: "success",
            icon: Lightbulb,
          });
        }
      }
    }

    // Insight 3: Freelance/Income Growth
    const freelanceCat = categories.find(
      (c) => c.name.toLowerCase() === "freelance",
    );
    if (freelanceCat) {
      const freelanceTxs = transactions.filter(
        (t) => t.categoryId === freelanceCat.id,
      );
      const totalFreelance = freelanceTxs.reduce((sum, t) => sum + t.amount, 0);
      if (totalFreelance > 0) {
        list.push({
          text: `Pendapatan sampingan freelance Anda berkontribusi sebesar ${formatCurrency(totalFreelance)} bulan ini.`,
          type: "success",
          icon: TrendIcon,
        });
      }
    }

    return list.slice(0, 2); // Show top 2 insights
  }, [transactions, stats, categories]);

  return (
      <DashboardLayout>
        {dataLoading ? (
          <DashboardSkeleton />
      ) : (
      <div className="flex flex-col gap-6 text-left">
        {/* Hero Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-border/70 p-5 sm:p-8">
          {/* Sparkle Background */}
          <div className="sparkle-container">
            <div className="sparkle-dot" style={{ left: '5%', top: '30%' }} />
            <div className="sparkle-dot" />
            <div className="sparkle-dot" />
            <div className="sparkle-dot" />
            <div className="sparkle-dot" />
            <div className="sparkle-dot" />
            <div className="sparkle-dot" />
            <div className="sparkle-dot" />
            <div className="sparkle-dot" />
            <div className="sparkle-dot" />
          </div>

          <div className="relative z-10 flex flex-col items-start gap-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              <span className="typing-cursor bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">{displayedGreeting}</span>
              {!isNewDay && streak.count >= 2 && (
                <span className="inline-flex items-center gap-1 ml-3 text-sm font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full align-middle">
                  <Flame className="h-4 w-4" /> {streak.count} hari
                </span>
              )}
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm md:text-base font-medium">
              📅 <span className="capitalize">{todayFormatted}</span> &bull;
              Ringkasan transaksi Anda bulan ini.
            </p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() =>
                navigate("/transactions", { state: { openAddModal: true } })
              }
              className="shadow-sm py-2.5 mt-2"
            >
              Transaksi Baru
            </Button>
          </div>
        </div>

        {/* Monthly Report */}
        {showMonthlyReport && (() => {
          const prevMonth = new Date();
          prevMonth.setMonth(prevMonth.getMonth() - 1);
          const prevYm = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
          const prevTx = transactions.filter((t) => t.date && t.date.startsWith(prevYm));
          const prevIncome = prevTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
          const prevExpense = prevTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          return (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="p-4 bg-gradient-to-br from-emerald-500/5 to-primary/5 border border-emerald-500/20 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 flex-shrink-0">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wider mb-0.5">Laporan Bulan Lalu</p>
                      <p className="text-sm text-text font-semibold mb-2">
                        {prevMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                      </p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-success">↑ Rp {prevIncome.toLocaleString('id-ID')}</span>
                        <span className="text-danger">↓ Rp {prevExpense.toLocaleString('id-ID')}</span>
                        <span className="text-text font-bold">Rp {(prevIncome - prevExpense).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowMonthlyReport(false)} className="text-text-muted hover:text-text p-1 text-xs font-semibold">Tutup</button>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Savings Goals Widget */}
        {savingsGoals.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {savingsGoals.slice(0, 3).map((goal) => {
              const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
              return (
                <button
                  key={goal.id}
                  onClick={() => navigate('/goals')}
                  className="flex items-center gap-3 px-4 py-2.5 bg-surface border border-border/60 rounded-xl hover:bg-surface-hover transition-colors group"
                >
                  <Target className="h-4 w-4" style={{ color: goal.color }} />
                  <div>
                    <p className="text-xs font-semibold text-text">{goal.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-border/40 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
                      </div>
                      <span className="text-[10px] text-text-secondary">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 1. Stat Cards Section dengan Animasi Hover Focus Zoom */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {/* Card 1: Total Saldo */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            onMouseEnter={() => setHoveredStatCard(0)}
            onMouseLeave={() => setHoveredStatCard(null)}
            onClick={() => navigate("/transactions")}
            className={`transition-all duration-300 ease-out cursor-pointer ${
              hoveredStatCard === 0
                ? "scale-105 z-10 shadow-2xl"
                : hoveredStatCard !== null
                  ? "scale-95 opacity-60 blur-[0.3px]"
                  : "scale-100 opacity-100"
            }`}
          >
            <Card
              hover={false}
              className="border border-border/70 flex flex-col text-left h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Total Saldo
                </span>
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-text mb-1 tracking-tight">
                <AnimatedCounter value={stats.totalBalance} prefix="Rp " />
              </h3>
              <span className="text-xs text-text-secondary font-medium">
                Aset bersih terakumulasi
              </span>
            </Card>
          </motion.div>

          {/* Card 2: Pemasukan (Font Emerald Green) */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            onMouseEnter={() => setHoveredStatCard(1)}
            onMouseLeave={() => setHoveredStatCard(null)}
            onClick={() => navigate("/transactions")}
            className={`transition-all duration-300 ease-out cursor-pointer ${
              hoveredStatCard === 1
                ? "scale-105 z-10 shadow-2xl"
                : hoveredStatCard !== null
                  ? "scale-95 opacity-60 blur-[0.3px]"
                  : "scale-100 opacity-100"
            }`}
          >
            <Card
              hover={false}
              className="border border-border/70 flex flex-col text-left h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Pemasukan
                </span>
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-emerald-500 dark:text-emerald-400 mb-1 tracking-tight">
                <AnimatedCounter value={stats.monthlyIncome} prefix="Rp " />
              </h3>
              <span className="text-xs text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Bulan berjalan
              </span>
            </Card>
          </motion.div>

          {/* Card 3: Pengeluaran (Font Rose Red) */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            onMouseEnter={() => setHoveredStatCard(2)}
            onMouseLeave={() => setHoveredStatCard(null)}
            onClick={() => navigate("/transactions")}
            className={`transition-all duration-300 ease-out cursor-pointer ${
              hoveredStatCard === 2
                ? "scale-105 z-10 shadow-2xl"
                : hoveredStatCard !== null
                  ? "scale-95 opacity-60 blur-[0.3px]"
                  : "scale-100 opacity-100"
            }`}
          >
            <Card
              hover={false}
              className="border border-border/70 flex flex-col text-left h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Pengeluaran
                </span>
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                  <TrendingDown className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-rose-500 dark:text-rose-400 mb-1 tracking-tight">
                <AnimatedCounter value={stats.monthlyExpense} prefix="Rp " />
              </h3>
              <span className="text-xs text-rose-500 dark:text-rose-400 font-bold flex items-center gap-0.5">
                <ArrowDownRight className="h-3.5 w-3.5" />
                Bulan berjalan
              </span>
            </Card>
          </motion.div>

          {/* Card 4: Rasio Tabungan */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            onMouseEnter={() => setHoveredStatCard(3)}
            onMouseLeave={() => setHoveredStatCard(null)}
            onClick={() => navigate("/budgets")}
            className={`transition-all duration-300 ease-out cursor-pointer ${
              hoveredStatCard === 3
                ? "scale-105 z-10 shadow-2xl"
                : hoveredStatCard !== null
                  ? "scale-95 opacity-60 blur-[0.3px]"
                  : "scale-100 opacity-100"
            }`}
          >
            <Card
              hover={false}
              className="border border-border/70 flex flex-col text-left h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                  Rasio Tabungan
                </span>
                <div className="p-2 bg-warning/10 rounded-xl text-warning">
                  <PiggyBank className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-text mb-1 tracking-tight">
                <AnimatedCounter
                  value={stats.savings}
                  suffix=" %"
                  decimals={1}
                />
              </h3>
              <span className="text-xs text-text-secondary font-medium">
                Dari total pendapatan bersih
              </span>
            </Card>
          </motion.div>
        </motion.div>

        {/* 2. Grafik Arus Kas Keuangan (Full Width 100%) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
        <Card
          className="w-full border border-border/70 flex flex-col text-left"
          hover={false}
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-text tracking-tight">
              Arus Kas Keuangan
            </h3>
            <p className="text-xs text-text-secondary">
              Statistik perbandingan pemasukan dan pengeluaran Anda 6 bulan
              terakhir.
            </p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="chartIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="chartExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `Rp ${val / 1000}k`}
                />
                <Tooltip content={<CustomTooltipCurrency />} />
                <Legend verticalAlign="top" height={36} iconType="circle" formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}>{value}</span>} />
                <Area
                  name="Income"
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#chartIncome)"
                />
                <Area
                  name="Expense"
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#chartExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        </motion.div>

        {/* 3. Section Bawah: Pengeluaran (Kiri 50%) & Rincian Kategori Terbesar (Kanan 50%) */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* Kolom Kiri 50%: Expense Allocation Pie Chart */}
          <Card
            className="border border-border/70 flex flex-col text-left justify-between h-full"
            hover={false}
          >
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-text tracking-tight">
                  Alokasi Anggaran Pengeluaran
                </h3>
                <p className="text-xs text-text-secondary">
                  Distribusi total pengeluaran per kategori.
                </p>
              </div>
              {categoryChartData.length > 0 ? (
                <div className="h-56 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Total Overlay inside Center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">
                      Total
                    </span>
                    <span className="text-sm font-black text-text truncate max-w-[120px]">
                      {formatCurrency(stats.totalExpense)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex items-center justify-center">
                  <EmptyState
                    title="Belum Ada Distribusi"
                    description="Wawasan alokasi akan terhitung setelah Anda mencatat pengeluaran."
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-text-secondary mt-4">
              <span>Status Anggaran</span>
              <span className="font-bold text-success flex items-center gap-1">
                ● Terkendali
              </span>
            </div>
          </Card>

          {/* Kolom Kanan 50%: Rincian Kategori Pengeluaran Terbesar (Ketinggian Pas Sejajar) */}
          <Card
            className="border border-border/70 flex flex-col text-left justify-between h-full"
            hover={false}
          >
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-text tracking-tight">
                  Rincian Kategori Terbesar
                </h3>
                <p className="text-xs text-text-secondary">
                  Persentase pengeluaran berdasarkan kategori terbanyak.
                </p>
              </div>

              {categoryChartData.length > 0 ? (
                <div className="flex flex-col gap-3.5 my-auto">
                  {categoryChartData.slice(0, 4).map((cat, idx) => {
                    const percent =
                      stats.totalExpense > 0
                        ? ((cat.value / stats.totalExpense) * 100).toFixed(1)
                        : 0;
                    return (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-text flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-text-secondary font-medium">
                              {percent}%
                            </span>
                            <span className="font-extrabold text-text">
                              {formatCurrency(cat.value)}
                            </span>
                          </div>
                        </div>
                        {/* Progress Bar Visual */}
                        <div className="w-full h-2.5 bg-input-bg border border-border/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 flex items-center justify-center">
                  <EmptyState
                    title="Belum Ada Data"
                    description="Rincian kategori akan tampil setelah Anda mencatat pengeluaran."
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-text-secondary mt-4">
              <span>Total Pengeluaran Bulan Ini</span>
              <span className="font-black text-danger text-sm">
                {formatCurrency(stats.monthlyExpense)}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* 4. Recent Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
        <Card
          className="border border-border/70 flex flex-col text-left"
          hover={false}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-text tracking-tight">
                Transaksi Terakhir
              </h3>
              <p className="text-xs text-text-secondary">
                Daftar pencatatan mutasi terbaru akun Anda.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/transactions")}
              className="text-primary hover:text-primary-hover flex items-center gap-1 text-xs font-bold"
            >
              Lihat Riwayat
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="flex flex-col divide-y divide-border/30">
              {recentTransactions.map((tx, idx) => {
                const cat = categories.find((c) => c.id === tx.categoryId);
                const isIncome = tx.type === "income";

                // Get stylized icon elements
                const iconDetails = getMerchantIcon(tx.description, cat?.icon);
                const MerchantIcon = iconDetails.icon;

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between py-3.5 hover:bg-surface-hover/30 rounded-xl px-2 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      {/* Logo / Merchant Avatar */}
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconDetails.bg}`}
                      >
                        <MerchantIcon className="h-5 w-5" />
                      </div>

                      <div className="text-left overflow-hidden">
                        <span className="font-bold text-sm text-text block truncate max-w-[180px] sm:max-w-sm">
                          {tx.description || (cat ? cat.name : "Lainnya")}
                        </span>
                        <span className="text-[10px] text-text-secondary font-medium">
                          {formatDateShort(tx.date)} &bull;{" "}
                          {cat ? cat.name : "Lainnya"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span
                        className={`font-extrabold text-sm whitespace-nowrap
                        ${isIncome ? "text-success" : "text-danger"}
                      `}
                      >
                        {isIncome ? "+" : "-"} {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Tidak ada transaksi"
              description="Catatan transaksi keuangan Anda masih kosong."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    navigate("/transactions", { state: { openAddModal: true } })
                  }
                >
                  Mulai Mencatat
                </Button>
              }
            />
          )}
        </Card>
        </motion.div>
      </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
