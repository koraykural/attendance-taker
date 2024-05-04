import { Component } from '@angular/core';
import { OrganizationDetailsService } from '../../organization-details.service';
import { map } from 'rxjs';

@Component({
  selector: 'desktop-od-members',
  templateUrl: './od-members.component.html',
  styleUrls: ['./od-members.component.scss'],
})
export class OdMembersComponent {
  constructor(private readonly organizationDetailsService: OrganizationDetailsService) {}

  displayedColumns: string[] = ['fullName', 'email', 'joinedAt', 'role', 'actions'];

  myRole$ = this.organizationDetailsService.organization$.pipe(map((details) => details?.myRole));

  users$ = this.organizationDetailsService.users$.pipe(map((users) => users || []));

  promoteToAdmin(userId: string) {
    this.organizationDetailsService.promoteToAdmin(userId);
  }

  demoteFromAdmin(userId: string) {
    this.organizationDetailsService.demoteFromAdmin(userId);
  }

  removeUser(userId: string) {
    this.organizationDetailsService.removeUser(userId);
  }
}
