import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeBanner } from '../models';
import { Observable, of, tap } from 'rxjs';
import { MOCK_BANNERS } from '../data/mock-data';

@Injectable({
    providedIn: 'root'
})
export class HomeContentService {
    private http = inject(HttpClient);
    private apiUrl = 'api/home-content'; // Mock URL

    private bannersSignal = signal<HomeBanner[]>([]);
    readonly banners = this.bannersSignal.asReadonly();

    loadBanners() {
        // Return mock data directly for frontend-first development
        this.bannersSignal.set(MOCK_BANNERS);
    }

    addBanner(base64: string): Observable<any> {
        const newBanner: HomeBanner = {
            _id: Date.now().toString(),
            imageUrl: base64,
            active: true,
            createdAt: new Date()
        };
        this.bannersSignal.update(list => [...list, newBanner]);
        return of(true);
    }

    removeBanner(id: string): Observable<void> {
        this.bannersSignal.update(list => list.filter(b => b._id !== id));
        return of(void 0);
    }
}
