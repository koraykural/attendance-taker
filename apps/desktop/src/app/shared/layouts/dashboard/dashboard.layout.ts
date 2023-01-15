import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'dashboard-layout',
  templateUrl: './dashboard.layout.html',
  styleUrls: ['./dashboard.layout.css'],
})
export class DashboardLayout {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
