import { Component } from '@angular/core';
import { OrganizationUserRole } from '@interfaces/organization';
import { OrganizationDetailsService } from '../organization-details.service';
import { map } from 'rxjs';

@Component({
  selector: 'desktop-od-top-bar',
  templateUrl: './od-top-bar.component.html',
  styleUrls: ['./od-top-bar.component.scss'],
})
export class OdTopBarComponent {
  myRole$ = this.organziationDetailsService.organization$.pipe(
    map((organization) => organization?.myRole)
  );

  constructor(private organziationDetailsService: OrganizationDetailsService) {}
}
