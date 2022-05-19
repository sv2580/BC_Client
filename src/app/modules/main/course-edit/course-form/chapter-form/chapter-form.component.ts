import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ChapterService } from 'app/shared/chapter.service';
import { Chapter, Course } from 'app/shared/classes';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort, MatSortable } from '@angular/material/sort';
import { CourseService } from 'app/shared/course.service';
import { FuseAlertType } from '@fuse/components/alert';
@Component({
  selector: 'app-chapter-form',
  templateUrl: './chapter-form.component.html',
  styles: [

  ]
})
export class ChapterFormComponent implements OnInit {
  displayedColumns: string[] = ['rank', 'name', 'edit', 'position'];
  data: MatTableDataSource<Chapter> = new MatTableDataSource<Chapter>();
  dataSource: Chapter[];
  chapterForm !: FormGroup;

  constructor(public service: ChapterService,
    public courseService: CourseService,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public router: Router) { }
  course: Course = new Course;
  numberOfElements: number;
  maxHide: boolean = false;
  alertShow: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
    type: 'warning',
    message: ''
  };


  ngOnInit(): void {
    this.service.refreshList();
    this.chapterForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      id_course: []
    });
    this.courseService.getOneCourse(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: (res) => {
        this.course = res;
        this.getAllChapters(this.course.id);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  public show: boolean = false;
  toggle() {
    this.show = !this.show;
  }

  getAllChapters(id: number) {
    this.service.getChaptersFromCourse(id).subscribe({
      next: (res) => {
        this.data = new MatTableDataSource<Chapter>(res);
        this.data.sort = new MatSort();
        this.numberOfElements = this.data.data.length;
        this.sortDataSource("rank", "asc");
        if (res.length >= 30)
          this.maxHide = true;
        else
          this.maxHide = false;

      },

      error: (err) => {
        console.log(err)
      }
    })

  }

  addChapter() {
    if (this.chapterForm.invalid) {
      return;
    }

    if (this.chapterForm.valid) {
      var chapt = new Chapter();
      chapt.id_course = this.course.id;
      chapt.name = this.chapterForm.value.name;
      this.service.postOneChapter(JSON.stringify(chapt)).subscribe({
        next: () => {
          this.chapterForm.reset();
          this.getAllChapters(this.course.id);
        },
        error: (err) => {
          console.log(err);
          this.alert.message = err.error.message;
          this.alertShow = true;
        }
      })
    }
  }


  editChapter(id: number) {
    this.router.navigate(['/courses/edit/', this.course.id, 'chapter', id]);
  }

  deleteChapter(id: number) {
    this.service.deleteChapter(id).subscribe({
      next: () => {
        this.getAllChapters(this.course.id);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  upRank(rank: number) {
    var thisChapter, prevChapter;
    this.data.data.forEach(element => {
      if (element.rank == rank) {
        thisChapter = element;
      }

      if (element.rank == rank - 1) {
        prevChapter = element;
      }
    });
    var chapt = new Chapter();
    chapt.id_chapter = thisChapter.id;
    chapt.id_course = thisChapter.Id_course;
    chapt.name = thisChapter.name;
    chapt.rank = rank - 1;
    this.service.editChapter(thisChapter.id_chapter, chapt).subscribe({
      next: () => {
        chapt = new Chapter();
        chapt.id_chapter = prevChapter.id_chapter;
        chapt.id_course = prevChapter.Id_course;
        chapt.name = prevChapter.name;
        chapt.rank = rank;

        this.service.editChapter(prevChapter.id_chapter, chapt).subscribe({
          next: () => {
            this.getAllChapters(this.course.id);
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
    var thisChapter, nextChapter;
    this.data.data.forEach(element => {
      if (element.rank == rank) {
        thisChapter = element;
      }

      if (element.rank == rank + 1) {
        nextChapter = element;
      }
    });

    var chapt = new Chapter();
    chapt.id_chapter = thisChapter.id;
    chapt.id_course = thisChapter.Id_course;
    chapt.name = thisChapter.name;
    chapt.rank = rank + 1;
    this.service.editChapter(thisChapter.id_chapter, chapt).subscribe({
      next: () => {
        chapt = new Chapter();
        chapt.id_chapter = nextChapter.id_chapter;
        chapt.id_course = nextChapter.Id_course;
        chapt.name = nextChapter.name;
        chapt.rank = rank;

        this.service.editChapter(nextChapter.id_chapter, chapt).subscribe({
          next: () => {
            this.getAllChapters(this.course.id);
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


