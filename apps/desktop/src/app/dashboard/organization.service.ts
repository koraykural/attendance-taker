import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import {
  CreateOrganizationDto,
  OrganizationDetailsResponse,
  OrganizationListResponse,
  ChangeUserRolesDto,
  AddMembersDto,
} from '@interfaces/organization';
import { catchError, merge, of, share, Subject, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SnackbarService } from '../shared/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private reloadOrganizationList$ = new Subject<true>();
  public organizationList$ = merge(this.reloadOrganizationList$, this.authService.isLoggedIn$).pipe(
    switchMap((shouldFetch) =>
      shouldFetch ? this.http.get<OrganizationListResponse[]>('organization') : of([])
    ),
    catchError(() => {
      this.snackbar.error('Could not retrieve organization list.');
      return of([]);
    }),
    share()
  );

  constructor(
    private readonly http: ApiService,
    private readonly authService: AuthService,
    private readonly snackbar: SnackbarService
  ) {}

  createOrganization(body: CreateOrganizationDto) {
    return this.http.post('organization', body).subscribe({
      next: () => {
        this.reloadOrganizationList$.next(true);
      },
      error: (error) => {
        this.snackbar.error(error?.error?.message || 'Could not create organization.');
      },
    });
  }

  addUsers(organizationId: string, body: AddMembersDto) {
    return this.http.post(`organization/${organizationId}/add-members`, body);
  }

  changeUserRoles(organizationId: string, body: ChangeUserRolesDto) {
    return this.http.post(`organization/${organizationId}/change-roles`, body);
  }

  getOrganizationDetails(organizationId: string) {
    return this.http.get<OrganizationDetailsResponse>(`organization/${organizationId}`);
  }
}
