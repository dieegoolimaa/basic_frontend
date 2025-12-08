import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { HomeContentService } from '../../services/home-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-home-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzButtonModule,
    NzUploadModule,
    NzIconModule,
    NzMessageModule,
    NzInputModule,
    NzSwitchModule,
    NzTableModule,
    NzInputNumberModule,
    NzTagModule
  ],
  templateUrl: './admin-home-manager.component.html',
  styleUrl: './admin-home-manager.component.scss'
})
export class AdminHomeManagerComponent {
  private homeContentService = inject(HomeContentService);
  private message = inject(NzMessageService);

  banners = this.homeContentService.banners;

  handleUpload = (item: NzUploadXHRArgs) => {
    // Mock upload logic
    const file = item.file as any;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.homeContentService.addBanner(e.target.result);
      if (item.onSuccess) { // Check if exists
        item.onSuccess({}, item.file, event);
      }
      this.message.success('Banner adicionado com sucesso!');
    };
    reader.readAsDataURL(file);
    return new Subscription();
  };

  removeBanner(id: string) {
    this.homeContentService.removeBanner(id).subscribe(() => {
      this.message.success('Banner removido');
    });
  }

  trackByBannerId(index: number, banner: any): string {
    return banner._id;
  }
}
