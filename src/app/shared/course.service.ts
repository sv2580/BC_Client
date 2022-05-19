import { Injectable } from '@angular/core';
import { Course } from './classes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identity } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http:HttpClient) { }

  list: Course[];
  formData:Course = new Course();
  readonly url = 'https://localhost:44357/api/Course'
  postCourse(){
    return this.http.post(this.url,this.formData);
  }


  postOneCourse(value : any){
    return this.http.post(this.url,value);
  }

  getCourses(){
    return this.http.get<any>(this.url);
  }

  getOneCourse(id : number){
    return this.http.get<Course>(this.url + "/" + id);
  }
 
  editCourse(id : number, value : any){
    return this.http.put(this.url+"/"+id,value);
  }
  deleteCourse(id : number){
    return this.http.delete(this.url+"/"+id);
  }
  
  refreshList() {
    this.http.get(this.url)
      .toPromise()
      .then(res =>this.list = res as Course[]);
  }
}
