import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { PlayCircle, CheckCircle, Lock, FileText, ArrowLeft, ChevronRight, Download } from 'lucide-react';

export default function CoursePlayer() {
  const { courseId } = useParams();
  
  // Initial Mock Data (Moved to state to allow updates)
  const [course, setCourse] = useState({
    id: courseId,
    title: "Advanced PHP & MySQL",
    description: "Master backend development with PHP and build robust database-driven applications.",
    modules: [
      {
        id: 1,
        title: "Introduction to PHP",
        lessons: [
          { id: 101, title: "Setting up the Environment", duration: "10:00", completed: true, locked: false },
          { id: 102, title: "Variables and Data Types", duration: "15:30", completed: true, locked: false },
          { id: 103, title: "Control Structures", duration: "20:15", completed: false, locked: false },
        ]
      },
      {
        id: 2,
        title: "Working with MySQL",
        lessons: [
          { id: 201, title: "Database Connection", duration: "12:45", completed: false, locked: false },
          { id: 202, title: "CRUD Operations", duration: "25:00", completed: false, locked: false }, // Unlocked all for demo
        ]
      }
    ]
  });

  const [activeLessonId, setActiveLessonId] = useState(103);

  // Calculate Progress
  const calculateProgress = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (l.completed) completedLessons++;
      });
    });
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const progress = calculateProgress();

  // Find current lesson details
  const getCurrentLesson = () => {
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === activeLessonId);
      if (lesson) return { lesson, module };
    }
    // Fallback
    return { lesson: course.modules[0].lessons[0], module: course.modules[0] };
  };

  const { lesson: currentLesson, module: currentModule } = getCurrentLesson();

  const markLessonComplete = (lessonId) => {
    const updatedModules = course.modules.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(les => 
        les.id === lessonId ? { ...les, completed: true } : les
      )
    }));
    setCourse({ ...course, modules: updatedModules });
  };

  // Handle Next Lesson Logic
  const handleNextLesson = () => {
    // 1. Mark current as complete
    markLessonComplete(activeLessonId);

    // 2. Find next lesson
    let foundCurrent = false;
    let nextLessonId = null;

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (foundCurrent) {
          if (!lesson.locked) {
            nextLessonId = lesson.id;
          }
          break;
        }
        if (lesson.id === activeLessonId) {
          foundCurrent = true;
        }
      }
      if (nextLessonId) break;
    }

    if (nextLessonId) {
      setActiveLessonId(nextLessonId);
      window.scrollTo(0, 0);
    } else {
      alert("Congratulations! You have completed all available lessons.");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [`Resource file for: ${currentLesson.title}\n\nCourse: ${course.title}\n\nThis is a sample resource file downloaded from the EduLearn platform.`], 
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${currentLesson.title.replace(/\s+/g, '_')}_Resources.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Main Content Area (Video) */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/dashboard/courses" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
        </div>

        <div className="bg-black rounded-xl aspect-video w-full flex items-center justify-center relative overflow-hidden group shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <img 
            src={`https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1200&id=${activeLessonId}`} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt="Video Thumbnail"
          />
          <button className="relative z-20 h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 border-2 border-white/30">
            <PlayCircle className="h-12 w-12 fill-current" />
          </button>
          <div className="absolute bottom-6 left-6 z-20 text-white">
            <div className="text-sm font-medium text-primary-300 mb-1">{currentModule.title}</div>
            <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-bold text-lg">Lesson Description</h2>
            <span className={cn("text-sm flex items-center gap-1 font-medium", currentLesson.completed ? "text-green-600" : "text-gray-500")}>
              <CheckCircle className={cn("h-4 w-4", currentLesson.completed ? "fill-green-100" : "")} />
              {currentLesson.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            Welcome to <strong>{currentLesson.title}</strong>. In this session, we will dive deep into the core concepts required to master this topic. 
            Make sure to download the attached resources to follow along with the exercises.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-gray-100">
             <Button variant="secondary" className="gap-2" onClick={handleDownload}>
               <Download className="h-4 w-4" /> Download Resources
             </Button>
             <Button className="gap-2 ml-auto" onClick={handleNextLesson}>
               {currentLesson.completed ? 'Next Lesson' : 'Complete & Next'} <ChevronRight className="h-4 w-4" />
             </Button>
          </div>
        </div>
      </div>

      {/* Sidebar (Syllabus) */}
      <div className="w-full lg:w-96 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b bg-gray-50">
          <h3 className="font-bold text-gray-900">Course Content</h3>
          <div className="flex justify-between text-xs text-gray-500 mt-2 mb-1">
            <span>{progress}% Completed</span>
            <span>{course.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0)}/{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
          {course.modules.map((module) => (
            <div key={module.id} className="space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 rounded mt-2">
                {module.title}
              </div>
              {module.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  disabled={lesson.locked}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 border border-transparent",
                    lesson.id === activeLessonId 
                      ? "bg-primary-50 text-primary-700 border-primary-100 shadow-sm" 
                      : "hover:bg-gray-50 text-gray-700",
                    lesson.locked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {lesson.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 fill-green-50" />
                  ) : lesson.locked ? (
                    <Lock className="h-5 w-5 text-gray-400 shrink-0" />
                  ) : (
                    <PlayCircle className={cn("h-5 w-5 shrink-0", lesson.id === activeLessonId ? "text-primary-600" : "text-gray-400")} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", lesson.id === activeLessonId && "font-bold")}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <FileText className="h-3 w-3" /> {lesson.duration}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
