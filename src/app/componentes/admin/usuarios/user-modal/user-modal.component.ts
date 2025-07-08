import { isPlatformBrowser, KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../../servicios/admin.service';
import { CommonService } from '../../../../servicios/common.service';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
export class UserModalComponent implements OnInit{
  @Output() messageEvent = new EventEmitter<null>();
  @Input() userModal:any;
  dato:any;
  img:{[key: string]: Array<string>}={
    vehiculo: [],
    frente: [],
    dorso: []
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: AdminService, private api2:CommonService) {}
    
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem('token')){
        let dato={
          'token': localStorage.getItem('token'),
          'Tipo': this.userModal['Tipo'],
          'UUID': this.userModal['UUID']
        }
        this.api.getUserExtra(dato).subscribe({
          next: (value:any) => {
            if (value.ok) {      
              this.dato=value.datoDB
              for (let i = 0; i < value.imgs.length; i++) {
                if(value.imgs[i].tipo=='vehiculo'){
                  this.api2.getImg(value.imgs[i].img, '', '').then(resp=>{
                    if(resp!=false){
                      this.img['vehiculo'].push(resp.url)
                    }
                  })
                }else{
                  this.api.getImgAdmin(value.imgs[i].img, localStorage.getItem('token')!).then(resp=>{
                    if(resp!=false){
                      this.img[value.imgs[i].tipo].push(resp.url)
                    }
                  })
                }
              }
            }
          },
          error: (err:any) => {
          },		
        });
      }
    }
  }
}
