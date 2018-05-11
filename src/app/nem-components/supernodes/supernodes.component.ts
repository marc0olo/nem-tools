import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NemService, Supernode } from '@app/services/nem.service';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar, MatSortable } from '@angular/material';
import { snackBarMsg } from '@app/constants';

@Component({
  selector: 'app-supernodes',
  templateUrl: './supernodes.component.html',
  styleUrls: ['./supernodes.component.scss']
})
export class SupernodesComponent implements OnInit, AfterViewInit, AfterViewChecked {

  private supernodesArray: Supernode[];
  displayedColumns = ['host', 'alias', 'active', 'slotsAvailable', 'slotsUsed', 'freeSlots', 'syncDate'];
  supernodeTableOutput;
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public snackBar: MatSnackBar, private _nemService: NemService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.loading = true;
    this._nemService.supernodes.subscribe( supernodes => {
      // console.log(supernodes);
      this.supernodesArray = supernodes;
      this.supernodeTableOutput = new MatTableDataSource<Supernode>(this.supernodesArray);
      this.supernodeTableOutput.paginator = this.paginator;
      this.supernodeTableOutput.sort = this.sort;
      // console.log("done");
      this.loading = false;
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  onCopy() {
    snackBarMsg(this.snackBar,"copied to clipboard", "");
  }
}
