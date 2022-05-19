import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'app/shared/course.service';
import { Course } from 'app/shared/classes';
import { ChapterService } from 'app/shared/chapter.service';
import { LessonService } from 'app/shared/lesson.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-info.component.html',

  styles: [

  ]
})
export class CourseFormComponent implements OnInit {
  courseDescription !: FormGroup;
  courseTitle !: FormGroup;
  courseCompletedLessons: number = 0;
  courseLessons: number = 0;
  courseChapters: number;
  course: Course;
  desc: boolean = false;
  edit: boolean = true;

  constructor(public formBuilder: FormBuilder, public route: ActivatedRoute, public service: CourseService, public chaptService: ChapterService, public lessService: LessonService) {
    var num = 0;
    var courseId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.service.getOneCourse(courseId).subscribe({
      next: (res) => {
        this.course = res;
        if (this.course.description != "") {
          this.desc = true;
        }
        this.courseDescription = this.formBuilder.group({
          description: [this.course.description, [Validators.required, Validators.minLength(5), Validators.maxLength(256)]]
        });
        this.courseTitle = this.formBuilder.group({
          name: [this.course.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
          subject: [this.course.subject, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
        });
        this.chaptService.getChaptersFromCourse(courseId).subscribe({
          next: (result) => {
            this.courseChapters = result.length;
            result.forEach(element => {
              this.lessService.getLessonsFromChapter(element.id_chapter).subscribe({
                next: (resChapt) => {
                  this.courseLessons += resChapt.length;
                  resChapt.forEach(item => {
                    if (item.text != "") {
                      this.courseCompletedLessons++;
                    }
                  });
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
      error: (error) => {
        console.log(error)
      }
    })


  }
  addDescription() {
    if (this.courseDescription.valid) {
      var edit = new Course();
      edit.id = this.course.id;
      edit.name = this.course.name;
      edit.subject = this.course.subject;
      edit.visibility = this.course.visibility;
      edit.description = this.courseDescription.value.description;
      console.log(edit);
      this.service.editCourse(this.course.id, edit).subscribe({
        next: () => {
          this.courseDescription.reset();
          this.getDescription();
          this.desc = true;
        },
        error: (err) => {
          alert(err.error.message);
          console.log(err);
        }
      })
    }
  }

  changeTitle() {
    if (this.courseTitle.valid) {
      var edit = new Course();
      edit.id = this.course.id;
      edit.name = this.courseTitle.value.name;
      edit.subject = this.courseTitle.value.subject;
      edit.visibility = this.course.visibility;
      edit.description = this.course.description;
      this.service.editCourse(this.course.id, edit).subscribe({
        next: () => {
          this.courseTitle.reset();
          this.edit = true;
          this.service.getOneCourse(this.course.id).subscribe({
            next: (res) => {
              this.course = res;
            },
            error: (err) => {
              console.log(err)
            }
          })
        },
        error: (err) => {
          alert(err.error.message);
          console.log(err);
        }
      })
    }
  }

  getDescription() {
    this.service.getOneCourse(this.course.id).subscribe({
      next: (res) => {
        this.course.description = res.description;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  descShow() {
    this.desc = !this.desc;
  }

  editShow() {
    this.edit = !this.edit;
  }

  ngOnInit(): void {
  }

}
