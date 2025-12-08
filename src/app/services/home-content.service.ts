import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HomeBanner } from '../models';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HomeContentService {
    private api = inject(ApiService);
    private endpoint = '/home-content';

    private bannersSignal = signal<HomeBanner[]>([]);
    readonly banners = this.bannersSignal.asReadonly();

    loadBanners() {
        this.api.get<HomeBanner[]>(this.endpoint).subscribe({
            next: (banners) => this.bannersSignal.set(banners),
            error: (err) => console.error('Error loading banners', err)
        });
    }

    addBanner(base64: string): Observable<any> {
        // TODO: Implement backend endpoint
        return of(true);
    }

    removeBanner(id: string): Observable<void> {
        // TODO: Implement backend endpoint
        return of(void 0);
    }
}
