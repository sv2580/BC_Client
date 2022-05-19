import { Injectable } from '@angular/core';
import { Chapter, Course } from './classes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identity } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class ChapterService {

  constructor(private http:HttpClient) { }

  list: Chapter[];
  formData:Chapter = new Chapter();
  readonly url = 'https://localhost:44357/api/Chapter'
  headers={
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })}
  postOneChapter(value : any){
    JSON.stringify(value);
    return this.http.post(this.url,value,this.headers);
  }

  postChapter(Id : number){
    this.formData.id_course = Id;
    return this.http.post(this.url,this.formData);
  }

  getChapters(){
    return this.http.get<any>(this.url);
  }

  getChaptersFromCourse(id: number){
    return this.http.get<Chapter[]>(this.url+"/"+id,);
  }

  deleteChapter(id : number){
    return this.http.delete(this.url+"/"+id);
  }
  
  editChapter(id : number, value : any){
    return this.http.put(this.url+"/"+id,value);
  }
  
  refreshList() {
    this.http.get(this.url)
      .toPromise()
      .then(res =>this.list = res as Chapter[]);
  }
}
