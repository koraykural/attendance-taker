import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { OrganizationDetailsComponent } from './components/organization-details/organization-details.component';
import { SessionComponent } from './components/session/session.component';
import { OdTopBarComponent } from './components/organization-details/od-top-bar/od-top-bar.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateOrganizationComponent,
    OrganizationDetailsComponent,
    SessionComponent,
    OdTopBarComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule, QRCodeModule],
})
export class DashboardModule {}
