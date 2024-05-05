import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
  ],
  declarations: [RegisterComponent],
  exports: [RegisterComponent],
})
export class RegisterComponentModule {}
