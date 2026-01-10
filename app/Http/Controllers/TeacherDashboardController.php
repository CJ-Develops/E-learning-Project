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
        $teacher = $request->user();
        $courseIds = $teacher->teachingCourses()
            ->pluck('courses.id')
            ->unique()
            ->values();

        $teacherAssignmentIds = Assignment::where('created_by', $teacher->id)->pluck('id');

        $stats = [
            'enrolled_count' => Enrollment::whereIn('course_id', $courseIds)
                ->distinct('user_id')
                ->count('user_id'),
            'pending_eval_count' => Submission::whereIn('assignment_id', $teacherAssignmentIds)
                ->where('status', 'pending')
                ->count(),
        ];

        $recentGraded = Submission::with([
                'student:id,name',
                'assignment:id,title,course_id',
                'assignment.course:id,title',
            ])
            ->where(function ($query) use ($teacher, $courseIds) {
                $query->whereHas('assignment', function ($q) use ($teacher) {
                    $q->where('created_by', $teacher->id);
                })->orWhere(function ($legacyQuery) use ($courseIds, $teacher) {
                    $legacyQuery->where('status', 'graded')
                        ->whereHas('assignment', function ($q) use ($courseIds, $teacher) {
                            $q->whereNull('created_by')
                                ->whereIn('course_id', $courseIds)
                                ->whereHas('course.teachers', function ($teacherQuery) use ($teacher) {
                                    $teacherQuery->where('users.id', $teacher->id);
                                });
                        });
                });
            })
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

        $atRiskStudents = $this->getAtRiskStudents($courseIds, $teacherAssignmentIds);

        $activityFeed = $this->getActivityFeed($courseIds, $teacherAssignmentIds);

        $response = [
            'stats' => $stats,
            'recent_graded' => $recentGraded,
            'action_items' => $actionItems,
            'at_risk_students' => $atRiskStudents,
            'activity_feed' => $activityFeed,
        ];

        return response()->json($response);
    }

    protected function getAtRiskStudents(Collection $courseIds, Collection $assignmentIds): Collection
    {
        $assignmentsCount = $assignmentIds->count();
        if ($assignmentsCount === 0 || $courseIds->isEmpty()) {
            return collect();
        }

        $students = Enrollment::with('student:id,name')
            ->whereIn('course_id', $courseIds)
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

    protected function getActivityFeed(Collection $courseIds, Collection $assignmentIds): Collection
    {
        if ($courseIds->isEmpty()) {
            return collect();
        }

        $recentSubmissions = Submission::with([
                'student:id,name',
                'assignment:id,title,course_id',
                'assignment.course:id,title',
            ])
            ->whereIn('assignment_id', $assignmentIds)
            ->latest()
            ->take(10)
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
            ->whereIn('course_id', $courseIds)
            ->latest()
            ->take(10)
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
            ->take(5)
            ->values();
    }
}
