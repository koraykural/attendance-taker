import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type DialogData = {
  name: string;
};

@Component({
  selector: 'desktop-od-session-name-dialog',
  templateUrl: './od-session-name-dialog.component.html',
  styleUrls: ['./od-session-name-dialog.component.scss'],
})
export class OdSessionNameDialogComponent {
  formisvalid = !!this.data.name;

  constructor(
    public dialogRef: MatDialogRef<OdSessionNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  @HostListener('window:keyup.Enter', ['$event'])
  onEnter() {
    if (!this.data.name) return;
    this.dialogRef.close(this.data.name);
  }
}
