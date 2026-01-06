<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SubmissionGraded extends Notification
{
    use Queueable;

    public function __construct(
        private string $assignmentTitle,
        private int $score,
        private int $maxScore
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "Your assignment {$this->assignmentTitle} was graded: {$this->score}/{$this->maxScore}",
            'type' => 'success',
            'link' => '/dashboard/assignments',
        ];
    }
}
