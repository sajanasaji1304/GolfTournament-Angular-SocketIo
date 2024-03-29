import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './service/socket.service';
import {  Subject,bufferTime,interval,repeat,  switchMap, takeUntil, tap, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, MatTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[SocketService]
})
export class AppComponent implements OnInit {
  socketData: any;
  dataUpdates: any[] = [];
  firstDataReceived = false;
  dataSource!: MatTableDataSource<any>
  displayedColumns: string[] = [
    'First',
    'Last',
    'Nationality',
    'Hole1Strokes',
    'Hole1STP',
    'Hole2Strokes',
    'Hole2STP',
    'Hole3Strokes',
    'Hole3STP',
    'Hole4Strokes',
    'Hole4STP',
    'Hole5Strokes',
    'Hole5STP',
    'Hole6Strokes',
    'Hole6STP',
    'Hole7Strokes',
    'Hole7STP',
    'Hole8Strokes',
    'Hole8STP',
    'Hole9Strokes',
    'Hole9STP',
    'OutStrokes',
    'OutSTP',
    'Hole10Strokes',
    'Hole10STP',
    'Hole11Strokes',
    'Hole11STP',
    'Hole12Strokes',
    'Hole12STP',
    'Hole13Strokes',
    'Hole13STP',
    'Hole14Strokes',
    'Hole14STP',
    'Hole15Strokes',
    'Hole15STP',
    'Hole16Strokes',
    'Hole16STP',
    'Hole17Strokes',
    'Hole17STP',
    'Hole18Strokes',
    'Hole18STP',
    'InStrokes',
    'InSTP',
    'TotalStrokes',
    'TotalSTP',
    'tournamentID',
    'round',
    'orderInMatch',
    'lastUpdated',
    'status',
    'leaderboardID',
    'teeStart',
    'teeTime',
    'holesPlayed',
    'course',
    'matchID',
    'Amature',
    'isTeam',
    'CalculatedRankInteger',
    'position',
    'UniquePosition',
    'TVName',
    'Eastern',
    'Handicap',
    'SortPriority',
    'Sex'
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(private socketService: SocketService, private zone: NgZone,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
    this.getData()  
    })
} 

getData() {
  interval(10000) 
    .pipe(
      takeUntil(this.unsubscribe$), 
      switchMap(() => { 
        console.log('Inside switchMap');
        this.socketService.connect();
        console.log('Connected');

        return this.socketService.onDataUpdate().pipe(
          takeUntil(interval(10000)), 
          tap(data => { 
            console.log('Data received:', data);
            this.dataUpdates.unshift(data);
            this.dataSource = new MatTableDataSource(this.dataUpdates);
            this.firstDataReceived = true;
            this.cdr.detectChanges();
          })
        );
      }),
      tap(() => { 
        console.log('Subscription to onDataUpdate stopped after 10 seconds');
        this.socketService.disconnect();
      }),
    )
    .subscribe(() => {}); 
}
  
ngOnDestroy() {
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}
}
