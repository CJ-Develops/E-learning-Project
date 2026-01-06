import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Plus, Search, Trash2, Edit2, BookOpen, Users, Settings } from 'lucide-react';
import api from '../../lib/apiClient';
import { Link } from 'react-router-dom';
import { ROLES } from '../../lib/utils';

const API_URL = "/courses";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedCourseStudents, setSelectedCourseStudents] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = Number(user.role) === ROLES.ADMIN;
  const isTeacher = Number(user.role) === ROLES.TEACHER;

  // 1. Load Data from DB
  useEffect(() => {
    fetchCourses();
    if (isAdmin) fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get(API_URL);
      setCourses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setIsLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/users');
      const onlyTeachers = (res.data || []).filter((u) => Number(u.role) === ROLES.TEACHER);
      setTeachers(onlyTeachers);
    } catch (err) {
      console.error('Failed to load teachers', err);
    }
  };

  // 2. Save Data (Create or Update)
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setIsSaving(true);
    const formData = new FormData(e.target);
    const courseData = {
      title: formData.get('title'),
      thumbnail_url: formData.get('thumbnail'),
      description: formData.get('description'),
      teachers: selectedTeacherIds.map((id) => Number(id)),
    };

    try {
      if (isEditMode && currentCourse) {
        const res = await api.put(`${API_URL}/${currentCourse.id}`, courseData);
        setCourses(courses.map(c => c.id === currentCourse.id ? res.data.course : c));
      } else {
        const res = await api.post(API_URL, courseData);
        setCourses([res.data.course, ...courses]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert(error.response?.data?.message || "Failed to save course.");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Delete Data
  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`${API_URL}/${id}`);
        setCourses(courses.filter(c => c.id !== id));
      } catch (error) {
        alert("Failed to delete course.");
      }
    }
  };

  const openAdd = () => {
    setIsEditMode(false);
    setCurrentCourse(null);
    setSelectedTeacherIds([]);
    setIsModalOpen(true);
  };
  const openEdit = (course) => {
    setIsEditMode(true);
    setCurrentCourse(course);
    setSelectedTeacherIds(course.teachers?.map((teacher) => String(teacher.id)) || []);
    setIsModalOpen(true);
  };

  const openStudentsModal = async (course) => {
    setIsStudentsModalOpen(true);
    setSelectedCourseName(course.title);
    setStudentsLoading(true);
    try {
      const res = await api.get(`/courses/${course.id}/students`);
      setSelectedCourseStudents(res.data || []);
    } catch (error) {
      console.error('Failed to load students', error);
      alert('Failed to load students.');
    } finally {
      setStudentsLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courses</h1>
        {isAdmin && (
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4"/> New Course</Button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {isLoading ? <p>Loading...</p> : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-100 relative">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><BookOpen className="h-12 w-12"/></div>
                )}
              </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex justify-between pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => openStudentsModal(course)}
                      className="text-xs text-gray-500 flex items-center gap-1 hover:text-[#A51C30]"
                    >
                      <Users className="h-3 w-3"/> Students
                    </button>
                    <div className="flex gap-2">
                      {isTeacher && (
                        <Link
                          to={`/dashboard/courses/${course.id}/lessons`}
                          className="text-gray-500 hover:text-indigo-600"
                          title="Manage lessons"
                        >
                          <Settings className="h-4 w-4" />
                        </Link>
                      )}
                      {isAdmin && (
                        <>
                          <button onClick={() => openEdit(course)} className="text-blue-600" title="Edit course"><Edit2 className="h-4 w-4"/></button>
                          <button onClick={() => handleDelete(course.id)} className="text-red-600" title="Delete course"><Trash2 className="h-4 w-4"/></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Course" : "New Course"}>
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input name="title" defaultValue={currentCourse?.title} required />
          </div>
          <div>
            <label className="text-sm font-medium">Thumbnail URL</label>
            <Input name="thumbnail" defaultValue={currentCourse?.thumbnail_url} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" defaultValue={currentCourse?.description} className="w-full border rounded p-2 text-sm" rows={4} />
          </div>
          <div>
            <label className="text-sm font-medium">Assign Teachers</label>
            <div className="mt-2 space-y-3">
              <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-2 min-h-[44px]">
                {selectedTeacherIds.length === 0 && (
                  <span className="text-sm text-gray-400 px-2 py-1">No teachers selected</span>
                )}
                {selectedTeacherIds.map((id) => {
                  const teacher = teachers.find((t) => String(t.id) === String(id));
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-2 rounded-full bg-[#A51C30]/10 text-[#A51C30] px-3 py-1 text-xs font-semibold"
                    >
                      {teacher?.name || 'Unknown'}
                      <button
                        type="button"
                        onClick={() => setSelectedTeacherIds((prev) => prev.filter((tid) => tid !== id))}
                        className="text-[#A51C30]/70 hover:text-[#A51C30]"
                        aria-label={`Remove ${teacher?.name || 'teacher'}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
              <select
                value=""
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) return;
                  if (!selectedTeacherIds.includes(value)) {
                    setSelectedTeacherIds((prev) => [...prev, value]);
                  }
                }}
                className="w-full border rounded p-2 text-sm bg-white"
              >
                <option value="">Add a teacher...</option>
                {teachers
                  .filter((t) => !selectedTeacherIds.includes(String(t.id)))
                  .map((t) => (
                    <option key={t.id} value={String(t.id)}>{t.name}</option>
                  ))}
              </select>
              <input type="hidden" name="teachers" value={selectedTeacherIds.join(',')} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
      )}

      <Modal
        isOpen={isStudentsModalOpen}
        onClose={() => setIsStudentsModalOpen(false)}
        title={`Enrolled Students${selectedCourseName ? ` - ${selectedCourseName}` : ''}`}
      >
        {studentsLoading ? (
          <div className="p-4 text-sm text-gray-500">Loading students...</div>
        ) : selectedCourseStudents.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No students enrolled.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {selectedCourseStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-3 py-3">
                <div className="h-10 w-10 rounded-full bg-[#A51C30]/10 text-[#A51C30] flex items-center justify-center font-bold">
                  {student.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
