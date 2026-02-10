'use client';

import { useEffect, useState } from 'react';
import { studentAPI } from '@/lib/api';

export default function StudentDashboard() {
    const [profile, setProfile] = useState(null);
    const [rank, setRank] = useState(null);
    const [marks, setMarks] = useState(null);
    const [skills, setSkills] = useState(null);
    const [points, setPoints] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileRes, rankRes, marksRes, skillsRes, pointsRes] = await Promise.all([
                studentAPI.getProfile(),
                studentAPI.getRank(),
                studentAPI.getMarks(),
                studentAPI.getPSkills(),
                studentAPI.getPoints(),
            ]);

            setProfile(profileRes.data.profile);
            setRank(rankRes.data.rank);
            setMarks(marksRes.data.marks);
            setSkills(skillsRes.data.skills);
            setPoints(pointsRes.data.points);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        }
    };

    if (!profile) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Welcome, {profile.name}!
            </h2>

            {/* Profile Card */}
            <div className="card mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
                        👨‍🎓
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{profile.name}</h3>
                        <p className="opacity-90">{profile.rollNumber} • {profile.department}</p>
                        <p className="text-sm opacity-75">Semester {profile.semester}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {rank && (
                    <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <div className="text-sm font-medium opacity-90">Your Rank</div>
                        <div className="text-4xl font-bold mt-2">#{rank.rank}</div>
                        <div className="text-xs opacity-75 mt-1">Out of {rank.totalStudents}</div>
                    </div>
                )}

                {marks && (
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="text-sm font-medium opacity-90">Average Marks</div>
                        <div className="text-4xl font-bold mt-2">{marks.average}</div>
                        <div className="text-xs opacity-75 mt-1">Out of 100</div>
                    </div>
                )}

                {skills && (
                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="text-sm font-medium opacity-90">Skills Completed</div>
                        <div className="text-4xl font-bold mt-2">{skills.totalCompleted}</div>
                        <div className="text-xs opacity-75 mt-1">P-Skills</div>
                    </div>
                )}

                {points && (
                    <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <div className="text-sm font-medium opacity-90">Total Points</div>
                        <div className="text-4xl font-bold mt-2">{points.activityPoints + points.rewardPoints}</div>
                        <div className="text-xs opacity-75 mt-1">Activity + Rewards</div>
                    </div>
                )}
            </div>

            {/* Academic Performance */}
            {marks && (
                <div className="card mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        📊 Academic Performance
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Marks</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Max Marks</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marks.subjects.map((subject, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{subject.name}</td>
                                        <td className="py-3 px-4">{subject.marks}</td>
                                        <td className="py-3 px-4">{subject.maxMarks}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${(subject.marks / subject.maxMarks) * 100 >= 90
                                                    ? 'bg-green-100 text-green-700'
                                                    : (subject.marks / subject.maxMarks) * 100 >= 75
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {((subject.marks / subject.maxMarks) * 100).toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Skills & Points  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skills && (
                    <div className="card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            🎯 P-Skills Completed
                        </h3>
                        <div className="space-y-3">
                            {skills.skills.map((skill, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="font-medium text-gray-900">{skill.name}</div>
                                        <div className="text-xs text-gray-500">{skill.completionDate}</div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${skill.level === 'Advanced'
                                            ? 'bg-purple-100 text-purple-700'
                                            : skill.level === 'Intermediate'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                        {skill.level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {points && (
                    <div className="card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            ⭐ Activity & Reward Points
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm text-gray-600">Activity Points</div>
                                <div className="text-3xl font-bold text-blue-700">{points.activityPoints}</div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <div className="text-sm text-gray-600">Reward Points</div>
                                <div className="text-3xl font-bold text-orange-700">{points.rewardPoints}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
