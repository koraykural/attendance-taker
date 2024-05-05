import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'attendance-checker-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.apiService.signUp(this.credentials.value).subscribe({
      complete: async () => {
        await loading.dismiss();
        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Signup failed',
          message: res.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
}
