'use client';

import { useEffect, useState } from 'react';
import { facultyAPI } from '@/lib/api';

export default function FacultyDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await facultyAPI.getStudents();
            setStudents(response.data.students);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                My Assigned Students
            </h2>

            {students.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Students Assigned
                    </h3>
                    <p className="text-gray-600">
                        Contact an administrator to assign students to you.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {students.slice(0, 3).map((student) => (
                            <div key={student.id} className="card hover:shadow-premium transition-shadow duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-2xl">
                                        👨‍🎓
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        Active
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {student.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">{student.rollNumber}</p>
                                <p className="text-sm text-gray-600">{student.department}</p>
                            </div>
                        ))}
                    </div>

                    <div className="card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            All Students ({students.length})
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Roll Number</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{student.name}</td>
                                            <td className="py-3 px-4">{student.rollNumber}</td>
                                            <td className="py-3 px-4">{student.department}</td>
                                            <td className="py-3 px-4">{student.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
