'use client';

import { useEffect, useState } from 'react';
import { studentAPI } from '@/lib/api';

export default function ProfilesPage() {
    const [profiles, setProfiles] = useState({ github: '', leetcode: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [existingProfiles, setExistingProfiles] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const response = await studentAPI.getProfiles();
            if (response.data.profiles) {
                setExistingProfiles(response.data.profiles);
                setProfiles({
                    github: response.data.profiles.github || '',
                    leetcode: response.data.profiles.leetcode || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch profiles:', error);
        }
    };

    const handleChange = (e) => {
        setProfiles({
            ...profiles,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await studentAPI.connectProfiles(profiles.github, profiles.leetcode);
            setMessage({
                type: 'success',
                text: 'External profiles connected successfully!',
            });
            fetchProfiles();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to connect profiles',
            });
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Connect External Profiles
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Link Your Technical Profiles
                    </h3>

                    {message.text && (
                        <div
                            className={`mb-4 p-4 rounded-lg ${message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552  3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub Profile URL
                            </label>
                            <input
                                type="url"
                                name="github"
                                value={profiles.github}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <span className="text-orange-600 text-xl">💻</span>
                                LeetCode Profile URL
                            </label>
                            <input
                                type="url"
                                name="leetcode"
                                value={profiles.leetcode}
                                onChange={handleChange}
                                placeholder="https://leetcode.com/username"
                                className="input-field"
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            Save Profiles
                        </button>
                    </form>
                </div>

                {/* Info & Connected Profiles */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Why Connect?
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 text-xl">✓</span>
                                <span>Boost your overall performance score</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 text-xl">✓</span>
                                <span>Showcase your coding skills and contributions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 text-xl">✓</span>
                                <span>Get recognized for technical excellence</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 text-xl">✓</span>
                                <span>Stand out in rankings and analytics</span>
                            </li>
                        </ul>
                    </div>

                    {existingProfiles && (existingProfiles.github || existingProfiles.leetcode) && (
                        <div className="card bg-green-50 border border-green-200">
                            <h3 className="text-lg font-semibold text-green-900 mb-4">
                                🔗 Connected Profiles
                            </h3>
                            <div className="space-y-3">
                                {existingProfiles.github && (
                                    <a
                                        href={existingProfiles.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">GitHub</div>
                                            <div className="text-xs text-gray-600 truncate">{existingProfiles.github}</div>
                                        </div>
                                        <span className="text-green-600">→</span>
                                    </a>
                                )}

                                {existingProfiles.leetcode && (
                                    <a
                                        href={existingProfiles.leetcode}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200"
                                    >
                                        <span className="text-3xl">💻</span>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">LeetCode</div>
                                            <div className="text-xs text-gray-600 truncate">{existingProfiles.leetcode}</div>
                                        </div>
                                        <span className="text-green-600">→</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="card bg-blue-50 border border-blue-200">
                        <div className="flex items-start gap-3">
                            <span className="text-blue-600 text-xl">ℹ️</span>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Future Enhancement:</p>
                                <p>
                                    Automatic score calculation from your GitHub contributions and LeetCode problem-solving
                                    stats will be added in future versions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
