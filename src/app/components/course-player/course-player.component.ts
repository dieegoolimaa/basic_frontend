import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Course, Lesson, ProcedureStep } from '../../models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseReviewComponent } from '../course-review/course-review.component';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzMessageModule,
    CourseReviewComponent
  ],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.scss'
})
export class CoursePlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  private message = inject(NzMessageService);

  course = signal<Course | null>(null);
  currentLesson = signal<Lesson | null>(null);
  completedLessons = signal<string[]>([]);

  // Review modal
  showReviewModal = signal(false);

  currentVideoUrl = computed(() => {
    const lesson = this.currentLesson();
    if (!lesson || ['text', 'quiz'].includes(lesson.contentType || '')) return null;
    if (lesson.videoUrl) {
      return this.getSafeUrl(lesson.videoUrl);
    }
    return this.getSafeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe(c => {
        this.course.set(c);
        if (c.modules.length > 0 && c.modules[0].lessons.length > 0) {
          this.currentLesson.set(c.modules[0].lessons[0]);
        }
      });

      // Load user progress
      this.loadProgress();
    }
  }

  loadProgress() {
    this.userService.getMyProgress().subscribe({
      next: (progress) => {
        this.completedLessons.set(progress.completedLessons || []);
      },
      error: () => {
        // User might not be logged in
      }
    });
  }

  selectLesson(lesson: Lesson) {
    this.currentLesson.set(lesson);
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.completedLessons().includes(lessonId);
  }

  toggleStep(step: ProcedureStep) {
    step.isCompleted = !step.isCompleted;
  }

  markAsCompleted() {
    const lesson = this.currentLesson();
    const course = this.course();
    if (!lesson || !course) return;

    // Mark as completed in backend
    this.userService.markLessonComplete(lesson.id).subscribe({
      next: () => {
        this.completedLessons.update(lessons => [...lessons, lesson.id]);
        this.message.success('Aula concluída! 🎉');

        // Check if course is complete
        if (this.isCourseComplete()) {
          this.showReviewModal.set(true);
        } else {
          this.nextLesson();
        }
      },
      error: () => {
        this.message.error('Erro ao salvar progresso');
      }
    });
  }

  isCourseComplete(): boolean {
    const course = this.course();
    if (!course) return false;

    const totalLessons = this.getTotalLessons();
    const completed = this.completedLessons().length;
    return completed >= totalLessons;
  }

  getProgress(): number {
    const total = this.getTotalLessons();
    if (total === 0) return 0;
    return Math.round((this.completedLessons().length / total) * 100);
  }

  nextLesson() {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return;

    let foundCurrent = false;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (foundCurrent) {
          this.currentLesson.set(lesson);
          return;
        }
        if (lesson.id === current.id) {
          foundCurrent = true;
        }
      }
    }

    // No more lessons - course complete
    this.message.info('Parabéns! Você concluiu todas as aulas!');
    this.showReviewModal.set(true);
  }

  previousLesson() {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return;

    let prevLesson: Lesson | null = null;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === current.id && prevLesson) {
          this.currentLesson.set(prevLesson);
          return;
        }
        prevLesson = lesson;
      }
    }
  }

  hasPrevious(): boolean {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return false;

    return !(course.modules[0]?.lessons[0]?.id === current.id);
  }

  hasNext(): boolean {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return false;

    const lastModule = course.modules[course.modules.length - 1];
    const lastLesson = lastModule?.lessons[lastModule.lessons.length - 1];
    return current.id !== lastLesson?.id;
  }

  getTotalLessons(): number {
    const course = this.course();
    if (!course) return 0;
    return course.modules.reduce((total, mod) => total + mod.lessons.length, 0);
  }

  getLessonIcon(lesson: Lesson): string {
    if (this.isLessonCompleted(lesson.id)) return 'check-circle';
    switch (lesson.contentType) {
      case 'video': return 'play-circle';
      case 'text': return 'file-text';
      case 'quiz': return 'question-circle';
      case 'mixed': return 'experiment';
      default: return 'file';
    }
  }

  getTypeLabel(contentType: string | undefined): string {
    if (!contentType) return '';
    const labels: { [key: string]: string } = {
      'video': 'Vídeo',
      'text': 'Texto',
      'quiz': 'Quiz',
      'mixed': 'Misto'
    };
    return labels[contentType] || contentType;
  }

  onReviewSubmitted() {
    this.showReviewModal.set(false);
    this.message.success('Obrigada pela avaliação! 💖');
  }

  closeReviewModal() {
    this.showReviewModal.set(false);
  }

  private getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
