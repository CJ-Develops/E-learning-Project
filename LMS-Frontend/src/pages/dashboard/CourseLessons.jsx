import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { FileText, Video, Plus, Loader2, ArrowLeft, Upload, Edit2, Trash2 } from 'lucide-react';

const LessonIcon = ({ type }) => {
  const isLink = (type || '').toLowerCase() === 'link';
  return isLink ? (
    <Video className="h-5 w-5 text-blue-600" />
  ) : (
    <FileText className="h-5 w-5 text-amber-600" />
  );
};

export default function CourseLessons() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lessonType, setLessonType] = useState('link');
  const [editingLesson, setEditingLesson] = useState(null);
  const apiOrigin = new URL(api.defaults.baseURL).origin;

  const normalizeFileUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    return `${apiOrigin}${normalizedPath}`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
    setLessonType('link');
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      const data = Array.isArray(res.data) ? res.data : [];
      setLessons(data);
    } catch (err) {
      console.error('Failed to load lessons', err);
      alert('Failed to load lessons.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const form = new FormData(e.target);
    form.append('course_id', courseId);

    try {
      let res;
      if (editingLesson) {
        form.append('_method', 'PUT');
        res = await api.post(`/lessons/${editingLesson.id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setLessons(lessons.map(l => (l.id === editingLesson.id ? res.data.lesson : l)));
      } else {
        res = await api.post('/lessons', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setLessons([res.data.lesson, ...lessons]);
      }
      setIsModalOpen(false);
      e.target.reset();
      setEditingLesson(null);
      setLessonType('youtube');
    } catch (err) {
      console.error('Failed to save lesson', err);
      alert(err.response?.data?.message || 'Failed to save lesson.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      setLessons(lessons.filter(l => l.id !== lessonId));
    } catch (err) {
      console.error('Failed to delete lesson', err);
      alert('Failed to delete lesson.');
    }
  };

  const openEdit = (lesson) => {
    setEditingLesson(lesson);
    setLessonType(lesson?.type || 'youtube');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/courses" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Course Lessons</h1>
        </div>
        <Button
          onClick={() => {
            setEditingLesson(null);
            setLessonType('link');
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add Lesson
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm">
        {isLoading ? (
          <div className="p-6 flex items-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading lessons...
          </div>
        ) : lessons.length === 0 ? (
          <div className="p-6 text-gray-500">No lessons yet. Add your first lesson.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {lessons.map((lesson, idx) => {
              const safeType = (lesson?.type || 'unknown').toString().toUpperCase();
              const createdAt = lesson?.created_at ? new Date(lesson.created_at).toLocaleString() : 'Date unknown';
              const title = lesson?.title || 'Untitled lesson';
              const fileUrl = normalizeFileUrl(lesson?.file_url);

              return (
                <li key={lesson?.id ?? idx} className="flex items-center gap-4 p-4">
                  <LessonIcon type={lesson?.type} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">
                      {safeType} • Added {createdAt}
                    </p>
                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View file
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">No file</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(lesson)}
                      className="text-gray-400 hover:text-indigo-600"
                      title="Edit lesson"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete lesson"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Lesson"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Lesson Title</label>
            <Input
              name="title"
              required
              placeholder="e.g., Introduction to Databases"
              defaultValue={editingLesson?.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Lesson Instructions / Description</label>
            <textarea
              name="description"
              className="w-full border rounded p-2 text-sm"
              rows={3}
              placeholder="What should students focus on in this lesson?"
              defaultValue={editingLesson?.description}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Lesson Type</label>
            <select
              name="type"
              className="w-full border rounded p-2 text-sm"
              required
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value)}
            >
              <option value="link">Link</option>
              <option value="file">File</option>
            </select>
          </div>
          {lessonType === 'link' ? (
            <div>
              <label className="text-sm font-medium">Resource Link</label>
              <Input
                name="file_url"
                type="url"
                required={lessonType === 'link'}
                placeholder="Enter YouTube link, Google Drive link, or external URL..."
                defaultValue={editingLesson?.type === 'link' ? editingLesson?.file_url : ''}
              />
              <p className="text-xs text-gray-500 mt-1">Paste any valid resource URL.</p>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium">Upload File</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required={lessonType === 'file' && !editingLesson}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, Word, and Images.
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isSaving ? 'Saving...' : editingLesson ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
