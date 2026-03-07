'use client';

import { useEffect, useState } from 'react';
import { facultyAPI } from '@/lib/api';
import Link from 'next/link';

export default function FacultyStudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await facultyAPI.getStudents();
            setStudents(response.data.students);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch mapped students:', err);
            setError('Failed to load students mapping.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading mapped students...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Your Students
            </h2>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Mapped Students ({students.length})
                    </h3>
                </div>

                {students.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        You have no students mapped yet. Contact an administrator to assign students to you.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Roll Number</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{student.rollNumber}</td>
                                        <td className="py-3 px-4">{student.name}</td>
                                        <td className="py-3 px-4">{student.department || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                                        <td className="py-3 px-4">
                                            <Link 
                                                href={`/faculty/analytics?studentId=${student.id}`}
                                                className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
                                            >
                                                View Analytics
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
