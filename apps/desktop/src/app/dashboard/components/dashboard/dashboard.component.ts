import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { OrganizationService } from '../../organization.service';
import { OrganizationUserRole } from '@interfaces/organization';

@Component({
  selector: 'desktop-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  organizationList$ = this.organizationService.organizationList$;
  ownsAnOrganization$ = this.organizationService.organizationList$.pipe(
    map((orgs) => orgs.some((org) => org.myRole === OrganizationUserRole.Owner))
  );

  constructor(private organizationService: OrganizationService) {}
}
