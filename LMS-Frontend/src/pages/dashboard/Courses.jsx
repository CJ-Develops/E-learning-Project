import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Plus, Clock, Search, Trash2, Edit2, BookOpen, Calendar } from 'lucide-react';
import { ROLES } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function Courses() {
  const user = JSON.parse(localStorage.getItem('user')) || { role: ROLES.STUDENT };
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  // Initial Mock Data matching `courses` table schema
  const [courses, setCourses] = useState([
    { 
      id: 7, 
      instructor_id: 2, 
      title: 'Advanced PHP & MySQL', 
      description: 'Deep dive into PHP concepts and server-side scripting.', 
      thumbnail: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97663?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 
      created_at: '2025-12-28 10:00:00',
      deadline: '2026-03-15',
      instructor_name: 'Prof. Snape'
    },
    { 
      id: 8, 
      instructor_id: 2, 
      title: 'Database Design 101', 
      description: 'Learn SQL, Normalization and ERD diagrams.', 
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=60', 
      created_at: '2025-12-29 08:30:00',
      deadline: '2026-04-01',
      instructor_name: 'Prof. Snape'
    },
    { 
      id: 9, 
      instructor_id: 2, 
      title: 'TEST', 
      description: 'Introduction to Testing Methodologies', 
      thumbnail: null, 
      created_at: '2025-12-27 22:46:22',
      deadline: '2026-02-20',
      instructor_name: 'Prof. Snape'
    }
  ]);

  // Filter logic
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentCourse({ title: '', description: '', thumbnail: '', deadline: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setIsEditMode(true);
    setCurrentCourse({ ...course });
    setIsModalOpen(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCourseData = {
      title: formData.get('title'),
      description: formData.get('description'),
      thumbnail: formData.get('thumbnail') || null,
      deadline: formData.get('deadline'),
    };

    if (isEditMode) {
      setCourses(courses.map(c => c.id === currentCourse.id ? { ...c, ...newCourseData } : c));
    } else {
      const newId = Math.max(...courses.map(c => c.id), 0) + 1;
      setCourses([...courses, {
        id: newId,
        instructor_id: user.id || 2,
        instructor_name: user.name || 'Instructor',
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        ...newCourseData
      }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === ROLES.STUDENT ? 'My Learning' : 'Course Management'}
          </h1>
          <p className="text-gray-500">
            {user.role === ROLES.STUDENT ? 'Continue where you left off' : 'Manage your course content and curriculum'}
          </p>
        </div>
        {user.role !== ROLES.STUDENT && (
          <Button className="gap-2 shadow-md hover:shadow-lg transition-all" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" /> Create Course
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search courses..." 
          className="pl-10 bg-white shadow-sm border-gray-200 focus:border-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-primary-50 text-primary-800">
                    <BookOpen className="h-12 w-12 mb-2 opacity-50" />
                    <span className="font-bold text-xl">{course.title.substring(0, 2).toUpperCase()}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-gray-600 shadow-sm">
                  ID: {course.id}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4 flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                </div>

                {/* Show Deadline for Teachers */}
                {user.role !== ROLES.STUDENT && course.deadline && (
                  <div className="mb-4 flex items-center gap-2 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit">
                    <Calendar className="h-3 w-3" />
                    Deadline: {course.deadline}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 mt-auto">
                  {user.role === ROLES.STUDENT ? (
                    <Link to={`/dashboard/courses/${course.id}/learn`} className="block">
                      <Button className="w-full gap-2 group-hover:bg-primary-700">
                        Continue Learning
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.created_at.split(' ')[0]}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenEdit(course)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <BookOpen className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search or create a new course.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Course" : "Create New Course"}
      >
        <form id="courseForm" onSubmit={handleSaveCourse} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Course Title</label>
            <Input name="title" defaultValue={currentCourse?.title} required placeholder="e.g., Advanced React Patterns" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea 
              name="description" 
              defaultValue={currentCourse?.description}
              required 
              className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              placeholder="Brief overview of the course content..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Thumbnail URL (Optional)</label>
              <Input name="thumbnail" defaultValue={currentCourse?.thumbnail} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Submission Deadline</label>
              <Input 
                name="deadline" 
                type="date" 
                defaultValue={currentCourse?.deadline} 
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Course'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
