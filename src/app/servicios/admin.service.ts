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
  //ready$ = new BehaviorSubject<boolean>(false);

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
  inicioData(dato:any):Observable<any>{
    return this.http.post(base_url+'/admins/inicioData', dato, {'headers':this.header})
  }
  getUsers(dato:any):Observable<any>{
    return this.http.post(base_url+'/admins/getUsers', dato, {'headers':this.header})
  }
  getUserExtra(dato:any):Observable<any>{
    return this.http.post(base_url+'/admins/getUserExtra', dato, {'headers':this.header})
  }
  async getImgAdmin(dato:string, dato2:string){    
    try {
      const resp = await fetch(base_url+'/imagenes/imgCarnetAdmin?img='+dato+'&token='+dato2+'&tipo=1',{
        method: 'GET', 
        headers: {'Acces-Control-Allow-Origin':'*'},
      });

      return resp;
    } catch (error) {
      return false;
    }
  }
  async changeData(dato:any){
    try {      
      const resp = await fetch(base_url+'/admins/changeData',{
        method: 'POST', 
        headers: {'Acces-Control-Allow-Origin':'*'},
        body: dato
      });

      const data = await resp.json();
      return data;
    } catch (error) {
      return false;
    }
  }
  borrarUser(dato:any):Observable<any>{
    return this.http.post(base_url+'/admins/borrarUser', dato, {'headers':this.header})
  }
  crearPedidoAdmin(dato:any):Observable<any>{
    return this.http.post(base_url+'/admins/crearPedidoAdmin', dato, {'headers':this.header})
  }
}