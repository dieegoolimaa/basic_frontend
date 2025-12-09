import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { HomeContentService } from '../../services/home-content.service';
import { UploadService } from '../../services/upload.service';
import { HomeBanner, SiteSettings } from '../../models';
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
    NzTagModule,
    NzModalModule,
    NzToolTipModule,
    NzTabsModule,
    NzCardModule
  ],
  templateUrl: './admin-home-manager.component.html',
  styleUrl: './admin-home-manager.component.scss'
})
export class AdminHomeManagerComponent implements OnInit {
  private homeContentService = inject(HomeContentService);
  private uploadService = inject(UploadService);
  private message = inject(NzMessageService);

  // Banners
  banners: HomeBanner[] = [];
  isLoading = false;

  // Banner Modal
  isModalVisible = false;
  editingBanner: HomeBanner | null = null;
  bannerForm = {
    title: '',
    subtitle: '',
    imageUrl: ''
  };

  // Site Settings
  settingsForm: Partial<SiteSettings> = {
    aboutTag: '',
    aboutTitle: '',
    aboutParagraph1: '',
    aboutParagraph2: '',
    aboutImageUrl: '',
    experienceYears: '',
    studentsFormed: '',
    averageRating: '',
    founderName: ''
  };
  isSavingSettings = false;

  ngOnInit() {
    this.loadBanners();
    this.loadSettings();
  }

  // ========== BANNERS ==========

  loadBanners() {
    this.isLoading = true;
    this.homeContentService.getAllBanners().subscribe({
      next: (banners) => {
        this.banners = banners;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading banners:', err);
        this.message.error('Erro ao carregar banners');
        this.isLoading = false;
      }
    });
  }

  handleUpload = (item: NzUploadXHRArgs) => {
    const file = item.file as any;

    if (!this.uploadService.isValidImage(file)) {
      this.message.error('Formato de imagem inválido');
      if (item.onError) {
        item.onError(new Error('Invalid image'), item.file);
      }
      return new Subscription();
    }

    this.uploadService.uploadFile(file, 'image').subscribe({
      next: (response) => {
        this.bannerForm.imageUrl = response.url;
        if (item.onSuccess) {
          item.onSuccess(response, item.file, new Event(''));
        }
        this.message.success('Imagem carregada!');
      },
      error: (err) => {
        if (item.onError) {
          item.onError(err, item.file);
        }
        this.message.error('Erro ao carregar imagem');
      }
    });

    return new Subscription();
  };

  showAddModal() {
    this.editingBanner = null;
    this.bannerForm = { title: '', subtitle: '', imageUrl: '' };
    this.isModalVisible = true;
  }

  showEditModal(banner: HomeBanner) {
    this.editingBanner = banner;
    this.bannerForm = {
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || ''
    };
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.editingBanner = null;
  }

  saveBanner() {
    if (!this.bannerForm.imageUrl) {
      this.message.warning('Por favor, faça upload de uma imagem');
      return;
    }

    if (this.editingBanner) {
      this.homeContentService.updateBanner(this.editingBanner._id, this.bannerForm).subscribe({
        next: (updated) => {
          const idx = this.banners.findIndex(b => b._id === updated._id);
          if (idx >= 0) this.banners[idx] = updated;
          this.message.success('Banner atualizado!');
          this.closeModal();
        },
        error: () => this.message.error('Erro ao atualizar banner')
      });
    } else {
      this.homeContentService.addBanner(this.bannerForm).subscribe({
        next: (newBanner) => {
          this.banners.push(newBanner);
          this.message.success('Banner criado!');
          this.closeModal();
        },
        error: () => this.message.error('Erro ao criar banner')
      });
    }
  }

  removeBanner(id: string) {
    this.homeContentService.removeBanner(id).subscribe({
      next: () => {
        this.banners = this.banners.filter(b => b._id !== id);
        this.message.success('Banner removido');
      },
      error: () => this.message.error('Erro ao remover banner')
    });
  }

  toggleStatus(banner: HomeBanner) {
    this.homeContentService.toggleBannerStatus(banner._id).subscribe({
      next: (updated) => {
        const idx = this.banners.findIndex(b => b._id === updated._id);
        if (idx >= 0) this.banners[idx] = updated;
        this.message.success(`Banner ${updated.isActive ? 'ativado' : 'desativado'}`);
      },
      error: () => this.message.error('Erro ao alterar status')
    });
  }

  trackByBannerId(index: number, banner: HomeBanner): string {
    return banner._id;
  }

  // ========== SITE SETTINGS ==========

  loadSettings() {
    this.homeContentService.getSettings().subscribe({
      next: (settings) => {
        this.settingsForm = { ...settings };
      },
      error: (err) => {
        console.error('Error loading settings:', err);
      }
    });
  }

  handleAboutImageUpload = (item: NzUploadXHRArgs) => {
    const file = item.file as any;

    if (!this.uploadService.isValidImage(file)) {
      this.message.error('Formato de imagem inválido');
      if (item.onError) {
        item.onError(new Error('Invalid image'), item.file);
      }
      return new Subscription();
    }

    this.uploadService.uploadFile(file, 'image').subscribe({
      next: (response) => {
        this.settingsForm.aboutImageUrl = response.url;
        if (item.onSuccess) {
          item.onSuccess(response, item.file, new Event(''));
        }
        this.message.success('Imagem carregada!');
      },
      error: (err) => {
        if (item.onError) {
          item.onError(err, item.file);
        }
        this.message.error('Erro ao carregar imagem');
      }
    });

    return new Subscription();
  };

  saveSettings() {
    this.isSavingSettings = true;
    this.homeContentService.updateSettings(this.settingsForm).subscribe({
      next: () => {
        this.message.success('Configurações salvas com sucesso!');
        this.isSavingSettings = false;
      },
      error: (err) => {
        console.error('Error saving settings:', err);
        this.message.error('Erro ao salvar configurações');
        this.isSavingSettings = false;
      }
    });
  }
}
