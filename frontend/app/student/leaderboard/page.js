'use client';

import { useEffect, useState } from 'react';
import { studentAPI } from '@/lib/api';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await studentAPI.getLeaderboard();
            setLeaderboard(response.data.leaderboard);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading leaderboard...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                🏆 Campus Top 20 Leaderboard
            </h2>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((student) => (
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
                                    <td className="py-3 px-4 text-gray-600">{student.department}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold border border-green-200">
                                            {student.score}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-green-600 text-xl">ℹ️</span>
                        <div className="text-sm text-green-800">
                            <p className="font-medium mb-1">About the Leaderboard:</p>
                            <p>
                                This leaderboard showcases the Top 20 performers on campus based on 
                                their cumulative performance across academics, skills, and activities.
                                Keep up the great work to climb the ranks!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
