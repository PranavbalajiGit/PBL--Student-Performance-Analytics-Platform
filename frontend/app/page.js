'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function LandingPage() {
    const router = useRouter();
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);
    const orb3Ref = useRef(null);
    const orb4Ref = useRef(null);
    const titleRef = useRef(null);

    // Scroll progress for hero zoom effect
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // ===== MASTER TIMELINE FOR CINEMATIC HERO ENTRANCE =====
            const masterTimeline = gsap.timeline({
                defaults: { ease: 'power3.out' }
            });

            // 1. Background orbs scale in with bounce
            masterTimeline.from([orb1Ref.current, orb2Ref.current, orb3Ref.current, orb4Ref.current], {
                scale: 0,
                opacity: 0,
                duration: 1.2,
                stagger: 0.12,
                ease: 'back.out(1.7)',
            }, 0);

            // Continuous floating animation for orbs to feel alive
            gsap.to(orb1Ref.current, {
                y: 30,
                x: 20,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            gsap.to(orb2Ref.current, {
                y: -40,
                x: -25,
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            gsap.to(orb3Ref.current, {
                y: 25,
                scale: 1.15,
                duration: 6,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            gsap.to(orb4Ref.current, {
                y: -35,
                x: 30,
                duration: 4.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            // 2. Title words reveal - word by word with blur and 3D rotation
            const titleWords = titleRef.current?.querySelectorAll('.word');
            if (titleWords && titleWords.length > 0) {
                masterTimeline.from(titleWords, {
                    opacity: 0,
                    y: 100,
                    rotationX: -45,
                    filter: 'blur(12px)',
                    stagger: 0.1,
                    duration: 1.4,
                    ease: 'power4.out',
                    clearProps: 'filter',
                }, 0.4);
            }

            // 3. Subtitle lines reveal
            const subtitleLines = document.querySelectorAll('.subtitle-line');
            if (subtitleLines.length > 0) {
                masterTimeline.from(subtitleLines, {
                    opacity: 0,
                    y: 50,
                    stagger: 0.2,
                    duration: 1,
                    ease: 'power3.out',
                }, '-=0.8');
            } else {
                masterTimeline.from('.hero-subtitle', {
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    ease: 'power3.out',
                }, '-=0.8');
            }

            // 4. CTA powerful entrance with bounce
            masterTimeline.from('.hero-cta', {
                opacity: 0,
                scale: 0.5,
                y: 40,
                duration: 1,
                ease: 'back.out(2.5)',
            }, '-=0.5');

            // Add pulsing glow to primary CTA
            gsap.to('.cta-primary', {
                boxShadow: '0 0 50px rgba(59, 130, 246, 0.7), 0 0 100px rgba(59, 130, 246, 0.4)',
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 2,
            });

            // 5. Scroll indicator
            masterTimeline.from('.scroll-indicator', {
                opacity: 0,
                y: -30,
                duration: 0.8,
                ease: 'power2.out',
            }, '-=0.3');

            // Continuous bounce for scroll indicator
            gsap.to('.scroll-indicator', {
                y: 12,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            // Hide scroll indicator on scroll
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: 'top top',
                end: '+=300',
                onUpdate: (self) => {
                    gsap.to('.scroll-indicator', {
                        opacity: 1 - self.progress * 2,
                        duration: 0.3,
                    });
                },
            });

            // ===== SCROLL-TRIGGERED PARALLAX FOR ORBS =====
            gsap.to(orb1Ref.current, {
                y: 350,
                x: -120,
                rotation: 180,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });

            gsap.to(orb2Ref.current, {
                y: 450,
                x: 120,
                rotation: -180,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });

            gsap.to(orb3Ref.current, {
                y: 550,
                scale: 1.8,
                rotation: 90,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                },
            });

            gsap.to(orb4Ref.current, {
                y: 400,
                x: -70,
                rotation: -90,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2,
                },
            });

            // Feature cards entrance
            gsap.utils.toArray('.feature-card').forEach((card, index) => {
                const direction = index % 3 === 0 ? -100 : index % 3 === 1 ? 100 : 0;
                gsap.from(card, {
                    opacity: 0,
                    x: direction,
                    y: index % 3 === 2 ? 100 : 0,
                    rotateY: direction !== 0 ? direction / 5 : 0,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        end: 'top 50%',
                        scrub: 1,
                    },
                });
            });

            // Role cards 3D rotation
            gsap.utils.toArray('.role-card').forEach((card, index) => {
                gsap.from(card, {
                    opacity: 0,
                    rotateY: -90,
                    transformOrigin: 'center',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 75%',
                        end: 'top 40%',
                        scrub: 1,
                    },
                });
            });

            // Final CTA entrance
            gsap.from('.final-cta-section', {
                opacity: 0,
                scale: 0.8,
                scrollTrigger: {
                    trigger: '.final-cta-section',
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                },
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            icon: '📊',
            title: 'Comprehensive Analytics',
            description: 'Track academic performance, P-Skills, activity points, and external profiles in one unified platform',
        },
        {
            icon: '🔐',
            title: 'Role-Based Access',
            description: 'Secure RBAC system ensuring admins, faculty, and students see only what they need',
        },
        {
            icon: '📈',
            title: 'Performance Insights',
            description: 'Data-driven insights with weighted scoring across academics, skills, and activities',
        },
        {
            icon: '🎯',
            title: 'Privacy-Aware Rankings',
            description: 'Smart ranking system that respects student privacy while promoting healthy competition',
        },
        {
            icon: '📋',
            title: 'Validated Data Uploads',
            description: 'Faculty can upload Excel files with strict validation ensuring data accuracy',
        },
        {
            icon: '🌐',
            title: 'External Profile Integration',
            description: 'Connect GitHub and LeetCode profiles to showcase technical excellence',
        },
    ];

    // Split text into words for animation
    const splitTextIntoWords = (text) => {
        return text.split(' ').map((word, index) => (
            <span key={index} className="word inline-block mr-4" style={{ display: 'inline-block' }}>
                {word}
            </span>
        ));
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-950 overflow-x-hidden">
            {/* Hero Section - Rebuilt */}
            <motion.section
                ref={heroRef}
                style={{ scale: heroScale, opacity: heroOpacity }}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
            >
                {/* Animated gradient orb background - feels alive */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        ref={orb1Ref}
                        className="absolute top-20 left-10 w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-40"
                    />
                    <div
                        ref={orb2Ref}
                        className="absolute top-32 right-20 w-96 h-96 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-35"
                    />
                    <div
                        ref={orb3Ref}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                    />
                    <div
                        ref={orb4Ref}
                        className="absolute top-1/2 right-16 w-80 h-80 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-full mix-blend-screen filter blur-3xl opacity-35"
                    />

                    {/* Noise overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-40" />
                </div>

                {/* Hero content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Animated headline - word by word reveal */}
                    <h1
                        ref={titleRef}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tight perspective-1000"
                    >
                        <div className="mb-2">
                            {splitTextIntoWords('Student Performance')}
                        </div>
                        <div>
                            {'Analytics System'.split(' ').map((word, index) => (
                                <span
                                    key={index}
                                    className="word inline-block mr-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </h1>

                    {/* Subtitle - line by line reveal */}
                    <div className="hero-subtitle space-y-2 mb-14">
                        <p className="subtitle-line text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Empowering educational excellence through
                        </p>
                        <p className="subtitle-line text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            comprehensive analytics and data-driven insights
                        </p>
                    </div>

                    {/* CTA - powerful entrance last */}
                    <div className="hero-cta flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <button
                            onClick={() => router.push('/login')}
                            className="cta-primary group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                        >
                            <span className="relative z-10">View MVP 🚀</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <div className="flex items-center gap-3 px-7 py-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10">
                            <span className="text-gray-300 text-lg">🔒 Google Auth</span>
                            <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium border border-yellow-500/30">
                                Coming Soon
                            </span>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="scroll-indicator absolute bottom-16 left-1/2 -translate-x-1/2">
                        <div className="w-7 h-11 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
                            <div className="w-1.5 h-2.5 bg-white/80 rounded-full" />
                        </div>
                        <p className="text-white/60 text-sm mt-3">Scroll to explore</p>
                    </div>
                </div>
            </motion.section>

            {/* Impact Section */}
            <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl font-bold text-white leading-tight"
                    >
                        One platform.{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Complete visibility.
                        </span>
                    </motion.h2>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-32 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Powerful Features for Every Role
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Designed for admins, faculty, and students with role-specific capabilities
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card group relative"
                                whileHover={{ scale: 1.02, z: 50 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 group-hover:border-blue-500/50 transition-all duration-300 h-full">
                                    <motion.div
                                        className="text-6xl mb-6"
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-semibold text-white mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role Showcase with 3D Cards */}
            <section className="relative py-32 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Built for Three Roles
                        </h2>
                        <p className="text-xl text-gray-400">
                            Tailored experiences for administrators, faculty, and students
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
                        <div className="role-card" style={{ transformStyle: 'preserve-3d' }}>
                            <motion.div
                                whileHover={{ rotateY: 5, scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-gradient-to-br from-blue-600 to-blue-700 p-10 rounded-2xl h-full shadow-2xl"
                            >
                                <div className="text-5xl mb-6">👨‍💼</div>
                                <h3 className="text-3xl font-bold text-white mb-6">Admin</h3>
                                <ul className="space-y-3 text-gray-100">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Manage users and roles
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Configure faculty-student mappings
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Campus-wide analytics
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Full student rankings
                                    </li>
                                </ul>
                            </motion.div>
                        </div>

                        <div className="role-card" style={{ transformStyle: 'preserve-3d' }}>
                            <motion.div
                                whileHover={{ rotateY: 5, scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-gradient-to-br from-purple-600 to-purple-700 p-10 rounded-2xl h-full shadow-2xl"
                            >
                                <div className="text-5xl mb-6">👨‍🏫</div>
                                <h3 className="text-3xl font-bold text-white mb-6">Faculty</h3>
                                <ul className="space-y-3 text-gray-100">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> View mapped students
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Upload validated Excel data
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Track student performance
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Class-specific analytics
                                    </li>
                                </ul>
                            </motion.div>
                        </div>

                        <div className="role-card" style={{ transformStyle: 'preserve-3d' }}>
                            <motion.div
                                whileHover={{ rotateY: 5, scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-gradient-to-br from-green-600 to-green-700 p-10 rounded-2xl h-full shadow-2xl"
                            >
                                <div className="text-5xl mb-6">👨‍🎓</div>
                                <h3 className="text-3xl font-bold text-white mb-6">Student</h3>
                                <ul className="space-y-3 text-gray-100">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Personal performance dashboard
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Privacy-aware rankings
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Skills and activity tracking
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Connect external profiles
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="final-cta-section relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center px-4"
                >
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                        Ready to Transform{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Student Analytics?
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 mb-12">
                        Experience the MVP and see how comprehensive analytics drive educational excellence
                    </p>
                    <motion.button
                        onClick={() => router.push('/login')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-xl shadow-2xl overflow-hidden"
                    >
                        <span className="relative z-10">Get Started Now →</span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-gray-500 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-lg">Student Performance Analytics System - MVP Version</p>
                    <p className="text-sm mt-2">Built with Next.js, Express, and comprehensive RBAC</p>
                </div>
            </footer>
        </div>
    );
}
