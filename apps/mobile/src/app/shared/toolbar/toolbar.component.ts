import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'attendance-checker-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  isAuthenticated$ = this.apiService.isAuthenticated;
  constructor(private apiService: ApiService) {}

  logout() {
    this.apiService.logout();
  }
}
