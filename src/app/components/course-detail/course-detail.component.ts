import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NzButtonModule, NzIconModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  course = signal<Course | null>(null);
  isLoggedIn = this.authService.isAuthenticated;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseService.getCourseById(id).subscribe(c => this.course.set(c));
    }
  }

  startCourse(courseId: string) {
    this.router.navigate(['/player', courseId]);
  }

  getTotalDuration(course: Course): string {
    let totalMinutes = 0;
    course.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        if (lesson.duration) {
          const parts = lesson.duration.split(':');
          if (parts.length === 2) {
            totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]);
          }
        }
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
  }

  getTotalLessons(course: Course): number {
    return course.modules.reduce((total, mod) => total + mod.lessons.length, 0);
  }
}
