import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Plus, Search, Trash2, Edit2, BookOpen, Users } from 'lucide-react';
import axios from 'axios'; // <--- Make sure you run: npm install axios

// API Connection
const API_URL = "http://127.0.0.1:8000/api/courses";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch from Database on Load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // You might need to pass the token here if your API requires login
      // const token = localStorage.getItem('token');
      // const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(API_URL);
      setCourses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setIsLoading(false);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Exact column names from your database
    const courseData = {
      title: formData.get('title'),
      description: formData.get('description'),
      thumbnail: formData.get('thumbnail'),
    };

    try {
      if (isEditMode && currentCourse) {
        // Update (PUT)
        const response = await axios.put(`${API_URL}/${currentCourse.id}`, courseData);
        setCourses(courses.map(c => c.id === currentCourse.id ? response.data.course : c));
      } else {
        // Create (POST)
        const response = await axios.post(API_URL, courseData);
        setCourses([response.data.course, ...courses]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save. Check your backend terminal for errors.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setCourses(courses.filter(c => c.id !== id));
      } catch (error) {
        alert("Failed to delete. You might not be the owner.");
      }
    }
  };

  const openAdd = () => { setIsEditMode(false); setCurrentCourse(null); setIsModalOpen(true); };
  const openEdit = (course) => { setIsEditMode(true); setCurrentCourse(course); setIsModalOpen(true); };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4"/> Create Course</Button>
      </div>

      <div className="relative max-w-md">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
         <Input placeholder="Search..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-48 bg-gray-100 relative">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><BookOpen className="h-12 w-12"/></div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                <div className="flex justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="h-3 w-3"/> {course.enrolled || 0}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(course)} className="text-blue-600"><Edit2 className="h-4 w-4"/></button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600"><Trash2 className="h-4 w-4"/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit" : "Create"}>
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <div><label className="text-sm font-medium">Title</label><Input name="title" defaultValue={currentCourse?.title} required /></div>
          <div><label className="text-sm font-medium">Thumbnail</label><Input name="thumbnail" defaultValue={currentCourse?.thumbnail} /></div>
          <div><label className="text-sm font-medium">Description</label><textarea name="description" defaultValue={currentCourse?.description} className="w-full border rounded p-2" /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}