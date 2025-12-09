import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models';

export interface UserProgress {
    completedLessons: string[];
    courseProgress: { [courseId: string]: number };
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private api = inject(ApiService);

    /**
     * Get all students (Admin only)
     */
    getAllStudents(): Observable<User[]> {
        return this.api.get<User[]>('/users/students');
    }

    /**
     * Get current user profile
     */
    getMyProfile(): Observable<User> {
        return this.api.get<User>('/users/me');
    }

    /**
     * Get my enrolled courses
     */
    getMyCourses(): Observable<any[]> {
        return this.api.get<any[]>('/users/me/courses');
    }

    /**
     * Get my progress
     */
    getMyProgress(): Observable<UserProgress> {
        return this.api.get<UserProgress>('/users/me/progress');
    }

    /**
     * Mark lesson as complete
     */
    markLessonComplete(lessonId: string): Observable<User> {
        return this.api.put<User>(`/users/me/lessons/${lessonId}/complete`, {});
    }

    /**
     * Update course progress
     */
    updateCourseProgress(courseId: string, progress: number): Observable<User> {
        return this.api.put<User>(`/users/me/courses/${courseId}/progress`, { progress });
    }

    /**
     * Get user by ID
     */
    getUserById(id: string): Observable<User> {
        return this.api.get<User>(`/users/${id}`);
    }

    /**
     * Update user (Admin)
     */
    updateUser(id: string, data: Partial<User>): Observable<User> {
        return this.api.put<User>(`/users/${id}`, data);
    }

    /**
     * Update user courses (Admin)
     */
    updateUserCourses(id: string, courseIds: string[]): Observable<User> {
        return this.api.put<User>(`/users/${id}/courses`, { courseIds });
    }

    /**
     * Update my profile
     */
    updateMyProfile(data: Partial<User>): Observable<User> {
        return this.api.put<User>('/users/me', data);
    }

    /**
     * Toggle user active status (Admin only)
     */
    toggleUserStatus(id: string, isActive: boolean): Observable<User> {
        return this.api.put<User>(`/users/${id}/active`, { isActive });
    }
}
