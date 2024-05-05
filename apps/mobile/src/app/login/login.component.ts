import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'attendance-checker-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.apiService.login(this.credentials.value).subscribe({
      complete: async () => {
        await loading.dismiss();
        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: async (errorResponse) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: errorResponse.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
}
