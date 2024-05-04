import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrganizationDetailsService } from '../../organization-details.service';
import { formatDate } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SessionListResponseItem } from '@interfaces/session';
import { Subject, startWith, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'desktop-od-sessions',
  templateUrl: './od-sessions.component.html',
  styleUrls: ['./od-sessions.component.scss'],
})
export class OdSessionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource = new MatTableDataSource<SessionListResponseItem>();

  displayedColumns: string[] = ['name', 'createdAt', 'attendeeCount', 'isTerminated', 'actions'];

  constructor(
    private readonly organizationDetailsService: OrganizationDetailsService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit() {
    this.organizationDetailsService.setSessions();
    this.organizationDetailsService.sessions$
      .pipe(
        startWith([]),
        takeUntil(this.ngUnsubscribe),
        tap((sessions) => {
          if (sessions.length) {
            this.dataSource.data = sessions;
            this.dataSource.sort = this.sort;
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getTerminatedAtTooltipText(date: Date | null): string {
    return date ? `Terminated at ${formatDate(date, 'medium', this.locale)}` : '';
  }

  getCreatedAtTooltipText(date: Date): string {
    return `${formatDate(date, 'medium', this.locale)}`;
  }
}
