import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Calendar, AlertCircle, CheckCircle, Upload, File } from 'lucide-react';

export default function Assignments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Mock Data matching `assignments` table
  const assignments = [
    { 
      id: 1, 
      course_id: 7, 
      title: 'PHP Login System', 
      description: 'Create a secure login system using PHP and MySQL. Include password hashing.', 
      total_points: 100, 
      due_date: '2025-12-30',
      created_at: '2025-12-27 22:58:07'
    },
    { 
      id: 2, 
      course_id: 7, 
      title: 'Database Schema Design', 
      description: 'Create an Entity Relationship Diagram (ERD) for the LMS project.', 
      total_points: 50, 
      due_date: '2026-01-15',
      created_at: '2025-12-28 09:00:00'
    },
    { 
      id: 3, 
      course_id: 8, 
      title: 'React Component Composition', 
      description: 'Build a reusable modal component using React children props.', 
      total_points: 75, 
      due_date: '2026-02-01',
      created_at: '2025-12-30 09:00:00'
    }
  ];

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would upload files and create a submission record
    setSubmittedIds([...submittedIds, selectedAssignment.id]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-500">Track deadlines and submit your work.</p>
      </div>

      <div className="grid gap-6">
        {assignments.map((item) => {
          const isSubmitted = submittedIds.includes(item.id);
          const isOverdue = new Date(item.due_date) < new Date() && !isSubmitted;

          return (
            <div key={item.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              {isSubmitted && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-xl font-medium flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Submitted
                </div>
              )}
              
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xl text-gray-900">{item.title}</h3>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                      {item.total_points} Points
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Course ID: {item.course_id}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 min-w-[180px]">
                  <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg ${
                    isOverdue ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    Due: {item.due_date}
                  </div>
                  
                  <Button 
                    onClick={() => handleOpenSubmit(item)}
                    disabled={isSubmitted}
                    className={isSubmitted ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isSubmitted ? 'View Submission' : 'Submit Assignment'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Submit: ${selectedAssignment?.title}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>Make sure to review your work before submitting. You can upload a file or provide a text link/answer.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Answer / Text</label>
            <textarea 
              required
              className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              placeholder="Type your answer here..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Attachment (Optional)</label>
            <div className="relative">
              <input 
                type="file" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${selectedFile ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                {selectedFile ? (
                  <div className="flex flex-col items-center text-primary-700">
                    <File className="h-8 w-8 mb-2" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-xs opacity-75">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, ZIP, PNG (Max 10MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Assignment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
