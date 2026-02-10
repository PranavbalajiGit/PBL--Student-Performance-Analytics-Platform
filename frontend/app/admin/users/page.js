'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'student',
        name: '',
        email: '',
        department: '',
        rollNumber: '',
        semester: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getUsers();
            setUsers(response.data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await adminAPI.registerUser(formData);
            setMessage({ type: 'success', text: 'User registered successfully!' });
            setFormData({
                username: '',
                password: '',
                role: 'student',
                name: '',
                email: '',
                department: '',
                rollNumber: '',
                semester: '',
            });
            fetchUsers();
            setTimeout(() => setShowForm(false), 1500);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to register user',
            });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : '+ Register New User'}
                </button>
            </div>

            {/* Registration Form */}
            {showForm && (
                <div className="card mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Register New User
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role *
                                </label>
                                <select
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department *
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    required
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            {formData.role === 'student' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Roll Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            required
                                            value={formData.rollNumber}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Semester *
                                        </label>
                                        <input
                                            type="number"
                                            name="semester"
                                            required
                                            min="1"
                                            max="8"
                                            value={formData.semester}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <button type="submit" className="btn-primary">
                            Register User
                        </button>
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    All Users ({users.length})
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Username</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{user.name}</td>
                                    <td className="py-3 px-4">{user.username}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin'
                                                    ? 'bg-red-100 text-red-700'
                                                    : user.role === 'faculty'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">{user.department || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
