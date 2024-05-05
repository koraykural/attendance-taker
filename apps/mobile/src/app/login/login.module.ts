import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { IonicModule } from '@ionic/angular';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginComponentModule {}
