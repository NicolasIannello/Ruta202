import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService{
  header:HttpHeaders;
  Empresa:string='';
  Email:string='';
  ID:string='';
  UUID:string='';
  Tipo:string='';
  ready$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
  }

  async crearUsuario(dato:any){
    try {
      const resp = await fetch(base_url+'/usuarios/crearUsuario',{
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
  validarCuenta(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/validar', dato, {'headers':this.header})
  }
  reValidarCuenta(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/reValidar', dato, {'headers':this.header})
  }
  login(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/login', dato, {'headers':this.header})
  }
  setEmpresa(emp:string){
    this.Empresa=emp;
  }
  setEmail(mail:string){
    this.Email=mail;
  }
  setID(id:string){
    this.ID=id;
  }
  setUUID(uuid:string){
    this.UUID=uuid;
  }
  setTipo(tipo:string){
    this.Tipo=tipo
  }
  getEmpresa(){
    return this.Empresa;
  }
  getEmail(){
    return this.Email;
  }
  getID(){
    return this.ID;
  }
  getUUID(){
    return this.UUID;
  }
  getTipo(){
    return this.Tipo;
  }
  logOut(){
    this.Empresa='';
    this.Email='';
    this.ID='';
    localStorage.removeItem('token');
    window.location.reload();
  }
  renewToken(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/renew', dato, {'headers':this.header})
  }
  forgotPassword(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/forgotPassword', dato, {'headers':this.header})
  }
  changePassword(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/changePassword', dato, {'headers':this.header})
  }
  getUserData(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/getUserData', dato, {'headers':this.header})
  }
  async changeData(dato:any){
    try {
      const resp = await fetch(base_url+'/usuarios/changeData',{
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
  getPedido(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/verPedido', dato, {'headers':this.header})
  }
  getOfertaPedido(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/getOfertaPedido', dato, {'headers':this.header})
  }
  async subirOrden(dato:any){
    try {
      const resp = await fetch(base_url+'/usuarios/subirOrden',{
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
  getOfertas(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/getOfertas', dato, {'headers':this.header})
  }
  async firmar(dato:any){
    try {
      const resp = await fetch(base_url+'/usuarios/firmar',{
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
}
