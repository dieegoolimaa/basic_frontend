import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models';

@Component({
    selector: 'app-student-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, NzButtonModule, NzIconModule],
    templateUrl: './student-dashboard.component.html',
    styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
    private authService = inject(AuthService);
    private courseService = inject(CourseService);

    userName = '';
    enrolledCourses: Course[] = [];

    ngOnInit() {
        const user = this.authService.currentUser();
        this.userName = user?.name?.split(' ')[0] || 'Aluna';

        // Load only enrolled courses
        const enrolledIds = user?.enrolledCourses || [];
        this.courseService.getAllCourses().subscribe(courses => {
            this.enrolledCourses = courses.filter(c => enrolledIds.includes(c._id));
        });
    }

    getProgress(courseId: string): number {
        const user = this.authService.currentUser();
        if (!user?.progress?.[courseId]) return 0;

        const course = this.enrolledCourses.find(c => c._id === courseId);
        if (!course) return 0;

        const totalLessons = this.getTotalLessons(course);
        const completedLessons = user.progress[courseId].completedLessons.length;

        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    getTotalLessons(course: Course): number {
        return course.modules.reduce((total, mod) => total + mod.lessons.length, 0);
    }

    getNextLesson(course: Course): string | null {
        const user = this.authService.currentUser();
        const completed = user?.progress?.[course._id]?.completedLessons || [];

        for (const mod of course.modules) {
            for (const lesson of mod.lessons) {
                if (!completed.includes(lesson.title)) {
                    return lesson.title;
                }
            }
        }
        return null;
    }

    getTotalCompletedLessons(): number {
        const user = this.authService.currentUser();
        if (!user?.progress) return 0;

        return Object.values(user.progress).reduce((total, p) => total + p.completedLessons.length, 0);
    }

    getTotalHours(): number {
        // Estimate based on enrolled courses
        return this.enrolledCourses.reduce((total, course) => {
            const lessons = this.getTotalLessons(course);
            return total + Math.round(lessons * 0.25); // ~15 min per lesson
        }, 0);
    }

    getCertificatesCount(): number {
        // Count courses with 100% progress
        return this.enrolledCourses.filter(c => this.getProgress(c._id) === 100).length;
    }
}
