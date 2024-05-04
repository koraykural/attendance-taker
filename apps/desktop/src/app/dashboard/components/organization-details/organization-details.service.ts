import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/api.service';
import {
  OrganizationDetailsResponse,
  ChangeUserRolesDto,
  AddMembersDto,
} from '@interfaces/organization';
import { BehaviorSubject, finalize, map, startWith } from 'rxjs';
import { SnackbarService } from '../../../shared/snackbar.service';
import { SessionListResponseItem } from '@interfaces/session';

@Injectable({
  providedIn: 'root',
})
export class OrganizationDetailsService {
  public readonly organization$ = new BehaviorSubject<OrganizationDetailsResponse | null>(null);
  public readonly sessions$ = new BehaviorSubject<SessionListResponseItem[]>([]);

  public readonly users$ = this.organization$.pipe(map((details) => details?.users));

  public readonly loadingOrganization$ = new BehaviorSubject<boolean>(false);

  get organizationId() {
    return this.organization$.value?.id;
  }

  constructor(private readonly http: ApiService, private readonly snackbar: SnackbarService) {}

  private changeUserRoles(body: ChangeUserRolesDto) {
    if (!this.organizationId) {
      throw new Error('No current organization is set');
    }

    return this.http.post(`organization/${this.organizationId}/change-roles`, body).subscribe({
      next: () => {
        this.reloadOrganizationDetails();
      },
      error: () => {
        this.snackbar.error('Could not update user status.');
      },
    });
  }

  public addUsers(body: AddMembersDto) {
    if (!this.organizationId) {
      throw new Error('No current organization is set');
    }

    return this.http.post(`organization/${this.organizationId}/add-members`, body).subscribe({
      next: () => {
        this.reloadOrganizationDetails();
      },
      error: () => {
        this.snackbar.error('Could not update user status.');
      },
    });
  }

  public removeUser(userId: string) {
    this.changeUserRoles({ userIdsToRemove: [userId] });
  }

  public promoteToAdmin(userId: string) {
    this.changeUserRoles({ userIdsToAdmin: [userId] });
  }

  public demoteFromAdmin(userId: string) {
    this.changeUserRoles({ userIdsToMember: [userId] });
  }

  private reloadOrganizationDetails() {
    if (this.organizationId) {
      this.setOrganizationDetails(this.organizationId);
    }
  }

  public setOrganizationDetails(organizationId: string) {
    this.loadingOrganization$.next(true);

    this.http
      .get<OrganizationDetailsResponse>(`organization/${organizationId}`)
      .pipe(
        startWith(null),
        finalize(() => this.loadingOrganization$.next(false))
      )
      .subscribe({
        next: (organization) => {
          this.organization$.next(organization);
          this.setSessions();
        },
        error: () => {
          this.snackbar.error('Could not retrieve organization details.');
        },
      });
  }

  public setSessions() {
    this.http
      .get<SessionListResponseItem[]>(`session/organization/${this.organizationId}`)
      .subscribe({
        next: (sessions) => {
          this.sessions$.next(sessions);
        },
        error: () => {
          this.snackbar.error('Could not retrieve organization sessions.');
        },
      });
  }
}
