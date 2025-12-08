import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { CourseService } from '../../services/course.service';
import { Course, Lesson, ProcedureStep } from '../../models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzMessageModule
  ],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.scss'
})
export class CoursePlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private sanitizer = inject(DomSanitizer);
  private message = inject(NzMessageService);

  course = signal<Course | null>(null);
  currentLesson = signal<Lesson | null>(null);
  currentLessonIndex = signal<number>(0);

  currentVideoUrl = computed(() => {
    const lesson = this.currentLesson();
    if (!lesson || ['text', 'quiz'].includes(lesson.contentType)) return null;
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
    }
  }

  selectLesson(lesson: Lesson) {
    this.currentLesson.set(lesson);
  }

  toggleStep(step: ProcedureStep) {
    step.isCompleted = !step.isCompleted;
  }

  markAsCompleted() {
    const lesson = this.currentLesson();
    if (lesson) {
      lesson.completed = true;
      this.message.success('Aula concluída!');
      this.nextLesson();
    }
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
        if (lesson === current) {
          foundCurrent = true;
        }
      }
    }

    this.message.info('Parabéns! Você concluiu todas as aulas!');
  }

  previousLesson() {
    const course = this.course();
    const current = this.currentLesson();
    if (!course || !current) return;

    let prevLesson: Lesson | null = null;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson === current && prevLesson) {
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

    return !(course.modules[0]?.lessons[0] === current);
  }

  getTotalLessons(): number {
    const course = this.course();
    if (!course) return 0;
    return course.modules.reduce((total, mod) => total + mod.lessons.length, 0);
  }

  getLessonIcon(lesson: Lesson): string {
    if (lesson.completed) return 'check-circle';
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

  private getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
