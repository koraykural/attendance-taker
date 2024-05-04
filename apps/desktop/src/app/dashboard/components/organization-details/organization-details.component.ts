import { Component } from '@angular/core';
import { OrganizationDetailsService } from './organization-details.service';
import { map } from 'rxjs';

@Component({
  selector: 'desktop-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss'],
})
export class OrganizationDetailsComponent {
  organization$ = this.organizationDetailsService.organization$;

  myRole$ = this.organizationDetailsService.organization$.pipe(
    map((organization) => organization?.myRole)
  );

  constructor(private readonly organizationDetailsService: OrganizationDetailsService) {}
}
