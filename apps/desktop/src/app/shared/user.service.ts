import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SearchUserParams, SearchUserResponse } from '@interfaces/user';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: ApiService) {}

  searchUsers(params: SearchUserParams) {
    return this.http.get<SearchUserResponse[]>('user/search', { params: params as HttpParams });
  }
}
