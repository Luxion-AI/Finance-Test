import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, ArrowUpRight, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* ----------------- LEFT SIDE (Forms) ----------------- */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col px-5 sm:px-10 md:px-16 xl:px-20 py-8 relative z-10 bg-surface min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6"
        >
          <Logo showText={true} className="h-8 w-8" textClass="text-lg" />
        </motion.div>

        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-sm mx-auto lg:mx-0"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* ----------------- RIGHT SIDE (Fintech Showcase) ----------------- */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] dark-fintech-panel relative items-center justify-center p-12 overflow-hidden border-l border-white/10">
        <div className="mesh-lines absolute inset-0 opacity-70 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-lg w-full flex flex-col gap-6">
          {/* Header Description */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-left mb-6"
          >
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-3">
              Keuangan pribadi yang terasa rapi, cepat, dan tenang.
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed">
              Analisis pemasukan, kontrol pengeluaran rutin, dan atur rasio tabungan Anda dalam satu dashboard terintegrasi yang modern.
            </p>
          </motion.div>

          {/* Floating Cards (Redesigned Mock Dashboard Showcase) */}
          <div className="relative h-[300px] w-full mt-4">
            
            {/* Card 1: Balance (Center Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
              className="absolute left-0 top-0 w-64 bg-white/[0.08] backdrop-blur-md border border-white/10 p-5 rounded-lg shadow-2xl text-left animate-float"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Balance</span>
                <div className="p-2 bg-blue-400/15 rounded-lg text-blue-300">
                  <Wallet className="h-[18px] w-[18px]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Rp 12.850.000</h3>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +14.2% dari bulan lalu
              </span>
            </motion.div>

            {/* Card 2: Growth Chart (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 80 }}
              className="absolute right-0 bottom-4 w-72 bg-white/[0.08] backdrop-blur-md border border-white/10 p-5 rounded-lg shadow-2xl text-left animate-float-delayed"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pertumbuhan Investasi</span>
                  <span className="text-lg font-bold text-white">Rp 4.300.000</span>
                </div>
                <div className="p-2 bg-emerald-400/10 rounded-lg text-emerald-400">
                  <TrendingUp className="h-[18px] w-[18px]" />
                </div>
              </div>
              {/* Micro-sparkline mockup inside */}
              <div className="h-14 w-full flex items-end gap-1.5 pt-2">
                <div className="bg-slate-800 h-[30%] w-full rounded-t-sm" />
                <div className="bg-slate-800 h-[45%] w-full rounded-t-sm" />
                <div className="bg-slate-800 h-[35%] w-full rounded-t-sm" />
                <div className="bg-slate-800 h-[60%] w-full rounded-t-sm" />
                <div className="bg-primary/40 h-[50%] w-full rounded-t-sm" />
                <div className="bg-primary h-[85%] w-full rounded-t-sm" />
                <div className="bg-emerald-400 h-full w-full rounded-t-sm" />
              </div>
            </motion.div>

            {/* Card 3: Recent Activity Notification (Top Right) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute right-4 top-[-20px] bg-white/[0.08] backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-2xl flex items-center gap-3 w-56 text-left"
            >
              <div className="h-9 w-9 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-slate-400 block font-semibold">Budget Aman</span>
                <span className="text-xs font-bold text-white truncate block">Makanan turun 15%</span>
                <span className="text-[10px] text-emerald-400 font-bold block">Target bulan ini on track</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
