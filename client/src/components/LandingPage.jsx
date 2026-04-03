import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LockKeyhole, FolderKanban, Search, Grid3X3, Sparkles, Cloud, Star, Zap, Shield } from 'lucide-react';
import { FloatingVault3D } from './FloatingVault3D';
import { useState, useEffect } from 'react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
};

export default function LandingPage() {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        { title: 'Secure Notes Storage', icon: LockKeyhole, desc: 'End-to-end encrypted academic repository' },
        { title: 'Assignment Vault', icon: FolderKanban, desc: 'Organized resource management system' },
        { title: 'Smart Search', icon: Search, desc: 'AI-powered instant file discovery' },
        { title: 'Organization', icon: Grid3X3, desc: 'Department-wise smart categorization' },
        { title: 'AI Assistance', icon: Sparkles, desc: 'Intelligent resource recommendations' },
        { title: 'Anywhere Access', icon: Cloud, desc: 'Seamless sync across all devices' },
    ];

    const reasons = [
        { title: 'Centralized Storage', icon: Shield, desc: 'All academic resources in one secure place' },
        { title: 'Time Efficient', icon: Zap, desc: 'Find what you need in milliseconds' },
        { title: 'Smart Organization', icon: Grid3X3, desc: 'Auto-categorized by department & semester' },
        { title: 'AI Enhanced', icon: Sparkles, desc: 'Intelligent suggestions & search results' },
        { title: 'Always Secure', icon: LockKeyhole, desc: 'Military-grade encryption for your data' },
    ];

    return (
        <div className="app-shell">
            <div className="app-frame">
                {/* Navigation */}
                <motion.nav className="app-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                    <div className="app-brand glow-text">CAMPUSVAULT</div>
                    <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-slate-300 md:flex">
                        <a href="#home" className="transition-colors hover:text-sky-300">Home</a>
                        <a href="#features" className="transition-colors hover:text-sky-300">Features</a>
                        <a href="#why" className="transition-colors hover:text-sky-300">Why Us</a>
                        <a href="#showcase" className="transition-colors hover:text-sky-300">Showcase</a>
                        <a href="#cta" className="transition-colors hover:text-sky-300">CTA</a>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/login')} className="btn btn-secondary" type="button">Login</button>
                        <button onClick={() => navigate('/register')} className="btn btn-primary" type="button">Start Free</button>
                    </div>
                </motion.nav>

                <main className="app-main">
                    {/* Hero Section */}
                    <motion.section
                        id="home"
                        className="mb-16 grid grid-cols-1 gap-8 items-stretch md:grid-cols-2"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {/* Left Content */}
                        <motion.div className="panel relative overflow-hidden" variants={itemVariants}>
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100" />
                            <div className="relative z-10">
                                <motion.p className="badge animate-float">Campus Intelligence Layer</motion.p>
                                <motion.h1 className="hero-title mt-6 glow-text">THE FUTURE OF STUDENT ACADEMIC VAULTS</motion.h1>
                                <motion.p className="muted mt-6 max-w-2xl text-sm md:text-base leading-relaxed">
                                    Campus Vault revolutionizes how students organize, secure, and access academic resources. Built with cutting-edge encryption, intelligent search, and a futuristic interface for the modern campus experience.
                                </motion.p>
                                <motion.div className="mt-8 flex flex-wrap gap-4" variants={containerVariants}>
                                    <motion.button
                                        onClick={() => navigate('/register')}
                                        className="btn btn-primary group"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                    >
                                        Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => navigate('/login')}
                                        className="btn btn-secondary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                    >
                                        Sign In
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right - 3D Vault */}
                        <motion.div className="panel fade-delay overflow-hidden" variants={itemVariants}>
                            <FloatingVault3D />
                        </motion.div>
                    </motion.section>

                    {/* Features Section */}
                    <motion.section
                        id="features"
                        className="mb-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div className="mb-8">
                            <motion.p className="badge inline-block">POWERED BY INTELLIGENCE</motion.p>
                            <motion.h2 className="mt-4 text-3xl md:text-4xl font-bold text-white glow-text">
                                Six Core Features
                            </motion.h2>
                            <motion.p className="muted mt-3 max-w-2xl">
                                Everything a student needs to manage academic life in one unified, secure platform.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            {features.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.article
                                        key={feature.title}
                                        className="card group relative"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-sky-500/0 group-hover:from-sky-500/10 group-hover:to-sky-500/5 transition-all duration-300" />
                                        <div className="relative z-10">
                                            <motion.div
                                                className="mb-4 inline-flex rounded-xl border border-sky-300/30 bg-sky-500/15 p-3 text-sky-200"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Icon size={20} />
                                            </motion.div>
                                            <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-200 transition-colors">{feature.title}</h3>
                                            <p className="muted text-xs mt-2">{feature.desc}</p>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </motion.div>
                    </motion.section>

                    {/* Why Section */}
                    <motion.section
                        id="why"
                        className="mb-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div className="panel glow-border">
                            <motion.p className="badge inline-block">WHY CHOOSE US</motion.p>
                            <motion.h2 className="mt-4 text-3xl md:text-4xl font-bold text-white glow-text">Why Campus Vault?</motion.h2>
                            <motion.p className="muted mt-3 mb-8 max-w-2xl">
                                Built specifically for students, by students who understand campus challenges. Security, speed, and intelligence combined.
                            </motion.p>

                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                {reasons.map((reason) => {
                                    const ReasonIcon = reason.icon;
                                    return (
                                        <motion.div
                                            key={reason.title}
                                            className="card flex flex-col gap-3 items-start group cursor-pointer"
                                            variants={itemVariants}
                                            whileHover={{ y: -4 }}
                                        >
                                            <div className="p-2 rounded-lg bg-sky-500/20 group-hover:bg-sky-500/30 transition-colors">
                                                <ReasonIcon size={18} className="text-sky-300" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sky-100">{reason.title}</h3>
                                                <p className="text-xs text-slate-400 mt-1">{reason.desc}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </motion.div>
                    </motion.section>

                    {/* Dashboard Preview Section */}
                    <motion.section
                        id="showcase"
                        className="mb-16 panel glow-border relative overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                        <div className="relative z-10">
                            <motion.p className="badge inline-block">PREVIEW</motion.p>
                            <motion.h2 className="mt-4 text-3xl md:text-4xl font-bold text-white glow-text">Experience the Dashboard</motion.h2>

                            <motion.div
                                className="mt-8 rounded-2xl border border-sky-300/25 bg-gradient-to-br from-slate-950/80 to-slate-900/60 p-6 overflow-hidden"
                                whileHover={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div className="mb-4 flex flex-wrap gap-2">
                                    {['CSE', 'Semester 6', 'Private Vault'].map((tag, i) => (
                                        <motion.span
                                            key={tag}
                                            className="badge"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </motion.div>

                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    <motion.div className="card" variants={itemVariants}>
                                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Resources</p>
                                        <p className="text-3xl font-bold text-sky-100 mt-2">142</p>
                                        <p className="text-xs text-slate-500 mt-1">Files Stored</p>
                                    </motion.div>
                                    <motion.div className="card" variants={itemVariants}>
                                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">AI Suggestions</p>
                                        <p className="text-3xl font-bold text-sky-100 mt-2">18</p>
                                        <p className="text-xs text-slate-500 mt-1">Active Alerts</p>
                                    </motion.div>
                                    <motion.div className="card" variants={itemVariants}>
                                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Search Speed</p>
                                        <p className="text-3xl font-bold text-emerald-300 mt-2">0.3s</p>
                                        <p className="text-xs text-slate-500 mt-1">Average Query</p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.section
                        id="cta"
                        className="mb-8 panel text-center relative overflow-hidden glow-border"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-sky-500/5" />
                        <div className="relative z-10">
                            <motion.h2 className="text-3xl md:text-4xl font-bold text-white glow-text">
                                Ready to Transform Your Academic Life?
                            </motion.h2>
                            <motion.p className="muted mx-auto mt-4 max-w-2xl text-sm md:text-base leading-relaxed">
                                Join thousands of students already using Campus Vault to organize, secure, and access their academic resources with intelligence and speed.
                            </motion.p>
                            <motion.div
                                className="mt-8 flex flex-wrap items-center justify-center gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <motion.button
                                    onClick={() => navigate('/register')}
                                    className="btn btn-primary"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                >
                                    Get Started Today
                                </motion.button>
                                <motion.button
                                    onClick={() => navigate('/login')}
                                    className="btn btn-secondary"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                >
                                    Open Dashboard
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Footer */}
                    <motion.footer
                        className="mt-12 flex flex-col items-center justify-between gap-2 rounded-2xl border border-sky-400/20 bg-slate-900/60 px-5 py-6 text-xs uppercase tracking-[0.2em] text-slate-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-sky-300 font-semibold">Campus Vault</span>
                        <span>Secure • Intelligent • Student-First • 2026</span>
                    </motion.footer>
                </main>
            </div>
        </div>
    );
}

