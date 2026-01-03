import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { FileText, Download, MoreHorizontal, Edit2, Eye, Calendar, User } from 'lucide-react';

export default function Grading() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, graded
  
  // State for handling the action dropdowns
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock Data
  const [submissions, setSubmissions] = useState([
    { 
      id: 1, 
      title: "PHP Login System Implementation", 
      description: "I have implemented the login system using password_hash() and Prepared Statements as requested. Please find the attached zip file containing the source code.",
      student: { name: "Naomi Gutmann", avatar: "https://i.pravatar.cc/150?u=1", email: "naomi@example.com" },
      date: "1/2/2026",
      status: "graded",
      grade: 79,
      maxGrade: 100,
      fileName: "login_system_v1.zip"
    },
    { 
      id: 2, 
      title: "Database ERD Diagram", 
      description: "Here is the ERD for the e-commerce project. I used 3rd normal form normalization.",
      student: { name: "Meghan Upton", avatar: "https://i.pravatar.cc/150?u=2", email: "meghan@example.com" },
      date: "1/3/2026",
      status: "pending",
      grade: null,
      maxGrade: 100,
      fileName: "erd_diagram.pdf"
    },
    { 
      id: 3, 
      title: "React Components Task", 
      description: "Completed the modal and button components with Tailwind CSS.",
      student: { name: "Laura Mraz", avatar: "https://i.pravatar.cc/150?u=3", email: "laura@example.com" },
      date: "1/3/2026",
      status: "graded",
      grade: 96,
      maxGrade: 100,
      fileName: "react_components.zip"
    },
    { 
      id: 4, 
      title: "API Integration Assignment", 
      description: "Connected to the PokeAPI and displayed a list of Pokemon.",
      student: { name: "Maria Stracke", avatar: "https://i.pravatar.cc/150?u=4", email: "maria@example.com" },
      date: "1/3/2026",
      status: "graded",
      grade: 79,
      maxGrade: 100,
      fileName: "api_task.js"
    },
    { 
      id: 5, 
      title: "Final Project Proposal", 
      description: "Proposal for a Learning Management System.",
      student: { name: "Robert Leannon MD", avatar: "https://i.pravatar.cc/150?u=5", email: "robert@example.com" },
      date: "1/3/2026",
      status: "graded",
      grade: 94,
      maxGrade: 100,
      fileName: "proposal.docx"
    }
  ]);

  const handleOpenGrade = (sub) => {
    setSelectedSubmission(sub);
    setIsGradeModalOpen(true);
    setActiveDropdownId(null);
  };

  const handleViewDetails = (sub) => {
    setSelectedSubmission(sub);
    setIsDetailModalOpen(true);
    setActiveDropdownId(null);
  };

  const handleDownload = (sub) => {
    // Simulate file download
    const element = document.createElement("a");
    const file = new Blob(
      [`File Content for: ${sub.fileName}\n\nStudent: ${sub.student.name}\nDescription: ${sub.description}`], 
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = sub.fileName || `submission_${sub.id}.txt`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const grade = parseInt(formData.get('grade'));

    setSubmissions(submissions.map(s => 
      s.id === selectedSubmission.id 
        ? { ...s, grade, status: 'graded' } 
        : s
    ));
    setIsGradeModalOpen(false);
  };

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignment Grading</h1>
          <p className="text-gray-500">Review and grade student submissions.</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border shadow-sm">
          {['all', 'pending', 'graded'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                filter === f 
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Assignment</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors relative">
                  <td className="px-6 py-4 max-w-md">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="text-gray-900 font-medium line-clamp-2">{sub.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={sub.student.avatar} alt="" className="h-8 w-8 rounded-full" />
                      <span className="text-gray-700 font-medium">{sub.student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {sub.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      sub.status === 'graded' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {sub.status === 'graded' ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Graded
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span> Pending
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {sub.grade !== null ? `${sub.grade}/100` : '--'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button 
                        onClick={() => handleDownload(sub)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download Submission"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      
                      {sub.status === 'pending' ? (
                        <Button size="sm" onClick={() => handleOpenGrade(sub)}>
                          Grade
                        </Button>
                      ) : (
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === sub.id ? null : sub.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeDropdownId === sub.id && (
                            <div 
                              ref={dropdownRef}
                              className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-100"
                            >
                              <button 
                                onClick={() => handleViewDetails(sub)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left first:rounded-t-lg"
                              >
                                <Eye className="h-4 w-4" /> View Details
                              </button>
                              <button 
                                onClick={() => handleOpenGrade(sub)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left last:rounded-b-lg"
                              >
                                <Edit2 className="h-4 w-4" /> Edit Grade
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title="Grade Assignment"
      >
        <form onSubmit={handleSubmitGrade} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-500">Student</p>
            <div className="flex items-center gap-2">
              <img src={selectedSubmission?.student.avatar} className="h-6 w-6 rounded-full" />
              <span className="font-medium text-gray-900">{selectedSubmission?.student.name}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Assignment</p>
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{selectedSubmission?.title}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Grade (0-100)</label>
            <div className="flex items-center gap-2">
              <Input 
                name="grade" 
                type="number" 
                min="0" 
                max="100" 
                required 
                defaultValue={selectedSubmission?.grade || ''}
                placeholder="0"
                className="text-lg font-bold"
              />
              <span className="text-gray-400 font-medium">/ 100</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsGradeModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Grade</Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Submission Details"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img src={selectedSubmission?.student.avatar} className="h-12 w-12 rounded-full" alt="Student" />
            <div>
              <h4 className="font-bold text-gray-900">{selectedSubmission?.student.name}</h4>
              <p className="text-sm text-gray-500">{selectedSubmission?.student.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Assignment Title</h4>
            <p className="text-gray-900 font-medium">{selectedSubmission?.title}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Submission Date</h4>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="h-4 w-4 text-gray-400" />
              {selectedSubmission?.date}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Student's Notes</h4>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 border border-gray-100">
              {selectedSubmission?.description}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Attached File</h4>
            <button 
              onClick={() => handleDownload(selectedSubmission)}
              className="flex items-center gap-3 w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="p-2 bg-blue-50 text-blue-600 rounded group-hover:bg-blue-100 transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedSubmission?.fileName}</p>
                <p className="text-xs text-gray-500">Click to download</p>
              </div>
              <Download className="h-4 w-4 text-gray-400 ml-auto group-hover:text-primary-600" />
            </button>
          </div>

          {selectedSubmission && selectedSubmission.grade !== null && (
             <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex justify-between items-center">
                <span className="font-medium text-green-800">Graded Score</span>
                <span className="text-xl font-bold text-green-700">{selectedSubmission.grade} / 100</span>
             </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
