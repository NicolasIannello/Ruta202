import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';

const base_url=environment.base_url2;
const token=environment.socketToken;

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;

  constructor() {
    // const applicationRef = inject(ApplicationRef);
    // applicationRef.isStable.pipe( first((isStable) => isStable) ).subscribe(() => {
    //   setTimeout(() => { 
    //     this.socket = io(base_url, {
    //       auth: {
    //         token: token,
    //       },      
    //     });
    //   });
    // });
    this.socket = io(base_url, { auth: { token: token },  autoConnect: false });
    //inject(ApplicationRef).isStable.pipe(first((isStable) => isStable)).subscribe(() => { this.socket.connect() });
  }

  public connect(){
    this.socket.connect()
  }

  public disconnect(){
    this.socket.disconnect()
  }

  public sendMessage(message: any) {
    console.log(message);
    
    this.socket.emit('message', message);
  }

  public onMessage() {
    return new Observable(observer => {
      this.socket.on('message', (message:any) => {
        observer.next(message);
      });
    });
  }
}