'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await adminAPI.getAnalytics();
            setAnalytics(response.data.analytics);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading analytics...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Campus Overview
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                    <div className="text-sm font-medium opacity-90">Total Students</div>
                    <div className="text-4xl font-bold mt-2">{analytics?.totalStudents || 0}</div>
                </div>

                <div className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
                    <div className="text-sm font-medium opacity-90">Average Score</div>
                    <div className="text-4xl font-bold mt-2">{analytics?.averageScore || '0'}</div>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="text-sm font-medium opacity-90">Skills Completed</div>
                    <div className="text-4xl font-bold mt-2">{analytics?.totalSkillsCompleted || 0}</div>
                </div>

                <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="text-sm font-medium opacity-90">Avg Skills/Student</div>
                    <div className="text-4xl font-bold mt-2">{analytics?.averageSkillsPerStudent || '0'}</div>
                </div>
            </div>

            {/* Top Performers */}
            {analytics?.topPerformers && analytics.topPerformers.length > 0 && (
                <div className="card mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        🏆 Top 5 Performers
                    </h3>
                    <div className="space-y-3">
                        {analytics.topPerformers.map((student, index) => (
                            <div
                                key={student.studentId}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`text-2xl ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}`}>
                                        {index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : `#${index + 1}`}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{student.name}</div>
                                        <div className="text-sm text-gray-600">{student.rollNumber} • {student.department}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary-700">{student.score}</div>
                                    <div className="text-xs text-gray-500">Score</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Department Stats */}
            {analytics?.departmentStats && analytics.departmentStats.length > 0 && (
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        📈 Department-wise Performance
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Students</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Average Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.departmentStats.map((dept, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">{dept.department}</td>
                                        <td className="py-3 px-4">{dept.studentCount}</td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium">
                                                {dept.averageScore}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
