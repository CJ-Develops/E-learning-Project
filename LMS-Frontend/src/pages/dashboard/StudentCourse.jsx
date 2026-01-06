import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, FileText, Video } from 'lucide-react';

export default function StudentCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const apiOrigin = new URL(api.defaults.baseURL).origin;

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/student/courses/${courseId}`);
      setCourse(res.data);
      if (res.data.lessons?.length) {
        setActiveLesson(res.data.lessons[0]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load course');
    }
  };

  const normalizeFileUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    return `${apiOrigin}${normalizedPath}`;
  };

  const getYouTubeId = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com')) {
        return u.searchParams.get('v') || '';
      }
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.replace('/', '');
      }
    } catch {
      return '';
    }
    return '';
  };

  const isYouTubeUrl = (url) => Boolean(getYouTubeId(url));

  const getFileExtension = (url) => {
    if (!url) return '';
    const cleaned = url.split('?')[0].split('#')[0];
    const parts = cleaned.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  const renderLessonContent = () => {
    if (!activeLesson) return <div className="text-gray-500">Select a lesson</div>;
    const fileUrl = normalizeFileUrl(activeLesson.file_url);
    if (activeLesson.type === 'youtube') {
      return (
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.file_url)}`}
            title={activeLesson.title}
            allowFullScreen
          />
        </div>
      );
    }
    if (activeLesson.type === 'link') {
      if (isYouTubeUrl(activeLesson.file_url)) {
        return (
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.file_url)}`}
              title={activeLesson.title}
              allowFullScreen
            />
          </div>
        );
      }
      return (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">External Resource</p>
            <h3 className="text-lg font-semibold text-gray-900">{activeLesson.title}</h3>
            {activeLesson.description && (
              <p className="text-sm text-gray-600 mt-1">{activeLesson.description}</p>
            )}
          </div>
          <Button asChild>
            <a href={fileUrl} target="_blank" rel="noreferrer">
              Open Resource
            </a>
          </Button>
        </div>
      );
    }
    if (activeLesson.type === 'file') {
      const extension = getFileExtension(activeLesson.file_url);
      if (extension === 'pdf') {
        return (
          <div className="space-y-3">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full rounded-lg border"
                src={fileUrl}
                title={activeLesson.title}
              />
            </div>
            <Button asChild>
              <a href={fileUrl} target="_blank" rel="noreferrer">
                Download File
              </a>
            </Button>
          </div>
        );
      }
      return (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">File Download</p>
              <h3 className="text-lg font-semibold text-gray-900">{activeLesson.title}</h3>
            </div>
          </div>
          <Button asChild>
            <a href={fileUrl} target="_blank" rel="noreferrer">
              Download File
            </a>
          </Button>
        </div>
      );
    }
    return <div className="text-gray-500">Unsupported content</div>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/student/library')}
          className="flex items-center gap-2 text-gray-700 hover:text-[#A51C30]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course Library
        </Button>
        {course?.title && <span className="text-sm text-gray-500">Currently viewing: {course.title}</span>}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl shadow-sm p-4 space-y-2">
          <h2 className="text-lg font-semibold">Lessons</h2>
          <div className="divide-y divide-gray-100">
            {course?.lessons?.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left py-3 px-3 rounded-lg transition ${
                  activeLesson?.id === lesson.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {lesson.type === 'youtube' || (lesson.type === 'link' && isYouTubeUrl(lesson.file_url)) ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-xs text-gray-500">{lesson.type}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border rounded-xl shadow-sm p-4 space-y-3">
            <h2 className="text-lg font-semibold">{activeLesson?.title || 'Lesson Content'}</h2>
            {renderLessonContent()}
            {activeLesson?.description && (
              <p className="text-sm text-gray-700">{activeLesson.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
