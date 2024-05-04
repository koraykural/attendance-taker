import { Component } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { debounceTime, filter, Observable, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OrganizationDetailsService } from '../organization-details.service';

@Component({
  selector: 'desktop-od-add-member',
  templateUrl: './od-add-member.component.html',
  styleUrls: ['./od-add-member.component.scss'],
})
export class OdAddMemberComponent {
  constructor(
    private readonly organizationDetailsService: OrganizationDetailsService,
    private readonly userService: UserService
  ) {}

  searchInputControl = new FormControl('');

  searchUserResult$: Observable<{ email: string; id: string }[]> =
    this.searchInputControl.valueChanges.pipe(
      filter((value) => !!value && typeof value === 'string'),
      debounceTime(300),
      switchMap((value) =>
        this.userService.searchUsers({
          search: value as string,
          excludeOrgId: this.organizationDetailsService.organizationId,
        })
      )
    );

  addUser(userId: any) {
    this.searchInputControl.setValue('');
    this.organizationDetailsService.addUsers({ userIds: [userId] });
  }

  autocompleteDisplayFn(value: { email: string; id: string }) {
    return value.email;
  }
}
