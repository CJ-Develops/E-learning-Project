import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Search, Shield, User, GraduationCap, Trash2, Mail, Plus, Edit2 } from 'lucide-react';
import { ROLES } from '../../lib/utils';
import axios from 'axios';

// Ensure this matches your Laravel URL
const API_URL = "http://127.0.0.1:8000/api/users";

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users on start
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  // --- CONNECTING THE ADD/EDIT BUTTON TO DATABASE ---
  const handleSaveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Prepare data
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: parseInt(formData.get('role')),
    };

    // Include password only if creating a NEW user
    if (!isEditMode) {
        userData.password = formData.get('password');
    }

    try {
      if (isEditMode && editingUser) {
        // Update existing user (PUT)
        const response = await axios.put(`${API_URL}/${editingUser.id}`, userData);
        setUsers(users.map(u => u.id === editingUser.id ? response.data.user : u));
      } else {
        // Create new user (POST)
        const response = await axios.post(API_URL, userData);
        // Add the new user to the list immediately
        setUsers([response.data.user, ...users]); 
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save. check console for details.");
    }
  };
  // --------------------------------------------------

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error("Error deleting:", error);
      }
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                className="pl-9 bg-white" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? <div className="p-4">Loading...</div> : 
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80">
                  <td className="px-6 py-4">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-xs border ${
                      user.role === ROLES.ADMIN ? 'bg-purple-50 text-purple-700' :
                      user.role === ROLES.TEACHER ? 'bg-blue-50 text-blue-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {user.role === ROLES.ADMIN ? 'Admin' : user.role === ROLES.TEACHER ? 'Teacher' : 'Student'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(user)} className="text-gray-400 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          }
        </div>
      </div>

      {/* MODAL FORM */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input name="name" defaultValue={editingUser?.name} required placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input name="email" type="email" defaultValue={editingUser?.email} required placeholder="john@example.com" />
          </div>
          
          {/* PASSWORD FIELD - Only Visible when Adding New User */}
          {!isEditMode && (
             <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" required placeholder="******" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select name="role" defaultValue={editingUser?.role || ROLES.STUDENT} className="w-full border p-2 rounded">
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