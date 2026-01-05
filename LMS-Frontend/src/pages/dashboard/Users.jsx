import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Search, Shield, User, GraduationCap, Trash2, Mail, Plus, Edit2 } from 'lucide-react';
import { ROLES } from '../../lib/utils';

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Mock Data matching `users` table
  const [users, setUsers] = useState([
    { id: 1, name: 'System Admin', email: 'admin@lms.com', role: ROLES.ADMIN, created_at: '2025-12-26 06:08:30' },
    { id: 2, name: 'Prof. Snape', email: 'teacher@lms.com', role: ROLES.TEACHER, created_at: '2025-12-26 06:08:30' },
    { id: 3, name: 'Harry Potter', email: 'student@lms.com', role: ROLES.STUDENT, created_at: '2025-12-26 06:08:30' },
    { id: 4, name: 'Ron Weasley', email: 'ron@lms.com', role: ROLES.STUDENT, created_at: '2025-12-28 12:00:00' },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditMode(true);
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: parseInt(formData.get('role')),
    };

    if (isEditMode && editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        ...userData
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage system access and roles.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-9 bg-white" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-xs flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      user.role === ROLES.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      user.role === ROLES.TEACHER ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {user.role === ROLES.ADMIN && <Shield className="h-3 w-3" />}
                      {user.role === ROLES.TEACHER && <GraduationCap className="h-3 w-3" />}
                      {user.role === ROLES.STUDENT && <User className="h-3 w-3" />}
                      {user.role === ROLES.ADMIN ? 'Admin' : user.role === ROLES.TEACHER ? 'Teacher' : 'Student'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(user)}
                        className="text-gray-400 hover:text-primary-600 transition-colors p-2 hover:bg-primary-50 rounded-lg"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input name="name" defaultValue={editingUser?.name} required placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <Input name="email" type="email" defaultValue={editingUser?.email} required placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select 
              name="role" 
              defaultValue={editingUser?.role || ROLES.STUDENT}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <option value={ROLES.STUDENT}>Student</option>
              <option value={ROLES.TEACHER}>Teacher</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{isEditMode ? 'Save Changes' : 'Add User'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
