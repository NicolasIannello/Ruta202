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
}
