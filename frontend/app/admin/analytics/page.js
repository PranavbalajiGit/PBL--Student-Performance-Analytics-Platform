'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await adminAPI.getAnalytics();
            setAnalytics(response.data.analytics);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    };

    if (!analytics) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                📊 Campus Analytics
            </h2>

            <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="text-sm font-medium opacity-90">Total Students</div>
                        <div className="text-4xl font-bold mt-2">{analytics.totalStudents}</div>
                    </div>
                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="text-sm font-medium opacity-90">Average Score</div>
                        <div className="text-4xl font-bold mt-2">{analytics.averageScore}</div>
                    </div>
                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="text-sm font-medium opacity-90">Total Skills</div>
                        <div className="text-4xl font-bold mt-2">{analytics.totalSkillsCompleted}</div>
                    </div>
                    <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <div className="text-sm font-medium opacity-90">Avg Skills/Student</div>
                        <div className="text-4xl font-bold mt-2">{analytics.averageSkillsPerStudent}</div>
                    </div>
                </div>

                {/* Department Performance */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Department-wise Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analytics.departmentStats.map((dept, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900">{dept.department}</h4>
                                        <p className="text-sm text-gray-600">{dept.studentCount} students</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary-700">{dept.averageScore}</div>
                                        <div className="text-xs text-gray-500">Avg Score</div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(parseFloat(dept.averageScore) / 100) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performers */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        🏆 Top Performers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {analytics.topPerformers.map((student, index) => (
                            <div
                                key={student.studentId}
                                className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="text-3xl mb-2">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                                </div>
                                <div className="font-semibold text-gray-900 mb-1">{student.name}</div>
                                <div className="text-xs text-gray-600 mb-2">{student.rollNumber}</div>
                                <div className="text-2xl font-bold text-primary-700">{student.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
