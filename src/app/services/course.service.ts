import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MOCK_COURSES } from '../data/mock-data';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private http = inject(HttpClient);
    private apiUrl = 'api/courses'; // Mock URL

    // Signal for state management
    private coursesSignal = signal<Course[]>([]);
    readonly courses = this.coursesSignal.asReadonly();

    constructor() {
        // Optionally load initial data or data is loaded on demand
    }

    getAllCourses(): Observable<Course[]> {
        // Return mock data directly for frontend-first development
        return of(MOCK_COURSES).pipe(
            tap(data => {
                this.coursesSignal.set(data);
            })
        );
    }

    getCourseById(id: string): Observable<Course> {
        const course = MOCK_COURSES.find(c => c._id === id);
        return of(course as Course);
    }

    createCourse(course: Partial<Course>): Observable<Course> {
        return this.http.post<Course>(this.apiUrl, course).pipe(
            tap(newCourse => {
                this.coursesSignal.update(courses => [...courses, newCourse]);
            })
        );
    }

    updateCourse(id: string, updates: Partial<Course>): Observable<Course> {
        return this.http.put<Course>(`${this.apiUrl}/${id}`, updates).pipe(
            tap(updatedCourse => {
                this.coursesSignal.update(courses =>
                    courses.map(c => c._id === id ? updatedCourse : c)
                );
            })
        );
    }

    deleteCourse(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this.coursesSignal.update(courses =>
                    courses.filter(c => c._id !== id)
                );
            })
        );
    }
}
