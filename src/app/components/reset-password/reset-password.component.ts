import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NzButtonModule,
        NzInputModule,
        NzFormModule,
        NzIconModule,
        NzMessageModule
    ],
    template: `
    <div class="reset-wrapper">
        <div class="reset-card fade-in">
            <!-- Invalid Token State -->
            <ng-container *ngIf="!token">
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h2>Link Inválido</h2>
                    <p>O link de redefinição de senha é inválido ou expirou.</p>
                    <a routerLink="/esqueci-senha" nz-button nzType="primary" nzSize="large">
                        Solicitar novo link
                    </a>
                </div>
            </ng-container>

            <!-- Reset Form -->
            <ng-container *ngIf="token && !success">
                <div class="brand-header">
                    <div class="logo">basic.</div>
                    <p class="subtitle">Criar nova senha</p>
                </div>

                <form (ngSubmit)="submitReset()" class="reset-form">
                    <nz-form-item>
                        <nz-form-control>
                            <nz-input-group [nzPrefix]="prefixLock" [nzSuffix]="suffixEye1">
                                <input nz-input [type]="showPassword ? 'text' : 'password'" 
                                       placeholder="Nova senha" [(ngModel)]="newPassword" name="newPassword" 
                                       required class="custom-input" />
                            </nz-input-group>
                            <ng-template #prefixLock>
                                <span nz-icon nzType="lock" class="input-icon"></span>
                            </ng-template>
                            <ng-template #suffixEye1>
                                <span nz-icon [nzType]="showPassword ? 'eye-invisible' : 'eye'" 
                                      class="toggle-eye" (click)="showPassword = !showPassword"></span>
                            </ng-template>
                        </nz-form-control>
                    </nz-form-item>

                    <nz-form-item>
                        <nz-form-control>
                            <nz-input-group [nzPrefix]="prefixLock2" [nzSuffix]="suffixEye2">
                                <input nz-input [type]="showConfirmPassword ? 'text' : 'password'" 
                                       placeholder="Confirmar nova senha" [(ngModel)]="confirmPassword" 
                                       name="confirmPassword" required class="custom-input" />
                            </nz-input-group>
                            <ng-template #prefixLock2>
                                <span nz-icon nzType="safety-certificate" class="input-icon"></span>
                            </ng-template>
                            <ng-template #suffixEye2>
                                <span nz-icon [nzType]="showConfirmPassword ? 'eye-invisible' : 'eye'" 
                                      class="toggle-eye" (click)="showConfirmPassword = !showConfirmPassword"></span>
                            </ng-template>
                        </nz-form-control>
                    </nz-form-item>

                    <div class="password-requirements">
                        <p [class.valid]="newPassword.length >= 6">
                            <span nz-icon [nzType]="newPassword.length >= 6 ? 'check-circle' : 'close-circle'"></span>
                            Mínimo 6 caracteres
                        </p>
                        <p [class.valid]="newPassword && newPassword === confirmPassword">
                            <span nz-icon [nzType]="newPassword && newPassword === confirmPassword ? 'check-circle' : 'close-circle'"></span>
                            Senhas coincidem
                        </p>
                    </div>

                    <button nz-button nzType="primary" nzBlock nzSize="large" 
                            [disabled]="!isValid" [nzLoading]="isLoading" class="btn-submit">
                        Redefinir Senha
                    </button>
                </form>
            </ng-container>

            <!-- Success State -->
            <ng-container *ngIf="success">
                <div class="success-state">
                    <div class="success-icon">✅</div>
                    <h2>Senha Redefinida!</h2>
                    <p>Sua senha foi alterada com sucesso. Faça login com sua nova senha.</p>
                    <a routerLink="/login" nz-button nzType="primary" nzSize="large" class="btn-login">
                        Fazer Login
                    </a>
                </div>
            </ng-container>
        </div>
    </div>
    `,
    styles: [`
        $bg-color: #fdfbf7;
        $primary: #232222;
        $accent: #d4a5a5;
        $text-light: #888;
        $radius: 12px;

        .reset-wrapper {
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: $bg-color;
            padding: 20px;
            box-sizing: border-box;
        }

        .reset-card {
            width: 100%;
            max-width: 400px;
            background: #fff;
            border-radius: $radius;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            text-align: center;
        }

        .brand-header {
            margin-bottom: 2rem;
            .logo { font-size: 2rem; font-weight: 700; color: $primary; letter-spacing: -1px; margin-bottom: 0.5rem; }
            .subtitle { color: $text-light; font-size: 0.95rem; font-weight: 400; margin: 0; }
        }

        .reset-form {
            text-align: left;

            nz-form-item { margin-bottom: 1.5rem; }

            ::ng-deep .ant-input-affix-wrapper {
                border: none;
                border-bottom: 1px solid #eee;
                border-radius: 0;
                padding: 10px 0;
                box-shadow: none !important;

                &:hover, &:focus-within { border-bottom-color: $accent; }
            }

            .custom-input {
                font-size: 1rem;
                &::placeholder { color: #ccc; }
            }

            .input-icon { color: $accent; font-size: 1.1rem; margin-right: 10px; }

            .toggle-eye {
                cursor: pointer;
                color: #ccc;
                &:hover { color: $primary; }
            }

            .btn-submit {
                height: 48px;
                background: $primary;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 500;
            }
        }

        .password-requirements {
            background: #fafafa;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 1.5rem;

            p {
                margin: 0 0 6px;
                font-size: 0.85rem;
                color: #999;
                display: flex;
                align-items: center;
                gap: 8px;

                &:last-child { margin-bottom: 0; }
                &.valid { color: #10b981; }
            }
        }

        .error-state, .success-state {
            .error-icon, .success-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            h2 {
                font-size: 1.5rem;
                color: $primary;
                margin: 0 0 1rem 0;
                font-weight: 600;
            }

            p {
                color: $text-light;
                font-size: 0.95rem;
                line-height: 1.6;
                margin: 0 0 2rem 0;
            }

            button, a[nz-button] {
                border-radius: 8px;
                height: 44px;
            }
        }

        .fade-in { animation: fadeInUp 0.5s ease-out; }
        @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }

        @media (max-width: 480px) {
            .reset-card {
                padding: 30px 20px;
                box-shadow: none;
                background: transparent;
            }
        }
    `]
})
export class ResetPasswordComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private message = inject(NzMessageService);

    token: string | null = null;
    newPassword = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;
    isLoading = false;
    success = false;

    get isValid(): boolean {
        return this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
    }

    ngOnInit() {
        this.token = this.route.snapshot.queryParamMap.get('token');
    }

    submitReset() {
        if (!this.isValid || !this.token) return;

        this.isLoading = true;
        this.authService.resetPassword(this.token, this.newPassword).subscribe({
            next: () => {
                this.isLoading = false;
                this.success = true;
            },
            error: (err) => {
                this.isLoading = false;
                this.message.error(err.error?.message || 'Token inválido ou expirado');
            }
        });
    }
}
