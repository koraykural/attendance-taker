import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { SnackbarService } from '../shared/snackbar.service';
import { CreateSessionDto, CreateSessionResponseDto } from '@interfaces/session';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private readonly http: ApiService) {}

  createSession(body: CreateSessionDto) {
    return this.http.post<CreateSessionResponseDto>('session', body);
  }
}
