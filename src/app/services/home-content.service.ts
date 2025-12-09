import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HomeBanner } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HomeContentService {
    private api = inject(ApiService);

    private bannersSignal = signal<HomeBanner[]>([]);
    readonly banners = this.bannersSignal.asReadonly();

    /**
     * Load all active banners
     */
    loadBanners() {
        this.api.get<HomeBanner[]>('/banners').subscribe({
            next: (banners) => this.bannersSignal.set(banners),
            error: (err) => console.error('Error loading banners', err)
        });
    }

    /**
     * Get all banners (Admin)
     */
    getAllBanners(): Observable<HomeBanner[]> {
        return this.api.get<HomeBanner[]>('/banners/admin').pipe(
            tap(banners => this.bannersSignal.set(banners))
        );
    }

    /**
     * Add new banner
     */
    addBanner(data: { imageUrl: string; title?: string; subtitle?: string; linkUrl?: string }): Observable<HomeBanner> {
        return this.api.post<HomeBanner>('/banners', data).pipe(
            tap(newBanner => {
                this.bannersSignal.update(banners => [...banners, newBanner]);
            })
        );
    }

    /**
     * Update banner
     */
    updateBanner(id: string, data: Partial<HomeBanner>): Observable<HomeBanner> {
        return this.api.put<HomeBanner>(`/banners/${id}`, data).pipe(
            tap(updated => {
                this.bannersSignal.update(banners =>
                    banners.map(b => b._id === id ? updated : b)
                );
            })
        );
    }

    /**
     * Remove banner
     */
    removeBanner(id: string): Observable<void> {
        return this.api.delete<void>(`/banners/${id}`).pipe(
            tap(() => {
                this.bannersSignal.update(banners =>
                    banners.filter(b => b._id !== id)
                );
            })
        );
    }

    /**
     * Toggle banner active status
     */
    toggleBannerStatus(id: string): Observable<HomeBanner> {
        return this.api.put<HomeBanner>(`/banners/${id}/toggle`, {}).pipe(
            tap(updated => {
                this.bannersSignal.update(banners =>
                    banners.map(b => b._id === id ? updated : b)
                );
            })
        );
    }
}
