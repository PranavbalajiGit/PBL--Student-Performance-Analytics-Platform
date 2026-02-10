'use client';

import { useEffect, useState } from 'react';
import { studentAPI } from '@/lib/api';

export default function RankPage() {
    const [rankInfo, setRankInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRank();
    }, []);

    const fetchRank = async () => {
        try {
            const response = await studentAPI.getRank();
            setRankInfo(response.data.rank);
        } catch (error) {
            console.error('Failed to fetch rank:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!rankInfo) {
        return <div className="text-center py-8">No ranking data available</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Your Ranking
            </h2>

            <div className="card text-center py-12">
                {rankInfo.isPublic && rankInfo.rank <= 3 && (
                    <div className="text-8xl mb-6">
                        {rankInfo.rank === 1 ? '🥇' : rankInfo.rank === 2 ? '🥈' : '🥉'}
                    </div>
                )}

                <div className="text-7xl font-bold text-primary-700 mb-4">
                    #{rankInfo.rank}
                </div>

                <div className="text-2xl text-gray-600 mb-6">
                    Out of {rankInfo.totalStudents} students
                </div>

                <div className="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-700 rounded-full text-lg font-medium mb-6">
                    Score: {rankInfo.score}
                </div>

                <div className={`p-6 rounded-lg max-w-2xl mx-auto ${rankInfo.isPublic
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-3xl">
                            {rankInfo.isPublic ? '📢' : '🔒'}
                        </span>
                        <h3 className={`text-xl font-semibold ${rankInfo.isPublic ? 'text-green-700' : 'text-blue-700'
                            }`}>
                            {rankInfo.isPublic ? 'Public Ranking' : 'Private Ranking'}
                        </h3>
                    </div>
                    <p className={`text-lg ${rankInfo.isPublic ? 'text-green-800' : 'text-blue-800'
                        }`}>
                        {rankInfo.message}
                    </p>
                </div>

                {rankInfo.isPublic && (
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
                        <p className="text-yellow-800">
                            🎉 Congratulations! Your outstanding performance has earned you a spot in the Top 20.
                            Your rank is visible to all students as recognition of your excellence.
                        </p>
                    </div>
                )}

                {!rankInfo.isPublic && (
                    <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl mx-auto">
                        <p className="text-gray-700">
                            💡 Keep working towards the Top 20 to make your rank publicly visible!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
