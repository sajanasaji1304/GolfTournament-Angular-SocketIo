import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://mst-full-stack-dev-test.herokuapp.com/');
  }

  public onDataUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('data-update', (data: any) => {
        observer.next(data);
      });
    });
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public connect() {
    this.socket.connect();
  }
}





