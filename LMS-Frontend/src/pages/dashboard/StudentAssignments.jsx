import React, { useEffect, useState } from 'react';
import api from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/student/assignments');
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const openSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !file) return;
    setIsSubmitting(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post(`/assignments/${selectedAssignment.id}/submit`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Update local state for submission status
      setAssignments(assignments.map((a) => (a.id === selectedAssignment.id ? { ...a, student_submission: res.data.submission } : a)));
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Submit failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBadge = (a) => {
    const submission = a.student_submission;
    if (!submission) return null;
    const isGraded = submission.status === 'graded';
    return (
      <div className="absolute top-0 right-0 bg-white text-xs px-3 py-1 rounded-bl-xl font-medium flex items-center gap-1 border">
        <CheckCircle className="h-3 w-3" /> {isGraded ? 'Graded' : 'Submitted'}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-500">Track deadlines and submit your work.</p>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6">
          {assignments.map((a) => {
            const submission = a.student_submission;
            const isSubmitted = !!submission;
            const isGraded = submission?.status === 'graded';
            const due = a.due_date ? new Date(a.due_date).toLocaleDateString() : '—';
            return (
              <div key={a.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                {renderBadge(a)}
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl text-gray-900">{a.title}</h3>
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                        {a.points_possible ?? 100} Points
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{a.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Course: {a.course?.title || 'N/A'}</span>
                    </div>
                    {isGraded && (
                      <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded p-2">
                        Grade: {submission.grade ?? '--'}/{a.points_possible ?? 100}
                        {submission.feedback ? ` • Feedback: ${submission.feedback}` : ''}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[180px]">
                    <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Calendar className="h-4 w-4" />
                      Due: {due}
                    </div>
                    <Button
                      onClick={() => openSubmit(a)}
                      disabled={isGraded}
                      className={isGraded ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {isGraded ? 'View Submission' : isSubmitted ? 'Resubmit' : 'Submit Assignment'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Submit: ${selectedAssignment?.title}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>Upload your work for this assignment. Only one submission per assignment; re-submit to replace.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Attachment</label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Assignment'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
