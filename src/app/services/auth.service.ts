import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, delay, throwError } from 'rxjs';
import { User, InviteCode } from '../models';

// Store for invite codes (in production, this would be in the backend)
let INVITE_CODES: InviteCode[] = [
    { _id: 'inv-1', code: 'BASIC2024', email: 'teste@email.com', used: false, courseIds: ['course-1', 'course-2', 'course-3'], createdAt: new Date() },
    { _id: 'inv-2', code: 'VIP2024', email: 'vip@email.com', used: false, courseIds: ['course-1', 'course-2', 'course-3'], createdAt: new Date() }
];

// Mock users
const MOCK_USERS: { [email: string]: { password: string, user: User } } = {
    'admin@basic.com': {
        password: 'admin123',
        user: {
            _id: 'admin-1',
            name: 'Administradora',
            email: 'admin@basic.com',
            role: 'admin',
            isActive: true,
            enrolledCourses: [],
            progress: {}
        }
    },
    'aluna@basic.com': {
        password: 'aluna123',
        user: {
            _id: 'student-1',
            name: 'Maria Aluna',
            email: 'aluna@basic.com',
            phone: '(11) 99999-1234',
            city: 'São Paulo, SP',
            role: 'student',
            isActive: true,
            enrolledCourses: ['course-1', 'course-2'],
            progress: {
                'course-1': { completedLessons: ['Bem-vinda ao Curso'], quizScores: {} }
            }
        }
    }
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    currentUser = signal<User | null>(null);
    isAuthenticated = computed(() => !!this.currentUser());

    constructor() {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.currentUser.set(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
            }
        }
    }

    /**
     * LOGIN
     * admin@basic.com / admin123 → Admin
     * aluna@basic.com / aluna123 → Student
     */
    login(credentials: { email: string, password: string }): Observable<{ token: string, user: User }> {
        const email = credentials.email.toLowerCase();

        if (MOCK_USERS[email]) {
            const mockData = MOCK_USERS[email];
            if (credentials.password === mockData.password) {
                return of({ token: 'token-' + Date.now(), user: mockData.user }).pipe(
                    delay(400),
                    tap(response => this.saveSession(response))
                );
            } else {
                return throwError(() => new Error('Senha incorreta'));
            }
        }

        // Check if user was previously registered
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = storedUsers.find((u: any) => u.email === email);
        if (existingUser) {
            return of({ token: 'token-' + Date.now(), user: existingUser }).pipe(
                delay(400),
                tap(response => this.saveSession(response))
            );
        }

        return throwError(() => new Error('Usuário não encontrado'));
    }

    private saveSession(response: { token: string, user: User }) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
    }

    // Validate invite code
    validateInviteCode(code: string): Observable<{ valid: boolean, courseIds?: string[] }> {
        const invite = INVITE_CODES.find(i => i.code.toUpperCase() === code.toUpperCase() && !i.used);
        if (invite) {
            return of({ valid: true, courseIds: invite.courseIds }).pipe(delay(300));
        }
        return of({ valid: false }).pipe(delay(300));
    }

    // Register with invite code
    register(data: {
        name: string,
        email: string,
        phone: string,
        address?: string,
        city?: string,
        password: string,
        inviteCode: string
    }): Observable<{ token: string, user: User }> {
        const invite = INVITE_CODES.find(i => i.code.toUpperCase() === data.inviteCode.toUpperCase() && !i.used);

        if (!invite) {
            return throwError(() => new Error('Código de convite inválido ou já utilizado'));
        }

        // Mark invite as used
        invite.used = true;
        invite.usedBy = data.email;

        const newUser: User = {
            _id: 'user-' + Date.now(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            role: 'student',
            isActive: true,
            enrolledCourses: invite.courseIds || [],
            inviteCode: data.inviteCode,
            progress: {},
            createdAt: new Date()
        };

        // Store user for future logins
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        storedUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));

        return of({ token: 'token-' + Date.now(), user: newUser }).pipe(
            delay(600),
            tap(response => this.saveSession(response))
        );
    }

    // Create invite code (admin only)
    createInviteCode(email: string, courseIds: string[]): Observable<InviteCode> {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const invite: InviteCode = {
            _id: 'inv-' + Date.now(),
            code: code,
            email: email,
            courseIds: courseIds,
            used: false,
            createdAt: new Date()
        };

        INVITE_CODES.push(invite);
        return of(invite).pipe(delay(300));
    }

    // Get pending invite codes
    getPendingInvites(): Observable<InviteCode[]> {
        return of(INVITE_CODES.filter(i => !i.used)).pipe(delay(200));
    }

    // Delete invite code
    deleteInviteCode(id: string): Observable<void> {
        INVITE_CODES = INVITE_CODES.filter(i => i._id !== id);
        return of(undefined).pipe(delay(200));
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAdmin(): boolean {
        return this.currentUser()?.role === 'admin';
    }

    canAccessCourse(courseId: string): boolean {
        const user = this.currentUser();
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user.enrolledCourses?.includes(courseId) ?? false;
    }
}
