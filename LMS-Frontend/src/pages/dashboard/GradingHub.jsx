import React, { useEffect, useState } from 'react';
import api from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export default function GradingHub() {
  const [subs, setSubs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

  useEffect(() => {
    loadSubs();
  }, []);

  const loadSubs = async () => {
    try {
      const res = await api.get('/teacher/submissions');
      setSubs(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load submissions');
    }
  };

  const openGrade = (s) => {
    setSelected(s);
    setGradeData({ grade: s.grade ?? '', feedback: s.feedback ?? '' });
  };

  const submitGrade = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setIsSaving(true);
    try {
      const res = await api.post(`/submissions/${selected.id}/grade`, {
        grade: Number(gradeData.grade),
        feedback: gradeData.feedback,
        status: 'graded',
      });
      setSubs(subs.map((s) => (s.id === selected.id ? res.data.submission : s)));
      setSelected(null);
      setGradeData({ grade: '', feedback: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to grade');
    } finally {
      setIsSaving(false);
    }
  };

  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded text-xs font-semibold';
    if (status === 'graded') return <span className={`${base} bg-green-100 text-green-700`}>Graded</span>;
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Evaluations / Grading</h1>
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Assignment</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Submitted</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subs.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium">{s.assignment?.title || '—'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                      {(s.student?.name || '?').charAt(0)}
                    </div>
                    <span>{s.student?.name || 'Unknown'}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-500">
                  {s.created_at ? new Date(s.created_at).toLocaleString() : '—'}
                </td>
                <td className="p-3">{statusBadge(s.status)}</td>
                <td className="p-3">
                  {s.status === 'graded'
                    ? `${s.grade ?? '--'}/${s.assignment?.points_possible ?? 100}`
                    : '--'}
                </td>
                <td className="p-3">
                  {s.status === 'graded' ? (
                    <span className="text-gray-400 text-xs">Done</span>
                  ) : (
                    <Button size="sm" onClick={() => openGrade(s)}>
                      Grade
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <div className="p-4 text-gray-500">No submissions yet.</div>}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Grade Submission">
        {selected && (
          <form onSubmit={submitGrade} className="space-y-3">
            <div className="text-sm">
              <p>
                <strong>Assignment:</strong> {selected.assignment?.title}
              </p>
              <p>
                <strong>Student:</strong> {selected.student?.name}
              </p>
              <p className="mt-1">
                <a
                  href={selected.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View Submission
                </a>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Score (0-100)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={gradeData.grade}
                onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Feedback</label>
              <textarea
                className="w-full border rounded p-2 text-sm"
                rows={3}
                value={gradeData.feedback}
                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Grade'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
