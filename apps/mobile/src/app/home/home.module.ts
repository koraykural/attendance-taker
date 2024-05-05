import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { IonicModule } from '@ionic/angular';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, IonicModule, HomeRoutingModule, SharedModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeComponentModule {}
