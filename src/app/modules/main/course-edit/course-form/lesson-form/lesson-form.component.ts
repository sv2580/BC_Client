import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../../../../shared/lesson.service';
import { Chapter, Lesson } from 'app/shared/classes';
import { ChapterService } from 'app/shared/chapter.service';
import { MatSort, MatSortable } from '@angular/material/sort';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
  selector: 'app-lesson-form',
  templateUrl: './lesson-form.component.html',

  styles: [
  ]
})
export class LessonFormComponent implements OnInit {

  displayedColumns: string[] = ['rank', 'name', 'edit', 'position'];
  data: MatTableDataSource<Lesson>;
  dataSource: Lesson[];
  lessonForm !: FormGroup;
  chapter: Chapter = new Chapter;
  numberOfElements: number;
  constructor(public service: LessonService,
    public chaptService: ChapterService,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public router: Router) { }
    
  editChapterForm !: FormGroup;
  edit: boolean = false;

  alertShow: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
    type   : 'warning',
    message: ''
  };

  maxHide: boolean = false;

  ngOnInit(): void {
    this.chaptService.getChapters().subscribe({
      next: (res) => {
        this.chapter = res.find(element => element.id_chapter == parseInt(this.route.snapshot.paramMap.get('id_chapter')));
        this.editChapterForm = this.formBuilder.group({
          name: [this.chapter.name,  [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        });
        this.getAllLessons(this.chapter.id_chapter);
      },

      error: (err) => {
        console.log(err)
      }
    })
    this.lessonForm = this.formBuilder.group({
      name: ['',  [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      id_course: []
    });
  }

  public show: boolean = false;
  toggle() {
    this.show = !this.show;
  }

  getAllLessons(id: number) {
    this.service.getLessonsFromChapter(id).subscribe({
      next: (res) => {
        console.log(res);
        this.data = new MatTableDataSource<Lesson>(res);
        this.data.sort = new MatSort();
        this.numberOfElements = this.data.data.length;
        this.sortDataSource("rank", "asc");
      },

      error: (err) => {
        console.log(err)
      }
    })
  }


  addLesson() {
    if(this.lessonForm.valid){
      var lesson = new Lesson();
      lesson.id_chapter = parseInt(this.route.snapshot.paramMap.get('id_chapter'));
      lesson.name = this.lessonForm.value.name;
    this.service.postOneLesson(JSON.stringify(lesson)).subscribe({
      next: () => {
        this.service.refreshList();
        this.getAllLessons(this.chapter.id_chapter);
        this.alertShow = false;
      },
      error: (err) => {  console.log(err);
        this.alert.message = err.error.message;
        this.alertShow = true;
      }
    });}
  }

  showEditTitle() {
    this.edit = !this.edit;
  }

  editTitle() {
    var edit = new Chapter();
    edit.id_chapter = this.chapter.id_chapter;
    edit.id_course = this.chapter.id_course;
    edit.name = this.editChapterForm.value.name;
    edit.rank = this.chapter.rank;
    this.chaptService.editChapter(this.chapter.id_chapter, edit).subscribe(
      _res => {
        this.chaptService.getChapters().subscribe({
          next: (result) => {
            this.chapter = result.find(element => element.id_chapter == parseInt(this.route.snapshot.paramMap.get('id_chapter')));
            this.edit = false;
          },

          error: (err) => {
            console.log(err)
          }
        })
      },
      err => { console.log(err);
        alert(err.error.message); }
    );
  }


  editLesson(id: number) {
    this.router.navigate(['/courses/edit/', this.chapter.id_course, 'lesson', id]);
  }

  deleteLesson(id: number) {
    this.service.deleteLesson(id).subscribe({
      next: (res) => {
        this.getAllLessons(this.chapter.id_chapter);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  upRank(rank: number) {
    var thisLesson, nextLesson;
    this.data.data.forEach(element => {
      if (element.rank == rank) {
        thisLesson = element;
      }
      if (element.rank == rank - 1) {
        nextLesson = element;
      }
    });

    var lesson = new Lesson();
    lesson.id_chapter = thisLesson.id_chapter;
    lesson.id_lesson = thisLesson.Id_course;
    lesson.name = thisLesson.name;
    lesson.rank = rank - 1;
    lesson.text = thisLesson.text;

    this.service.editLesson(thisLesson.id_lesson, lesson).subscribe({
      next: () => {
        lesson = new Lesson();
        lesson.id_chapter = nextLesson.id_lessoner;
        lesson.id_lesson = nextLesson.id_lesson;
        lesson.name = nextLesson.name;
        lesson.rank = rank;
        lesson.text = nextLesson.text;

        this.service.editLesson(nextLesson.id_lesson, lesson).subscribe({
          next: () => {
            this.getAllLessons(this.chapter.id_chapter);
          },
          error: (error) => {
            console.log(error)
          }
        });
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  downRank(rank: number) {
    var thisLesson, prevLesson;
    this.data.data.forEach(element => {
      if (element.rank == rank) {
        thisLesson = element;
      }
      if (element.rank == rank + 1) {
        prevLesson = element;
      }
    });

    var lesson = new Lesson();
    lesson.id_chapter = thisLesson.id_chapter;
    lesson.id_lesson = thisLesson.id_lesson;
    lesson.name = thisLesson.name;
    lesson.rank = rank + 1;
    lesson.text = thisLesson.text;

    this.service.editLesson(thisLesson.id_lesson, lesson).subscribe({
      next: () => {
        lesson = new Lesson();
        lesson.id_chapter = prevLesson.id_lessoner;
        lesson.id_lesson = prevLesson.id_lesson;
        lesson.name = prevLesson.name;
        lesson.rank = rank;
        lesson.text = prevLesson.text;

        this.service.editLesson(prevLesson.id_lesson, lesson).subscribe({
          next: () => {
            this.getAllLessons(this.chapter.id_chapter);
          },
          error: (error) => {
            console.log(error)
          }
        });
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  sortDataSource(id: string, start: string) {
    if (this.data != undefined) {
      this.data.sort.sort(<MatSortable>({ id: id, start: start }));
      this.data.data.sort((a: any, b: any) => {
        if (a.createdDate < b.createdDate) {
          return -1;
        } else if (a.createdDate > b.createdDate) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }


}



