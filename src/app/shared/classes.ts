import { ChapterService } from "./chapter.service";

export class Course {
    id:number=0;
    name:string="";
    subject:string="";
    visibility:boolean;
    description:string="";
    chapters:Chapter[];
}

export class Chapter {
    id_chapter:number=0;
    name:string="";
    rank:number=0;
    id_course:number=0;
    lessons:Lesson[];
}

export class Lesson {
    id_lesson:number=0;
    name:string="";
    rank:number=0;
    id_chapter:number=0;
    text : string="";
}

export class User {
    user_email : string = "";
    user_password : string = "";
}

export class UserRole {
    user_email : string = "";
    role : string = "";
}