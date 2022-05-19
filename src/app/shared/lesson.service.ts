import { Injectable } from '@angular/core';
import { Lesson, Course } from './classes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identity } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http:HttpClient) { }

  list: Lesson[];
  formData:Lesson = new Lesson();
  readonly url = 'https://localhost:44357/api/Lesson'
  headers={
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })}
  postOneLesson(value : any){
    JSON.stringify(value);
    return this.http.post(this.url,value,this.headers);
  }

  postLesson(Id : number){
    this.formData.id_chapter = Id;
    return this.http.post(this.url,this.formData);
  }


  getLesson(){
    return this.http.get<any>(this.url);
  }

  getLessonsFromChapter(id: number){
  
    return this.http.get<Lesson[]>(this.url+"/"+id);
  }

  deleteLesson(id : number){
    return this.http.delete(this.url+"/"+id);
  }
  
  editLesson(id : number, value : any){
    return this.http.put(this.url+"/"+id,value);
  }
  
  refreshList() {
    this.http.get(this.url)
      .toPromise()
      .then(res =>this.list = res as Lesson[]);
  }
}
