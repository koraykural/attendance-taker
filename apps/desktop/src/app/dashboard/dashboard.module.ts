import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { OrganizationDetailsComponent } from './components/organization-details/organization-details.component';
import { SessionComponent } from './components/session/session.component';
import { OdTopBarComponent } from './components/organization-details/od-top-bar/od-top-bar.component';
import { OdMembersComponent } from './components/organization-details/tabs/od-members/od-members.component';
import { OdSessionsComponent } from './components/organization-details/tabs/od-sessions/od-sessions.component';
import { OdAddMemberComponent } from './components/organization-details/od-add-member/od-add-member.component';
import { OdCreateSessionButtonComponent } from './components/organization-details/od-create-session-button/od-create-session-button.component';
import { OdSessionNameDialogComponent } from './components/organization-details/od-create-session-button/od-session-name-dialog/od-session-name-dialog.component';
import { SessionTerminatedComponent } from './components/session/session-terminated/session-terminated.component';
import { SessionActiveComponent } from './components/session/session-active/session-active.component';
import { SessionAttendeeListComponent } from './components/session/session-attendee-list/session-attendee-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateOrganizationComponent,
    OrganizationDetailsComponent,
    SessionComponent,
    OdTopBarComponent,
    OdMembersComponent,
    OdSessionsComponent,
    OdAddMemberComponent,
    OdCreateSessionButtonComponent,
    OdSessionNameDialogComponent,
    SessionTerminatedComponent,
    SessionActiveComponent,
    SessionAttendeeListComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule, QRCodeModule],
})
export class DashboardModule {}
