import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NzButtonModule,
        NzInputModule,
        NzFormModule,
        NzIconModule,
        NzMessageModule,
        NzResultModule
    ],
    template: `
    <div class="forgot-wrapper">
        <div class="forgot-card fade-in">
            <!-- Request Form -->
            <ng-container *ngIf="!emailSent">
                <div class="brand-header">
                    <div class="logo">basic.</div>
                    <p class="subtitle">Recuperação de senha</p>
                </div>

                <p class="description">
                    Digite seu email e enviaremos um link para redefinir sua senha.
                </p>

                <form (ngSubmit)="submitRequest()" class="forgot-form">
                    <nz-form-item>
                        <nz-form-control>
                            <nz-input-group [nzPrefix]="prefixMail">
                                <input nz-input placeholder="Seu email" [(ngModel)]="email" name="email" 
                                       type="email" required class="custom-input" />
                            </nz-input-group>
                            <ng-template #prefixMail>
                                <span nz-icon nzType="mail" class="input-icon"></span>
                            </ng-template>
                        </nz-form-control>
                    </nz-form-item>

                    <button nz-button nzType="primary" nzBlock nzSize="large" 
                            [nzLoading]="isLoading" class="btn-submit">
                        Enviar link de recuperação
                    </button>
                </form>

                <div class="forgot-footer">
                    <a routerLink="/login" class="back-link">
                        <span nz-icon nzType="arrow-left"></span>
                        Voltar para o login
                    </a>
                </div>
            </ng-container>

            <!-- Success Message -->
            <ng-container *ngIf="emailSent">
                <div class="success-state">
                    <div class="success-icon">✉️</div>
                    <h2>Email enviado!</h2>
                    <p>
                        Se existe uma conta com o email <strong>{{ email }}</strong>, 
                        você receberá um link para redefinir sua senha.
                    </p>
                    <p class="hint">Verifique também sua caixa de spam.</p>
                    
                    <a routerLink="/login" nz-button nzType="primary" nzSize="large" class="btn-back">
                        Voltar para o login
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

        .forgot-wrapper {
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: $bg-color;
            padding: 20px;
            box-sizing: border-box;
        }

        .forgot-card {
            width: 100%;
            max-width: 400px;
            background: #fff;
            border-radius: $radius;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            text-align: center;
        }

        .brand-header {
            margin-bottom: 1.5rem;
            .logo { font-size: 2rem; font-weight: 700; color: $primary; letter-spacing: -1px; margin-bottom: 0.5rem; }
            .subtitle { color: $text-light; font-size: 0.95rem; font-weight: 400; margin: 0; }
        }

        .description {
            color: $text-light;
            font-size: 0.9rem;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .forgot-form {
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

            .btn-submit {
                height: 48px;
                background: $primary;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 500;
            }
        }

        .forgot-footer {
            margin-top: 2rem;

            .back-link {
                color: $accent;
                font-size: 0.9rem;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 6px;

                &:hover { text-decoration: underline; }
            }
        }

        .success-state {
            .success-icon {
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
                margin: 0 0 0.5rem 0;

                strong { color: $primary; }
            }

            .hint {
                font-size: 0.85rem;
                margin-bottom: 2rem;
            }

            .btn-back {
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
            .forgot-card {
                padding: 30px 20px;
                box-shadow: none;
                background: transparent;
            }
        }
    `]
})
export class ForgotPasswordComponent {
    private authService = inject(AuthService);
    private message = inject(NzMessageService);

    email = '';
    isLoading = false;
    emailSent = false;

    submitRequest() {
        if (!this.email) {
            this.message.warning('Por favor, insira seu email');
            return;
        }

        this.isLoading = true;
        this.authService.requestPasswordReset(this.email).subscribe({
            next: () => {
                this.isLoading = false;
                this.emailSent = true;
            },
            error: () => {
                this.isLoading = false;
                // Always show success to prevent email enumeration
                this.emailSent = true;
            }
        });
    }
}
