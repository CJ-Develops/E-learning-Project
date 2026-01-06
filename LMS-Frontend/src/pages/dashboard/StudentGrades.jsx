import React, { useEffect, useMemo, useState } from 'react';
import api from '../../lib/apiClient';
import { Button } from '../../components/ui/Button';
import { BarChart3, CheckCircle, Clock, AlertTriangle, MessageSquare } from 'lucide-react';

export default function StudentGrades() {
  const [gradesData, setGradesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/student/grades');
        setGradesData(data || []);
      } catch (error) {
        console.error(error);
        alert('Failed to load grades');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const stats = useMemo(() => {
    const assignments = gradesData.flatMap((group) => group.assignments || []);
    const totalSubmitted = assignments.length;
    const graded = assignments.filter((a) => a.grade !== null && a.points_possible);
    const pendingCount = assignments.filter((a) => (a.status || '').toLowerCase() === 'pending').length;

    const averageGrade =
      graded.length > 0
        ? Math.round(
            (graded.reduce((sum, a) => {
              const denom = a.points_possible || 100;
              if (!denom) return sum;
              return sum + (a.grade / denom) * 100;
            }, 0) / graded.length) * 10
          ) / 10
        : null;

    return { totalSubmitted, averageGrade, pendingCount };
  }, [gradesData]);

  const getStatusStyles = (status = '') => {
    const normalized = status.toLowerCase();
    if (normalized === 'graded') return 'bg-green-100 text-green-700';
    if (normalized === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (normalized === 'missing') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-600';
  };

  const getScoreColor = (grade, points) => {
    if (grade === null || !points) return 'text-gray-500';
    const pct = (grade / points) * 100;
    if (pct >= 85) return 'text-green-700';
    if (pct < 60) return 'text-red-600';
    return 'text-gray-800';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
          <p className="text-gray-600">Track your performance across all enrolled courses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="Assignments Submitted"
          value={stats.totalSubmitted}
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        />
        <SummaryCard
          label="Average Grade"
          value={stats.averageGrade !== null ? `${stats.averageGrade}%` : '—'}
          icon={<BarChart3 className="h-5 w-5 text-[#A51C30]" />}
        />
        <SummaryCard
          label="Pending Grades"
          value={stats.pendingCount}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
        />
      </div>

      {isLoading ? (
        <div className="p-6 text-gray-500">Loading grades...</div>
      ) : gradesData.length === 0 ? (
        <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3 text-gray-600">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>No submissions found yet.</span>
        </div>
      ) : (
        <div className="space-y-6">
          {gradesData.map((course) => (
            <div key={course.course_id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Course: {course.course_title}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Assignment</th>
                      <th className="px-6 py-3 text-left font-semibold">Date Submitted</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3 text-left font-semibold">Score</th>
                      <th className="px-6 py-3 text-left font-semibold">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(course.assignments || []).map((assignment) => (
                      <tr key={assignment.assignment_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">{assignment.assignment_title}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {assignment.submitted_at ? new Date(assignment.submitted_at).toLocaleString() : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyles(assignment.status)}`}>
                            {assignment.status || 'N/A'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 font-semibold ${getScoreColor(assignment.grade, assignment.points_possible)}`}>
                          {assignment.grade !== null && assignment.points_possible
                            ? `${assignment.grade}/${assignment.points_possible}`
                            : '—'}
                        </td>
                        <td className="px-6 py-4">
                          {assignment.feedback ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => alert(assignment.feedback)}
                              className="flex items-center gap-2"
                            >
                              <MessageSquare className="h-4 w-4" />
                              View
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400">No feedback</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-[#A51C30]/10 flex items-center justify-center text-[#A51C30]">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
