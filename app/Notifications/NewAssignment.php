<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewAssignment extends Notification
{
    use Queueable;

    public function __construct(private string $assignmentTitle)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "New assignment posted: {$this->assignmentTitle}",
            'type' => 'info',
            'link' => '/dashboard/assignments',
        ];
    }
}
