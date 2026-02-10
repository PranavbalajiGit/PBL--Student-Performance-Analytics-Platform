'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

export default function RankingsPage() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        try {
            const response = await adminAPI.getRankings();
            setRankings(response.data.rankings);
        } catch (error) {
            console.error('Failed to fetch rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading rankings...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                🏆 Student Rankings (Campus-Wide)
            </h2>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Roll Number</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Visibility</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map((student) => (
                                <tr
                                    key={student.studentId}
                                    className={`border-b border-gray-100 hover:bg-gray-50 ${student.rank <= 3 ? 'bg-yellow-50' : ''
                                        }`}
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {student.rank === 1 && <span className="text-2xl">🥇</span>}
                                            {student.rank === 2 && <span className="text-2xl">🥈</span>}
                                            {student.rank === 3 && <span className="text-2xl">🥉</span>}
                                            <span className="font-bold text-lg">#{student.rank}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-medium text-gray-900">
                                        {student.name}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{student.rollNumber}</td>
                                    <td className="py-3 px-4 text-gray-600">{student.department}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-semibold">
                                            {student.score}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {student.isTopTwenty ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                                📢 Public
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                                                🔒 Private
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-blue-600 text-xl">ℹ️</span>
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Privacy Policy:</p>
                            <p>
                                Students ranked in the Top 20 have their rankings publicly visible. All other students
                                can only see their own rank. This promotes healthy competition while respecting privacy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
