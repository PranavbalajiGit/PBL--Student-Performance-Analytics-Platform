'use client';

import { useState } from 'react';
import { facultyAPI } from '@/lib/api';

export default function UploadPage() {
    const [activeTab, setActiveTab] = useState('marks');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const tabs = [
        { id: 'marks', label: 'Internal Marks', icon: '📝' },
        { id: 'pskills', label: 'P-Skills', icon: '🎯' },
        { id: 'points', label: 'Activity/Reward Points', icon: '⭐' },
    ];

    const expectedFormats = {
        marks: {
            columns: ['Student ID', 'Subject', 'Marks', 'Max Marks'],
            example: 'student1, Data Structures, 85, 100',
        },
        pskills: {
            columns: ['Student ID', 'Skill Name', 'Level', 'Completion Date'],
            example: 'student1, Python Programming, Advanced, 2024-01-15',
        },
        points: {
            columns: ['Student ID', 'Type', 'Description', 'Points', 'Date'],
            example: 'student1, Activity, Tech Fest Participation, 50, 2024-01-20',
        },
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage({ type: '', text: '' });
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Please select a file first' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            let response;
            if (activeTab === 'marks') {
                response = await facultyAPI.uploadMarks(file);
            } else if (activeTab === 'pskills') {
                response = await facultyAPI.uploadPSkills(file);
            } else {
                response = await facultyAPI.uploadPoints(file);
            }

            setMessage({
                type: 'success',
                text: response.data.message + ` (${response.data.recordsProcessed} records)`,
            });
            setFile(null);
            // Reset file input
            const fileInput = document.getElementById('file-input');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Upload failed',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Upload Student Data
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setMessage({ type: '', text: '' });
                            setFile(null);
                        }}
                        className={`px-6 py-3 font-medium border-b-2 transition-colors duration-200 ${activeTab === tab.id
                                ? 'border-secondary-600 text-secondary-700'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Form */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Upload Excel File
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

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Excel File (.xlsx or .xls)
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100"
                            />
                        </div>

                        {file && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Selected:</span> {file.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Size: {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Upload & Validate'}
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <span className="text-yellow-600 text-xl">⚠️</span>
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-1">Validation Rules:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Excel file must have the exact column structure shown</li>
                                    <li>All students in the file must be assigned to you</li>
                                    <li>If validation fails, the entire upload will be rejected</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expected Format */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Expected Format
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Required Columns (in exact order):
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {expectedFormats[activeTab].columns.map((col, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-lg bg-secondary-100 text-secondary-700 text-sm font-medium"
                                    >
                                        {col}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Example Row:
                            </p>
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <code className="text-sm text-gray-800">
                                    {expectedFormats[activeTab].example}
                                </code>
                            </div>
                        </div>

                        {activeTab === 'pskills' && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Valid Skill Levels:
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                                        Beginner
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                                        Intermediate
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                                        Advanced
                                    </span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'points' && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Valid Types:
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                                        Activity
                                    </span>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm">
                                        Reward
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-blue-600 text-xl">💡</span>
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Download Template:</p>
                                    <p className="mb-2">
                                        Will be enhanced in future versions to provide downloadable Excel templates
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
