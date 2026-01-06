import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ManageAssignments() {
  const location = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    points_possible: 100,
    course_id: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
    // Re-fetch when navigating back to this tab so the list never shows stale data
  }, [location.key]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data || []);
      if (!form.course_id && res.data?.length) {
        setForm((f) => ({ ...f, course_id: res.data[0].id }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load courses');
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/teacher/assignments');
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load assignments');
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm({
      title: '',
      description: '',
      due_date: '',
      points_possible: 100,
      course_id: courses[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (assignment) => {
    setEditing(assignment);
    setForm({
      title: assignment.title || '',
      description: assignment.description || '',
      due_date: assignment.due_date ? assignment.due_date.slice(0, 16) : '',
      points_possible: assignment.points_possible || 100,
      course_id: assignment.course?.id || assignment.course_id || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/assignments/${editing.id}`, form);
        const updatedCourse = courses.find((c) => c.id === Number(form.course_id)) || editing.course;
        const updated = { ...res.data.assignment, course: updatedCourse };
        setAssignments(assignments.map((a) => (a.id === editing.id ? updated : a)));
      } else {
        const res = await api.post(`/courses/${form.course_id}/assignments`, form);
        const course = courses.find((c) => c.id === Number(form.course_id));
        setAssignments([{ ...res.data.assignment, course }, ...assignments]);
      }
      // Always refresh from server to stay in sync
      fetchAssignments();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (assignment) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await api.delete(`/assignments/${assignment.id}`);
      setAssignments(assignments.filter((a) => a.id !== assignment.id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Assignments</h1>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> New Assignment
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm">
        {assignments.length === 0 ? (
          <div className="p-4 text-gray-500">No assignments yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {assignments.map((a) => (
              <li key={a.id} className="p-4 flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{a.title}</p>
                    <span className="text-xs text-gray-500 border rounded px-2 py-0.5">
                      {a.course?.title || 'Course'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {a.due_date ? new Date(a.due_date).toLocaleString() : '—'} • Points: {a.points_possible}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-indigo-600">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(a)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Edit Assignment' : 'New Assignment'}
      >
        <form onSubmit={handleSave} className="space-y-3">
          <Input
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Title"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Description"
          />
          <Input
            type="datetime-local"
            name="due_date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
          <Input
            type="number"
            name="points_possible"
            min="1"
            max="100"
            value={form.points_possible}
            onChange={(e) => {
              const val = Math.min(100, Number(e.target.value) || 0);
              setForm({ ...form, points_possible: val });
            }}
          />
          <select
            name="course_id"
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            className="w-full border rounded p-2 text-sm"
            required
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
