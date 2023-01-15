import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private defaultSettings: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
    duration: 3000,
  };

  constructor(private readonly _snackbar: MatSnackBar) {}

  info(message: string) {
    this._snackbar.open(message, undefined, {
      ...this.defaultSettings,
    });
  }

  error(message: string) {
    this._snackbar.open(message, undefined, {
      ...this.defaultSettings,
      panelClass: 'error-snackbar',
    });
  }
}
