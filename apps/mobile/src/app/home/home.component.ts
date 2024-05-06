import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';

@Component({
  selector: 'attendance-checker-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  inUse = false;
  sessions$ = this.apiService.getAttendedSessions();

  constructor(private alertController: AlertController, private apiService: ApiService) {}

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find((f) => /back|rear|environment/gi.test(f.label)); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      this.inUse = true;
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      this.inUse = false;
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    const codes = e.map((f) => f.value).filter((v) => v.startsWith('code-'));

    codes.forEach((code) =>
      this.apiService.attendToSession(code).subscribe({
        next: (result: { sessionName?: string; didNotAttempt: boolean }) => {
          if (result.didNotAttempt) {
            return;
          }

          this.sessions$ = this.apiService.getAttendedSessions();

          this.alertController
            .create({
              header: 'Success',
              message: `Successfully attended to the session: ${result?.sessionName}`,
              buttons: ['OK'],
            })
            .then((alert) => alert.present());
        },
        error: (err: any) => {
          let message: string = err?.error?.message || 'An error occurred';

          if (message === 'User and session are not in the same organization') {
            message = 'You are not allowed to attend to this session.';
          }

          this.alertController
            .create({
              header: 'Error',
              message,
              buttons: ['OK'],
            })
            .then((alert) => alert.present());
        },
      })
    );
  }
}
