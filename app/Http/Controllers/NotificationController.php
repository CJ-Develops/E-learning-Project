<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications()
            ->latest()
            ->take(10)
            ->get();
        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'unread_count' => $unreadCount,
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'data' => $notification->data,
                    'created_at' => $notification->created_at->diffForHumans(),
                    'read_at' => $notification->read_at,
                ];
            }),
        ]);
    }

    public function markRead(Request $request)
    {
        $user = $request->user();
        $notificationId = $request->input('id');

        if ($notificationId) {
            $notification = $user->unreadNotifications()
                ->where('id', $notificationId)
                ->first();

            if ($notification) {
                $notification->markAsRead();
            }
        } else {
            $user->unreadNotifications->markAsRead();
        }

        return response()->json(['message' => 'Notifications marked as read']);
    }
}
