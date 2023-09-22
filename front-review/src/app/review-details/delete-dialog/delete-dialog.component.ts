import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-dialog.component.html',
})
export class DeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { reviewName: string }) {}
}
