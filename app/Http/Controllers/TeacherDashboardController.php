<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Enrollment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class TeacherDashboardController extends Controller
{
    public function index(Request $request)
    {
        $teacherId = $request->user()->id;

        $teacherAssignmentIds = Assignment::whereHas('course', function ($q) use ($teacherId) {
            $q->whereHas('teachers', function ($teacherQuery) use ($teacherId) {
                $teacherQuery->where('users.id', $teacherId);
            });
        })->pluck('id');

        $stats = [
            'enrolled_count' => Enrollment::whereHas('course', function ($q) use ($teacherId) {
                $q->whereHas('teachers', function ($teacherQuery) use ($teacherId) {
                    $teacherQuery->where('users.id', $teacherId);
                });
            })->count(),
            'pending_eval_count' => Submission::whereIn('assignment_id', $teacherAssignmentIds)
                ->where('status', 'pending')
                ->count(),
        ];

        $recentGraded = Submission::with([
                'student:id,name',
                'assignment:id,title,course_id',
                'assignment.course:id,title',
            ])
            ->whereIn('assignment_id', $teacherAssignmentIds)
            ->where('status', 'graded')
            ->where('grade', '>', 70)
            ->latest('updated_at')
            ->take(3)
            ->get()
            ->map(function (Submission $submission) {
                return [
                    'id' => $submission->id,
                    'student_name' => optional($submission->student)->name,
                    'assignment_title' => optional($submission->assignment)->title,
                    'grade' => $submission->grade,
                    'graded_at' => $submission->updated_at,
                ];
            });

        $actionItems = [
            'ungraded_count' => $stats['pending_eval_count'],
        ];

        $atRiskStudents = $this->getAtRiskStudents($teacherId, $teacherAssignmentIds);

        $activityFeed = $this->getActivityFeed($teacherId);

        return response()->json([
            'stats' => $stats,
            'recent_graded' => $recentGraded,
            'action_items' => $actionItems,
            'at_risk_students' => $atRiskStudents,
            'activity_feed' => $activityFeed,
        ]);
    }

    protected function getAtRiskStudents(int $teacherId, Collection $assignmentIds): Collection
    {
        $assignmentsCount = $assignmentIds->count();
        if ($assignmentsCount === 0) {
            return collect();
        }

        $students = Enrollment::with('student:id,name')
            ->whereHas('course', function ($q) use ($teacherId) {
                $q->whereHas('teachers', function ($teacherQuery) use ($teacherId) {
                    $teacherQuery->where('users.id', $teacherId);
                });
            })
            ->get()
            ->groupBy('user_id');

        return $students->map(function ($enrollments, $studentId) use ($assignmentIds, $assignmentsCount) {
                $submittedCount = Submission::whereIn('assignment_id', $assignmentIds)
                    ->where('student_id', $studentId)
                    ->count();
                $missing = max($assignmentsCount - $submittedCount, 0);

                return [
                    'student_id' => $studentId,
                    'student_name' => optional($enrollments->first()->student)->name,
                    'missing_count' => $missing,
                ];
            })
            ->filter(fn ($item) => $item['missing_count'] >= 3)
            ->values();
    }

    protected function getActivityFeed(int $teacherId): Collection
    {
        $recentSubmissions = Submission::with([
                'student:id,name',
                'assignment:id,title,course_id',
                'assignment.course:id,title',
            ])
            ->whereHas('assignment.course', function ($q) use ($teacherId) {
                $q->whereHas('teachers', function ($teacherQuery) use ($teacherId) {
                    $teacherQuery->where('users.id', $teacherId);
                });
            })
            ->latest()
            ->take(5)
            ->get()
            ->map(function (Submission $submission) {
                return [
                    'type' => 'submission',
                    'id' => "submission-{$submission->id}",
                    'title' => optional($submission->student)->name . ' submitted "' . optional($submission->assignment)->title . '"',
                    'created_at' => $submission->created_at,
                ];
            });

        $recentEnrollments = Enrollment::with([
                'student:id,name',
                'course:id,title',
            ])
            ->whereHas('course', function ($q) use ($teacherId) {
                $q->whereHas('teachers', function ($teacherQuery) use ($teacherId) {
                    $teacherQuery->where('users.id', $teacherId);
                });
            })
            ->latest()
            ->take(5)
            ->get()
            ->map(function (Enrollment $enrollment) {
                return [
                    'type' => 'enrollment',
                    'id' => "enrollment-{$enrollment->id}",
                    'title' => optional($enrollment->student)->name . ' enrolled in "' . optional($enrollment->course)->title . '"',
                    'created_at' => $enrollment->created_at,
                ];
            });

        return $recentSubmissions
            ->merge($recentEnrollments)
            ->sortByDesc('created_at')
            ->values();
    }
}
