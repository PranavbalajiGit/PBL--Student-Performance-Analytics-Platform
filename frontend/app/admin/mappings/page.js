'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

export default function MappingsPage() {
    const [faculty, setFaculty] = useState([]);
    const [students, setStudents] = useState([]);
    const [mappings, setMappings] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [facultyRes, studentsRes, mappingsRes] = await Promise.all([
                adminAPI.getUsers('faculty'),
                adminAPI.getUsers('student'),
                adminAPI.getMappings(),
            ]);
            setFaculty(facultyRes.data.users);
            setStudents(studentsRes.data.users);
            setMappings(mappingsRes.data.mappings);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!selectedFaculty) {
            setMessage({ type: 'error', text: 'Please select a faculty member' });
            return;
        }

        if (selectedStudents.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one student' });
            return;
        }

        try {
            await adminAPI.createMapping(selectedFaculty, selectedStudents);
            setMessage({ type: 'success', text: 'Faculty-student mapping created successfully!' });
            setSelectedFaculty('');
            setSelectedStudents([]);
            fetchData();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to create mapping',
            });
        }
    };

    const toggleStudent = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Faculty-Student Mappings
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Mapping Form */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Create/Update Mapping
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Faculty *
                            </label>
                            <select
                                value={selectedFaculty}
                                onChange={(e) => setSelectedFaculty(e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">-- Choose Faculty --</option>
                                {faculty.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name} ({f.department})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Students * ({selectedStudents.length} selected)
                            </label>
                            <div className="border border-gray-300 rounded-lg p-4 max-h-80 overflow-y-auto">
                                {students.map((student) => (
                                    <label
                                        key={student.id}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => toggleStudent(student.id)}
                                            className="w-4 h-4 text-primary-600 rounded"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{student.name}</div>
                                            <div className="text-sm text-gray-600">
                                                {student.rollNumber} • {student.department}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            Save Mapping
                        </button>
                    </form>
                </div>

                {/* Current Mappings */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Current Mappings ({mappings.length})
                    </h3>

                    <div className="space-y-4">
                        {mappings.map((mapping, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="font-semibold text-primary-700 mb-2">
                                    👨‍🏫 {mapping.faculty.name}
                                </div>
                                <div className="text-sm text-gray-600 mb-3">
                                    {mapping.faculty.department}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-700">
                                        Assigned Students ({mapping.students.length}):
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {mapping.students.map((student) => (
                                            <span
                                                key={student.id}
                                                className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm"
                                            >
                                                {student.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
