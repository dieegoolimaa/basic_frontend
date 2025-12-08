import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models';

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
     * Get user by ID
     */
    getUserById(id: string): Observable<User> {
        return this.api.get<User>(`/users/${id}`);
    }

    /**
     * Update user
     */
    updateUser(id: string, data: Partial<User>): Observable<User> {
        return this.api.put<User>(`/users/${id}`, data);
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
        return this.api.put<User>(`/users/${id}`, { isActive });
    }
}
