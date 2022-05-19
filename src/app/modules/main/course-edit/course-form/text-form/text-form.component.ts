import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'app/shared/classes';
import { LessonService } from 'app/shared/lesson.service';

@Component({
  selector: 'app-text-form',
  templateUrl: './text-form.component.html',
  styles: [
  ]
})
export class TextFormComponent implements OnInit {
  TextForm !: FormGroup;
  TitleForm !: FormGroup;

  lessonId: number;
  text: string = "";
  edit: boolean = false;
  lesson: Lesson;
  selectedLesson : number;
  editTitle : boolean = false;
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'image', 'video']                         // link and image, video
    ]
  };


  constructor(public service: LessonService,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public router: Router) { }

  ngOnInit(): void {
    this.text = "";
    this.lessonId = parseInt(this.route.snapshot.paramMap.get('id_lesson'));
    this.TextForm = this.formBuilder.group({
      text: ['', Validators.required],
    });
    this.getText();
    
  }

 getText() {
    this.service.getLesson().subscribe({
      next: (res) => {
        res.forEach(element => {
          if (element.id_lesson == this.lessonId) {
            this.lesson = element;
            this.TitleForm = this.formBuilder.group({
              name: [this.lesson.name,  [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
            });
            this.text = this.lesson.text;
            if(this.text == ""){
              this.edit = true;
            } else {
              this.edit = false;
            }
          }
        });
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  showEdit() {
    this.edit = !this.edit;
  }
  
  showEditTitle() {
    this.editTitle = !this.editTitle;
  } 

  editText() {
    this.lesson.text = this.TextForm.value.text;
    this.service.editLesson(this.lessonId, this.lesson).subscribe({
      next: () => {
        this.TextForm.reset();
        this.getText();
        this.text = this.lesson.text;
      },
      error: (err) => {
        alert(err.error.message);      }
    })
  }

  editLesson() {
    var edit = new Lesson();
    edit.id_chapter = this.lesson.id_chapter;
    edit.id_lesson = this.lesson.id_lesson;
    edit.name = this.TitleForm.value.name;
    edit.rank = this.lesson.rank;
    edit.text = this.lesson.text;
    this.service.editLesson(this.lessonId, edit).subscribe({
      next: () => {
        this.TextForm.reset();
        this.getText();
        this.text = this.lesson.text;
      },
      error: (err) => {
        alert(err.error.message);      }
    })
  }


  deleteText() {
    this.lesson.text = "";

    this.service.editLesson(this.lessonId, this.lesson).subscribe({
      next: () => {
        this.TextForm.reset();
        this.text = "";
        this.getText();
        this.showEdit();
      },
      error: (err) => {
        alert(err)
      }
    })
  }


  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }

}
