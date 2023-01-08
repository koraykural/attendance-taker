import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'dashboard-layout',
  templateUrl: './dashboard.layout.html',
  styleUrls: ['./dashboard.layout.css'],
})
export class DashboardLayout {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
