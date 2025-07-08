import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  header:HttpHeaders;
  Admin:string='';
  ID:string='';
  ready$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
  }

  setAdmin(emp:string){
    this.Admin=emp;
  }
  setID(id:string){
    this.ID=id;
  }
  getAdmin(){
    return this.Admin;
  }
  getID(){
    return this.ID;
  }
  logOut(){
    this.Admin='';
    this.ID='';
    localStorage.removeItem('token');
    window.location.reload();
  }
  login(dato:any):Observable<any>{
    return this.http.post(base_url+'/admins/login', dato, {'headers':this.header})
  }
  renewToken(dato:any):Observable<any>{
    return this.http.post(base_url+'/admins/renew', dato, {'headers':this.header})
  }
}
