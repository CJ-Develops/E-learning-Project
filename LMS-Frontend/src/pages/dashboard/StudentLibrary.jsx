import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { BookOpen, Users } from 'lucide-react';

const fallbackImage =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80';

export default function StudentLibrary() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/student/courses');
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCourse = (courseId) => {
    navigate(`/dashboard/student/courses/${courseId}`);
  };

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading course library...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Library</h1>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600">
            You have not been enrolled in any courses yet. Please contact the administrator.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="h-40 bg-gray-100 overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <BookOpen className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{course.title}</h3>
                  {course.teacher_name && (
                    <p className="text-sm text-gray-500">Instructor: {course.teacher_name}</p>
                  )}
                  {course.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {course.lessons_count || 0} Lessons
                    </span>
                    {Number(course.progress) > 0 && (
                      <span className="font-semibold text-[#A51C30]">{course.progress}</span>
                    )}
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#A51C30] rounded-full transition-all"
                      style={{ width: `${Math.min(course.progress ?? 0, 100)}%` }}
                    />
                  </div>
                </div>

                <Button onClick={() => handleOpenCourse(course.id)} className="w-full mt-auto">
                  Continue Learning
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
