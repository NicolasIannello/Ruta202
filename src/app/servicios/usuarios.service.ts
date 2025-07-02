import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  header:HttpHeaders;
  Empresa:string='';
  Email:string='';
  ID:string='';

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
  getEmpresa(){
    return this.Empresa;
  }
  getEmail(){
    return this.Email;
  }
  getID(){
    return this.ID;
  }
  logOut(){
    this.Empresa='';
    this.Email='';
    this.ID='';
    localStorage.removeItem('token');
  }
}
