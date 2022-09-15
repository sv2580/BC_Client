import { Component, Injectable, OnInit } from '@angular/core';
import { ChapterService } from 'app/shared/chapter.service';
import { Course } from 'app/shared/classes';
import { CourseService } from 'app/shared/course.service';
import { FuseAnimations } from '@fuse/animations';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-view-courses',
  templateUrl: './view-courses.component.html',
  styles: [
  ],
  animations: FuseAnimations
})
export class ViewCoursesComponent implements OnInit {

  constructor(public serviceCourse: CourseService,
    public serviceChapter: ChapterService,
    public router: Router) { }
  CourseList: Course[];
  numbers: number[] = [];
  numberOfCourses: number = 0;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {

    this.serviceCourse.getCourses().subscribe(data => {
      let list: Course[] = data;
      if (list.length > 0) {
        this.CourseList = list.filter(this.isVisible);
        var index = 0;
        this.CourseList.forEach(element => {
          if (element.visibility) {
            this.numberOfCourses++;
            this.serviceChapter.getChaptersFromCourse(element.id).subscribe({
              next: (res) => {
                this.numbers.push(res.length);
              },
              error: (err) => {
                console.log(err)
              }
            })
            index++;
          }
        });
      }
    });
  }

  isVisible(course: Course) {
    return course.visibility;
  }

  showNumberOfChapters(i: number) {
    return this.numbers[i];
  }
  viewCourse(id: number) {
    this.router.navigate(['/view/', id]);
  }
}

