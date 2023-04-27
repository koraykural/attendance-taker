import { Component, Input, OnInit } from '@angular/core';
import {
  OrganizationDetailsResponse,
  OrganizationUser,
  OrganizationUserRole,
} from '@interfaces/organization';
import { SnackbarService } from '../../../shared/snackbar.service';
import { UserService } from '../../../shared/user.service';
import {
  debounce,
  debounceTime,
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { OrganizationService } from '../../organization.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'desktop-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss'],
})
export class OrganizationDetailsComponent implements OnInit {
  @Input() organizationId: string;
  shouldReload$ = new Subject<void>();
  organizationDetails$: Observable<OrganizationDetailsResponse>;
  users$: Observable<OrganizationUser[]>;
  displayedColumns: string[] = ['fullName', 'email', 'joinedAt', 'role', 'actions'];

  // Add new user
  searchInputControl = new FormControl('');
  searchUserResult$: Observable<{ email: string; id: string }[]> =
    this.searchInputControl.valueChanges.pipe(
      filter((value) => !!value && typeof value === 'string'),
      debounceTime(300),
      switchMap((value) =>
        this.userService.searchUsers({ search: value as string, excludeOrgId: this.organizationId })
      )
    );

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.organizationDetails$ = merge(
      this.shouldReload$.pipe(
        switchMap(() => this.organizationService.getOrganizationDetails(this.organizationId))
      ),
      this.organizationService.getOrganizationDetails(this.organizationId)
    ).pipe(shareReplay());
    this.users$ = this.organizationDetails$.pipe(map((details) => details.users));
  }

  addUser(userId: any) {
    this.organizationService.addUsers(this.organizationId, { userIds: [userId] }).subscribe({
      next: () => {
        this.searchInputControl.setValue('');
        this.shouldReload$.next();
      },
      error: () => {
        this.snackbar.error('Could not update user status.');
      },
    });
  }

  autocompleteDisplayFn(value: { email: string; id: string }) {
    return value.email;
  }

  removeUser(userId: string) {
    this.organizationService
      .changeUserRoles(this.organizationId, { userIdsToRemove: [userId] })
      .subscribe({
        next: () => {
          this.shouldReload$.next();
        },
        error: () => {
          this.snackbar.error('Could not update user status.');
        },
      });
  }

  promoteToAdmin(userId: string) {
    this.organizationService
      .changeUserRoles(this.organizationId, { userIdsToAdmin: [userId] })
      .subscribe({
        next: () => {
          this.shouldReload$.next();
        },
        error: () => {
          this.snackbar.error('Could not update user status.');
        },
      });
  }

  demoteFromAdmin(userId: string) {
    this.organizationService
      .changeUserRoles(this.organizationId, { userIdsToMember: [userId] })
      .subscribe({
        next: () => {
          this.shouldReload$.next();
        },
        error: () => {
          this.snackbar.error('Could not update user status.');
        },
      });
  }
}
