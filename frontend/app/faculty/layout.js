'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function FacultyLayout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            const userData = response.data.user;

            if (userData.role !== 'faculty') {
                router.push('/login');
                return;
            }

            setUser(userData);
        } catch (error) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-secondary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-secondary-700">
                                👨‍🏫 Faculty Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Welcome, <span className="font-semibold">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <nav className="space-y-2">
                            <Link href="/faculty" className="sidebar-link">
                                <span className="text-xl mr-3">🏠</span>
                                <span>Dashboard</span>
                            </Link>
                            <Link href="/faculty/students" className="sidebar-link">
                                <span className="text-xl mr-3">👥</span>
                                <span>My Students</span>
                            </Link>
                            <Link href="/faculty/upload" className="sidebar-link">
                                <span className="text-xl mr-3">📤</span>
                                <span>Upload Data</span>
                            </Link>
                            <Link href="/faculty/analytics" className="sidebar-link">
                                <span className="text-xl mr-3">📊</span>
                                <span>Student Analytics</span>
                            </Link>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
