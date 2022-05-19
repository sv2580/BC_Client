import { Injectable } from '@angular/core';
import { User,  UserRole } from './classes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  list: User[];
  formData:UserRole = new UserRole();
  readonly urlUser = 'https://localhost:44357/api/User'
  readonly url = 'https://localhost:44357/api/UserRole'

  headers={
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })}

  getUser(){
    return this.http.get<any>(this.urlUser);
  }

  getUsers(email: string){
    return this.http.get<User[]>(this.urlUser+"/"+email);
  }

////////////

  postUserRole(email: string){
    this.formData.user_email = email;
    return this.http.post(this.url,this.formData);
  }

  getUserRole(){
    return this.http.get<any>(this.url);
  }

  getUserRolesFromEmail(email: string){
    return this.http.get<UserRole>(this.url+"/"+email);
  }


  login(login: any){
    return this.http.post(this.urlUser+"/Login/",login);
  }
  
  editUserRole(email : string, role : string){
    this.formData.user_email = email;
    this.formData.role = role;
    return this.http.put(this.url+"/"+this.formData.user_email,this.formData);
  }

  getUserInfo(){
    return this.http.get<UserRole>(this.urlUser + '/UserInfo');
  }

}
