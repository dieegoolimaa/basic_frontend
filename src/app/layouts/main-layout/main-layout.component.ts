import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NzLayoutModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = this.authService.isAuthenticated;
  isAdmin = this.authService.isAdmin.bind(this.authService);

  userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.name?.split(' ')[0] || 'Aluna';
  });

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
