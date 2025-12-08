import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CourseService } from '../../services/course.service';
import { Course, Lesson, QuizQuestion } from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-course-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzUploadModule,
    NzTabsModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzCollapseModule,
    NzTagModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCardModule,
    NzDividerModule,
    NzPageHeaderModule,
    NzLayoutModule,
    NzMenuModule,
    NzRadioModule,
    RouterModule
  ],
  templateUrl: './admin-course-manager.component.html',
  styleUrl: './admin-course-manager.component.scss'
})
export class AdminCourseManagerComponent implements OnInit {
  private courseService = inject(CourseService);
  private message = inject(NzMessageService);

  courses: Course[] = [];
  isLoading = false;
  isEditingMode = false;
  videoInputType: 'url' | 'file' = 'url';

  currentCourse: Partial<Course> = {};
  selectedLesson: Lesson | null = null;
  activeModuleIndex = 0;

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.getAllCoursesAdmin().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.message.error('Erro ao carregar cursos');
        this.isLoading = false;
      }
    });
  }

  // --- ACTIONS ---

  createNewCourse() {
    this.currentCourse = { title: 'Nova Formação', description: '', thumbnailUrl: '', modules: [] };
    this.isEditingMode = true;
    this.selectedLesson = null;
  }

  editCourse(course: Course) {
    this.currentCourse = JSON.parse(JSON.stringify(course)); // Deep copy
    this.isEditingMode = true;
    if (this.currentCourse.modules && this.currentCourse.modules.length > 0) {
      this.activeModuleIndex = 0;
      if (this.currentCourse.modules[0].lessons.length > 0) {
        this.selectedLesson = this.currentCourse.modules[0].lessons[0];
      }
    } else {
      this.selectedLesson = null;
    }
  }

  deleteCourse(id: string) {
    if (confirm('Tem certeza que deseja deletar este curso?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c._id !== id);
          this.message.success('Curso removido com sucesso');
        },
        error: (err) => {
          this.message.error('Erro ao remover curso');
        }
      });
    }
  }

  saveCourse() {
    if (this.currentCourse._id) {
      // Update existing course
      this.courseService.updateCourse(this.currentCourse._id, this.currentCourse).subscribe({
        next: (updated) => {
          const idx = this.courses.findIndex(c => c._id === this.currentCourse._id);
          if (idx !== -1) this.courses[idx] = updated;
          this.isEditingMode = false;
          this.message.success('Curso atualizado com sucesso!');
        },
        error: (err) => {
          this.message.error('Erro ao atualizar curso');
        }
      });
    } else {
      // Create new course
      this.courseService.createCourse(this.currentCourse).subscribe({
        next: (newCourse) => {
          this.courses.push(newCourse);
          this.isEditingMode = false;
          this.message.success('Curso criado com sucesso!');
        },
        error: (err) => {
          this.message.error('Erro ao criar curso');
        }
      });
    }
  }

  cancelEdit() {
    // Could add confirm check if dirty
    this.isEditingMode = false;
    this.selectedLesson = null;
  }

  // --- EDITOR LOGIC ---

  addModule() {
    if (!this.currentCourse.modules) this.currentCourse.modules = [];
    this.currentCourse.modules.push({ title: 'Novo Módulo', lessons: [] });
    this.activeModuleIndex = this.currentCourse.modules.length - 1;
  }

  removeModule(index: number) {
    if (confirm('Remover este módulo e suas aulas?')) {
      this.currentCourse.modules?.splice(index, 1);
      this.selectedLesson = null;
    }
  }

  handleModuleClick(index: number) {
    this.activeModuleIndex = index;
  }

  addLesson(moduleIndex: number) {
    const newLesson: Lesson = {
      title: 'Nova Aula',
      duration: '00:00',
      completed: false,
      contentType: 'video',
      isMandatory: false
    };
    this.currentCourse.modules![moduleIndex].lessons.push(newLesson);
    this.selectedLesson = newLesson;
  }

  selectLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'video': return 'play-circle';
      case 'text': return 'file-text';
      case 'quiz': return 'question-circle';
      case 'mixed': return 'experiment';
      default: return 'file';
    }
  }

  // --- QUIZ & STEPS HELPERS ---

  getQuizQuestions(lesson: Lesson): QuizQuestion[] {
    if (!lesson.quiz) lesson.quiz = { minPassScore: 70, questions: [] };
    return lesson.quiz.questions;
  }

  addQuestion(lesson: Lesson) {
    if (!lesson.quiz) lesson.quiz = { minPassScore: 70, questions: [] };
    lesson.quiz.questions.push({
      id: Date.now().toString(),
      question: '',
      options: ['Opção A', 'Opção B'],
      correctOptionIndex: 0
    });
  }

  removeQuestion(lesson: Lesson, idx: number) {
    lesson.quiz?.questions.splice(idx, 1);
  }

  getSteps(lesson: Lesson) {
    if (!lesson.steps) lesson.steps = [];
    return lesson.steps;
  }

  addStep(lesson: Lesson) {
    if (!lesson.steps) lesson.steps = [];
    lesson.steps.push({ id: Date.now().toString(), text: '', isCompleted: false });
  }

  removeStep(lesson: Lesson, idx: number) {
    lesson.steps?.splice(idx, 1);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  handleUpload = (item: any) => {
    const file = item.file as File;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentCourse.thumbnailUrl = e.target.result;
      item.onSuccess({}, item.file, event);
      this.message.success('Imagem carregada');
    };
    reader.readAsDataURL(file);
    return new Subscription();
  };

  handleVideoUpload = (item: any) => {
    if (!this.selectedLesson) return new Subscription();

    const file = item.file as File;
    // For demo, we'll create a blob URL. In production, you'd upload to a server.
    const videoUrl = URL.createObjectURL(file);
    this.selectedLesson.videoFile = videoUrl;
    this.selectedLesson.videoUrl = undefined; // Clear URL if using file

    item.onSuccess({}, item.file, event);
    this.message.success(`Vídeo "${file.name}" carregado com sucesso!`);

    return new Subscription();
  };
}
