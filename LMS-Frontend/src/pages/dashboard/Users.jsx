import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Shield, User, GraduationCap, Trash2, Mail, Plus } from 'lucide-react';
import { ROLES } from '../../lib/utils';
import api from '../../lib/apiClient';

const API_URL = "/users";

export default function UsersList() {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [enrollments, setEnrollments] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get(API_URL);
      const userData = response.data || [];
      setUsers(userData);
      const map = {};
      userData.forEach((u) => {
        if (Array.isArray(u.courses)) {
          map[u.id] = u.courses.map((c) => c.id);
        }
      });
      setEnrollments(map);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: parseInt(formData.get('role')),
    };

    if (!isEditMode) {
      userData.password = formData.get('password');
    }

    try {
      if (isEditMode && editingUser) {
        const response = await api.put(`${API_URL}/${editingUser.id}`, userData);
        setUsers(users.map((u) => (u.id === editingUser.id ? response.data.user : u)));
      } else {
        const response = await api.post(API_URL, userData);
        setUsers([response.data.user, ...users]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save. check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`${API_URL}/${id}`);
        setUsers(users.filter((u) => u.id !== id));
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

  const filteredUsers = users.filter((user) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'student') return user.role === ROLES.STUDENT;
    if (activeTab === 'teacher') return user.role === ROLES.TEACHER;
    if (activeTab === 'admin') return user.role === ROLES.ADMIN;
    return true;
  });

  const handleEnroll = async (userId, courseId) => {
    if (!courseId) return;
    try {
      await api.post('/admin/enroll', { user_id: userId, course_id: courseId });
      const course = courses.find((c) => String(c.id) === String(courseId));
      alert(`User enrolled in ${course?.title || 'course'}`);
      setEnrollments((prev) => {
        const existing = new Set(prev[userId] || []);
        existing.add(Number(courseId));
        return { ...prev, [userId]: Array.from(existing) };
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll user.');
    } finally {
      setSelectedCourse((prev) => ({ ...prev, [userId]: '' }));
    }
  };

  const handleDropCourse = async (userId, courseId) => {
    if (!courseId) return;
    try {
      await api.post('/admin/drop-course', { user_id: userId, course_id: courseId });
      const course = courses.find((c) => String(c.id) === String(courseId));
      alert(`User dropped from ${course?.title || 'course'}`);
      setEnrollments((prev) => {
        const updated = new Set(prev[userId] || []);
        updated.delete(Number(courseId));
        return { ...prev, [userId]: Array.from(updated) };
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to drop course.');
    }
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
        <div className="p-4 border-b bg-gray-50/50 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Users' },
            { key: 'student', label: 'Students' },
            { key: 'teacher', label: 'Teachers' },
            { key: 'admin', label: 'Admins' },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  isActive
                    ? 'bg-[#A51C30] text-white border-[#A51C30] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#A51C30]/40 hover:text-[#A51C30]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <table className="w-full text-sm text-left table-fixed">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                  <th className="px-4 py-3" style={{ width: '12%' }}>Role</th>
                  <th className="px-4 py-3" style={{ width: activeTab === 'admin' ? '78%' : activeTab === 'teacher' ? '38%' : '20%' }}>User</th>
                  {activeTab === 'teacher' && <th className="px-4 py-3" style={{ width: '40%' }}>Assigned Courses</th>}
                  {(activeTab === 'student' || activeTab === 'all') && (
                    <>
                      <th className="px-4 py-3" style={{ width: '22%' }}>Enroll Course</th>
                      <th className="px-4 py-3" style={{ width: '22%' }}>Drop Course</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-right" style={{ width: '8%' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const isStudent = user.role === ROLES.STUDENT;
                  const isTeacher = user.role === ROLES.TEACHER;
                  const isAdmin = user.role === ROLES.ADMIN;

                  const enrolledForUser = enrollments[user.id] || [];
                  const availableCourses = courses.filter((course) => !enrolledForUser.includes(course.id));
                  const enrolledCourses = courses.filter((course) => enrolledForUser.includes(course.id));

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/80 align-top">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-xs border ${
                          isAdmin ? 'bg-purple-50 text-purple-700' :
                          isTeacher ? 'bg-blue-50 text-blue-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {isAdmin ? 'Admin' : isTeacher ? 'Teacher' : 'Student'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </td>

                      {activeTab === 'teacher' && (
                        <td className="px-4 py-3">
                          {Array.isArray(user.teaching_courses) && user.teaching_courses.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {user.teaching_courses.map((course) => (
                                <span key={course.id} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200">
                                  {course.title}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No assigned courses</span>
                          )}
                        </td>
                      )}

                      {(activeTab === 'student' || activeTab === 'all') && (
                        <>
                          <td className="px-4 py-3">
                            {isStudent ? (
                              <select
                                className="w-full border rounded p-2 text-sm bg-white"
                                value={selectedCourse[user.id] || ''}
                                onChange={(e) => {
                                  const courseId = e.target.value;
                                  setSelectedCourse((prev) => ({ ...prev, [user.id]: courseId }));
                                  if (courseId) handleEnroll(user.id, courseId);
                                }}
                                disabled={availableCourses.length === 0}
                              >
                                <option value="">{availableCourses.length ? 'Select Course to Enroll...' : 'No courses available'}</option>
                                {availableCourses.map((course) => (
                                  <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-400 text-sm">�</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isStudent ? (
                              <select
                                className="w-full border rounded p-2 text-sm bg-white"
                                value=""
                                onChange={(e) => {
                                  const courseId = e.target.value;
                                  if (courseId) handleDropCourse(user.id, courseId);
                                }}
                                disabled={enrolledCourses.length === 0}
                              >
                                <option value="">{enrolledCourses.length ? 'Select Course to Drop...' : 'No active courses'}</option>
                                {enrolledCourses.map((course) => (
                                  <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-400 text-sm">�</span>
                            )}
                          </td>
                        </>
                      )}

                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
          {!isEditMode && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input name="password" type="password" required placeholder="******" />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              defaultValue={editingUser?.role || ROLES.STUDENT}
              className="w-full border p-2 rounded"
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


