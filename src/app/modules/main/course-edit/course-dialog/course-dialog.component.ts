import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { ChapterService } from 'app/shared/chapter.service';
import { CourseService } from 'app/shared/course.service';
import { LessonFormComponent } from '../course-form/lesson-form/lesson-form.component';
import { LessonService } from 'app/shared/lesson.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
})
export class CourseDialogComponent implements OnInit {
  name: string;
  chapters: number;
  lessons: number = 0;
  doneLessons: number = 0;
  emptyLessons: number;

  constructor(
    private chaptService: ChapterService,
    private service: CourseService,
    private lessService: LessonService,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) { elementId }) {

    this.service.getOneCourse(elementId).subscribe({
      next: (res) => {
        this.name = res.name;
        this.chaptService.getChaptersFromCourse(elementId).subscribe({
          next: (result) => {
            this.chapters = result.length;
            result.forEach(element => {
              this.lessService.getLessonsFromChapter(element.id_chapter).subscribe({
                next: (resChapt) => {
                  this.lessons += resChapt.length;
                  resChapt.forEach(element => {
                    if (element.text != "") {
                      this.doneLessons++;
                    }
                  });
                this.emptyLessons = this.lessons  - this.doneLessons;
                },
                error: (err) => {
                  console.log(err)
                }
              })

            });
          },
          error: (err) => {
            console.log(err)
          }
        })
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  ngOnInit() {

  }


  close(value: boolean) {
    this.dialogRef.close(value);
  }

}

