'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { facultyAPI } from '@/lib/api';
import Link from 'next/link';

function FacultyAnalyticsContent() {
    const searchParams = useSearchParams();
    const initialStudentId = searchParams.get('studentId');

    const [mappedStudents, setMappedStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || '');
    const [analytics, setAnalytics] = useState(null);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [error, setError] = useState(null);

    // Fetch mapped students for the dropdown
    useEffect(() => {
        fetchMappedStudents();
    }, []);

    // Fetch analytics when selected student changes
    useEffect(() => {
        if (selectedStudentId) {
            fetchStudentAnalytics(selectedStudentId);
        } else {
            setAnalytics(null);
        }
    }, [selectedStudentId]);

    const fetchMappedStudents = async () => {
        try {
            const response = await facultyAPI.getStudents();
            setMappedStudents(response.data.students);
            // If no student selected but we have mapped students, select the first one
            if (!initialStudentId && response.data.students.length > 0) {
                setSelectedStudentId(response.data.students[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch mapped students:', err);
            setError('Failed to load students list.');
        } finally {
            setLoadingStudents(false);
        }
    };

    const fetchStudentAnalytics = async (studentId) => {
        setLoadingAnalytics(true);
        setError(null);
        try {
            const response = await facultyAPI.getStudentAnalytics(studentId);
            setAnalytics(response.data.analytics);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError(err.response?.data?.error || 'Failed to load student analytics.');
            setAnalytics(null);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const handleStudentChange = (e) => {
        setSelectedStudentId(e.target.value);
    };

    if (loadingStudents) {
        return <div className="text-center py-8">Loading students...</div>;
    }

    if (mappedStudents.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                You have no mapped students to view analytics for.
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-900">
                    Student Analytics
                </h2>
                
                <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <label htmlFor="student-select" className="text-sm font-medium text-gray-700 whitespace-nowrap px-2">
                        Select Student:
                    </label>
                    <select
                        id="student-select"
                        value={selectedStudentId}
                        onChange={handleStudentChange}
                        className="input-field border-none shadow-none focus:ring-0 min-w-[250px] bg-gray-50"
                    >
                        <option value="">-- Choose a student --</option>
                        {mappedStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name} ({student.rollNumber})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
                    {error}
                </div>
            ) : null}

            {!selectedStudentId ? (
                <div className="card text-center py-12 text-gray-500">
                    Please select a student from the dropdown above to view their performance analytics.
                </div>
            ) : loadingAnalytics ? (
                <div className="text-center py-12">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ) : analytics ? (
                <div className="space-y-8 fade-in">
                    {/* Student Overview Card */}
                    <div className="card bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl shadow-inner border border-white/30">
                                    👨‍🎓
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-1">{analytics.student?.name || 'Student'}</h3>
                                    <p className="opacity-90 font-medium tracking-wide">
                                        {analytics.student?.rollNumber} • {analytics.student?.department}
                                    </p>
                                    <p className="text-sm opacity-80 mt-1">
                                        {analytics.student?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium opacity-90 mb-1">Overall Performance Score</div>
                                <div className="text-5xl font-extrabold tracking-tight">
                                    {analytics.overallScore}<span className="text-2xl opacity-75">/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Academic Marks Summary */}
                        <div className="card bg-gradient-to-br from-cyan-500 to-blue-500 text-white transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-semibold opacity-90 uppercase tracking-wider mb-2">Academic Average</div>
                                    <div className="text-4xl font-bold">{analytics.academicPerformance?.average || 0}</div>
                                </div>
                                <div className="bg-white/20 p-3 rounded-xl">
                                    📚
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20 text-sm">
                                Based on {analytics.academicPerformance?.subjects?.length || 0} subjects
                            </div>
                        </div>

                        {/* Skills Summary */}
                        <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-semibold opacity-90 uppercase tracking-wider mb-2">P-Skills Completed</div>
                                    <div className="text-4xl font-bold">{analytics.skills?.totalCompleted || 0}</div>
                                </div>
                                <div className="bg-white/20 p-3 rounded-xl">
                                    🎯
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20 text-sm">
                                {analytics.skills?.skills?.filter(s => s.level === 'Advanced').length || 0} Advanced Skills
                            </div>
                        </div>

                        {/* Points Summary */}
                        <div className="card bg-gradient-to-br from-amber-500 to-orange-500 text-white transform hover:-translate-y-1 transition-transform duration-300">
                             <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-semibold opacity-90 uppercase tracking-wider mb-2">Total Points</div>
                                    <div className="text-4xl font-bold">
                                        {(analytics.activityRewardPoints?.activityPoints || 0) + (analytics.activityRewardPoints?.rewardPoints || 0)}
                                    </div>
                                </div>
                                <div className="bg-white/20 p-3 rounded-xl">
                                    ⭐
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20 text-sm flex justify-between">
                                <span>{analytics.activityRewardPoints?.activityPoints || 0} Activity</span>
                                <span>{analytics.activityRewardPoints?.rewardPoints || 0} Reward</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Detailed Academic Performance */}
                        <div className="card">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span>📊</span> Subject Performance
                            </h3>
                            
                            {analytics.academicPerformance?.subjects?.length > 0 ? (
                                <div className="space-y-6">
                                    {analytics.academicPerformance.subjects.map((subject, index) => {
                                        const percentage = (subject.marks / subject.maxMarks) * 100;
                                        return (
                                            <div key={index}>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="font-semibold text-gray-800">{subject.name}</span>
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {subject.marks} / {subject.maxMarks} ({percentage.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
                                                    <div
                                                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                                                            percentage >= 90 ? 'bg-green-500' :
                                                            percentage >= 75 ? 'bg-blue-500' :
                                                            percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-gray-500 italic py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">No academic data available for this student.</div>
                            )}
                        </div>

                        {/* Recent Activities & Skills */}
                        <div className="space-y-8">
                             {/* External Profiles */}
                             {analytics.externalProfiles && (
                                <div className="card">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span>🔗</span> External Profiles
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {analytics.externalProfiles.github ? (
                                            <a href={analytics.externalProfiles.github} target="_blank" rel="noopener noreferrer" 
                                               className="flex flex-col p-4 rounded-xl border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all group">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="font-semibold text-gray-900 group-hover:underline">GitHub</span>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-auto">Score: {analytics.externalProfiles.githubScore}/100</div>
                                            </a>
                                        ) : (
                                            <div className="flex flex-col p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60">
                                                <div className="font-semibold text-gray-700 mb-1">GitHub</div>
                                                <div className="text-xs text-gray-500">Not connected</div>
                                            </div>
                                        )}
                                        
                                        {analytics.externalProfiles.leetcode ? (
                                            <a href={analytics.externalProfiles.leetcode} target="_blank" rel="noopener noreferrer"
                                               className="flex flex-col p-4 rounded-xl border border-gray-200 hover:border-yellow-600 hover:shadow-md transition-all group">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-yellow-600 font-bold text-lg leading-none pt-1">L</div>
                                                    <span className="font-semibold text-gray-900 group-hover:underline">LeetCode</span>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-auto">Score: {analytics.externalProfiles.leetcodeScore}/100</div>
                                            </a>
                                        ) : (
                                            <div className="flex flex-col p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60">
                                                <div className="font-semibold text-gray-700 mb-1">LeetCode</div>
                                                <div className="text-xs text-gray-500">Not connected</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                             )}

                            {/* Skills List */}
                            <div className="card">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span>🛠️</span> Acquired Skills
                                </h3>
                                {analytics.skills?.skills?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {analytics.skills.skills.map((skill, index) => (
                                            <div key={index} 
                                                 className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                                    skill.level === 'Advanced' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    skill.level === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-green-50 text-green-700 border-green-200'
                                                 }`}
                                            >
                                                {skill.name}
                                                <span className="ml-2 opacity-60 text-xs">• {skill.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">No skills recorded.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

// Wrap in Suspense boundary for useSearchParams
export default function FacultyAnalyticsPage() {
    return (
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
            <FacultyAnalyticsContent />
        </Suspense>
    );
}
