import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './components/home/home.component';
import { AdminHomeManagerComponent } from './components/admin-home-manager/admin-home-manager.component';
import { AdminUserManagerComponent } from './components/admin-user-manager/admin-user-manager.component';
import { AdminAdminManagerComponent } from './components/admin-admin-manager/admin-admin-manager.component';
import { CoursePlayerComponent } from './components/course-player/course-player.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { AdminCourseManagerComponent } from './components/admin-course-manager/admin-course-manager.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Change Password Route (requires auth but no layout)
    {
        path: 'alterar-senha',
        component: ChangePasswordComponent,
        canActivate: [authGuard]
    },
    // Public Routes
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'formacoes', component: CourseListComponent },
            { path: 'formacoes/:id', component: CourseDetailComponent },
            { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
            { path: 'registro', component: RegisterComponent, canActivate: [guestGuard] },

            // Protected routes
            { path: 'meus-cursos', component: StudentDashboardComponent, canActivate: [authGuard] },
            { path: 'player/:id', component: CoursePlayerComponent, canActivate: [authGuard] },
        ]
    },
    // Admin Routes
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: AdminHomeManagerComponent },
            { path: 'courses', component: AdminCourseManagerComponent },
            { path: 'users', component: AdminUserManagerComponent },
            { path: 'admins', component: AdminAdminManagerComponent },
        ]
    },
    { path: '**', redirectTo: '' }
];

