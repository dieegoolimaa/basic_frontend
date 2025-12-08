export interface Course {
    _id: string;
    title: string;
    description: string;
    videoUrl?: string;
    thumbnailUrl: string;
    modules: CourseModule[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CourseModule {
    title: string;
    lessons: Lesson[];
}

export interface Lesson {
    title: string;
    duration: string;
    completed: boolean;
    contentType: 'video' | 'text' | 'mixed' | 'quiz';
    videoUrl?: string;
    videoFile?: string; // Base64 or blob URL for uploaded video
    content?: string;
    steps?: ProcedureStep[];
    isMandatory?: boolean;
    quiz?: {
        questions: QuizQuestion[];
        minPassScore: number;
    };
}

export interface ProcedureStep {
    id: string;
    text: string;
    isCompleted: boolean;
    timeOffset?: number;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctOptionIndex: number;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    role: 'student' | 'admin';
    isActive: boolean;
    enrolledCourses?: string[];
    progress?: { [courseId: string]: CourseProgress };
    inviteCode?: string;
    createdAt?: Date;
}

export interface CourseProgress {
    completedLessons: string[];
    quizScores: { [lessonId: string]: number };
}

export interface HomeBanner {
    _id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
    active: boolean;
    createdAt?: Date;
}

// Invite code for user registration
export interface InviteCode {
    _id: string;
    code: string;
    email: string;
    courseIds: string[]; // Courses the user will have access to
    used: boolean;
    usedBy?: string;
    createdAt: Date;
    expiresAt?: Date;
}
