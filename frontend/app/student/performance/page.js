'use client';

import { useEffect, useState } from 'react';
import { studentAPI } from '@/lib/api';

export default function PerformancePage() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await studentAPI.getAnalytics();
                setAnalytics(response.data.analytics);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-8 text-gray-600">
                Failed to load analytics data.
            </div>
        );
    }

    // Calculate score details for breakdown based on the backend calculation weights
    // Academic Marks (40%), P-Skills (20%), Activity Points (15%), Reward Points (15%), External Profiles (10%)
    const calculateCategoryScores = () => {
        let academic = 0, pskills = 0, activity = 0, reward = 0, external = 0;

        // Academic (out of 40)
        if (analytics.academicPerformance) {
            academic = (analytics.academicPerformance.average / 100) * 40;
        }

        // P-Skills (out of 20)
        if (analytics.skills && analytics.skills.skills) {
            const skillScore = analytics.skills.skills.reduce((acc, skill) => {
                const levelScore = skill.level === 'Advanced' ? 30 : skill.level === 'Intermediate' ? 20 : 10;
                return acc + levelScore;
            }, 0);
            const normalizedSkillScore = Math.min((skillScore / 120) * 100, 100);
            pskills = (normalizedSkillScore / 100) * 20;
        }

        // Activity points (out of 15)
        if (analytics.activityRewardPoints) {
            const activityScore = Math.min((analytics.activityRewardPoints.activityPoints / 200) * 100, 100);
            activity = (activityScore / 100) * 15;
            
            // Reward points (out of 15)
            const rewardScore = Math.min((analytics.activityRewardPoints.rewardPoints / 150) * 100, 100);
            reward = (rewardScore / 100) * 15;
        }

        // External profiles (out of 10)
        if (analytics.externalProfiles) {
            let externalScore = 0;
            let validProfiles = 0;
            if (analytics.externalProfiles.githubScore) { externalScore += analytics.externalProfiles.githubScore; validProfiles++; }
            if (analytics.externalProfiles.leetcodeScore) { externalScore += analytics.externalProfiles.leetcodeScore; validProfiles++; }
            
            if (validProfiles > 0) {
                externalScore = externalScore / validProfiles;
                external = (externalScore / 100) * 10;
            }
        }

        return { academic, pskills, activity, reward, external };
    };

    const categoryScores = calculateCategoryScores();

    const ProgressRow = ({ label, score, max, color, percentage }) => (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-medium text-gray-900">{score.toFixed(1)} / {max}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full ${color}`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    Performance Analytics
                </h2>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    Overall Score: {analytics.overallScore}%
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Breakdown Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h3 className="text-xl font-semibold border-b border-gray-100 pb-4 mb-6">
                            Score Breakdown
                        </h3>
                        
                        <div className="space-y-6">
                            <ProgressRow 
                                label="Academic Marks (Weight: 40%)" 
                                score={categoryScores.academic} 
                                max={40} 
                                percentage={(categoryScores.academic / 40) * 100}
                                color="bg-blue-600"
                            />
                            
                            <ProgressRow 
                                label="P-Skills Mastery (Weight: 20%)" 
                                score={categoryScores.pskills} 
                                max={20} 
                                percentage={(categoryScores.pskills / 20) * 100}
                                color="bg-purple-600"
                            />
                            
                            <ProgressRow 
                                label="Activity Points (Weight: 15%)" 
                                score={categoryScores.activity} 
                                max={15} 
                                percentage={(categoryScores.activity / 15) * 100}
                                color="bg-orange-500"
                            />
                            
                            <ProgressRow 
                                label="Reward Points (Weight: 15%)" 
                                score={categoryScores.reward} 
                                max={15} 
                                percentage={(categoryScores.reward / 15) * 100}
                                color="bg-yellow-500"
                            />
                            
                            <ProgressRow 
                                label="External Technical Profiles (Weight: 10%)" 
                                score={categoryScores.external} 
                                max={10} 
                                percentage={(categoryScores.external / 10) * 100}
                                color="bg-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Overall Performance Column */}
                <div className="space-y-6">
                    {/* Dial / Circular Progress equivalent */}
                    <div className="card text-center py-10">
                        <h3 className="text-gray-500 font-medium mb-6">Aggregate Performance</h3>
                        <div className="relative w-48 h-48 mx-auto flex items-center justify-center bg-gray-50 rounded-full shadow-inner border-[12px] border-green-100">
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-green-600">{analytics.overallScore}</span>
                                <span className="text-sm text-gray-500 mt-1">out of 100</span>
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            <h4 className="font-semibold text-gray-900 text-lg">
                                {analytics.overallScore >= 90 ? 'Outstanding 🏆' : 
                                 analytics.overallScore >= 80 ? 'Excellent 🌟' : 
                                 analytics.overallScore >= 70 ? 'Good 👍' : 
                                 analytics.overallScore >= 60 ? 'Satisfactory 📚' : 
                                 'Needs Improvement 📈'}
                            </h4>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">Growth Suggestions</h3>
                        <ul className="text-sm text-gray-600 space-y-3">
                            {categoryScores.academic < 30 && (
                                <li className="flex items-start"><span className="mr-2">📚</span> Focus on improving core academic subjects to boost your heaviest weighted criteria.</li>
                            )}
                            {categoryScores.pskills < 15 && (
                                <li className="flex items-start"><span className="mr-2">🎯</span> Complete more Advanced level P-Skills to increase your skill rating.</li>
                            )}
                            {(categoryScores.activity + categoryScores.reward) < 15 && (
                                <li className="flex items-start"><span className="mr-2">⭐</span> Participate in more campus activities and hackathons to earn reward points.</li>
                            )}
                            {categoryScores.external < 5 && (
                                <li className="flex items-start"><span className="mr-2">👨‍💻</span> Connect and active your GitHub/LeetCode profiles to maximize technical scores.</li>
                            )}
                            {analytics.overallScore >= 80 && (
                                <li className="flex items-start"><span className="mr-2">🔥</span> You are doing great! Keep maintaining your high performance across all areas.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
