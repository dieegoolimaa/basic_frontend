import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HomeContentService } from '../../services/home-content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCarouselModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private homeContentService = inject(HomeContentService);
  private router = inject(Router);

  banners = this.homeContentService.banners;

  ngOnInit() {
    this.homeContentService.loadBanners();
  }

  navigateToCourses() {
    this.router.navigate(['/formacoes']);
  }
}
