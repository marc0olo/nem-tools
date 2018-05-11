import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NemService } from '@app/services/nem.service';

@Component({
  selector: 'anms-transaction-detail-dialog',
  templateUrl: './transaction-detail-dialog.component.html',
  styleUrls: ['./transaction-detail-dialog.component.scss']
})
export class TransactionDetailDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TransactionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _nemService: NemService) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}
