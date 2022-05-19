import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChapterService } from 'app/shared/chapter.service';
import { Course, Lesson } from 'app/shared/classes';
import { CourseService } from 'app/shared/course.service';
import { LessonService } from 'app/shared/lesson.service';
import { forkJoin, Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-one-course',
  templateUrl: './view-one-course.component.html',
  styles: [
  ]
})
export class ViewOneCourseComponent implements OnInit {
  id: number;
  course: Course = new Course();
  lesson: Lesson[];
  selectedChapter: number = -1;
  selectedLessons: Lesson[];
  selectedLength: number = -1;
  completed: number = 1;
  text: string;
  @ViewChild('lesson', { static: true }) lessons: MatTabGroup;
  currentStep: number = 0;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(public serviceChapt: ChapterService,
    public serviceLess: LessonService,
    public serviceCour: CourseService,
    public router: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,


  ) { }

  ngOnInit(): void {
    this.id = parseInt(this.router.snapshot.paramMap.get('id'));
    this.serviceCour.getOneCourse(this.id).subscribe(data => {
      this.course = data;
      this.completed = 0;
      this.currentStep = 0;

    });
    this.serviceChapt.getChaptersFromCourse(this.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.course.chapters = data;
      this.course.chapters.sort(function (a, b) {
        return a.rank - b.rank;
      });

      this.course.chapters.forEach(element => {
        this.serviceLess.getLessonsFromChapter(element.id_chapter).pipe(takeUntil(this._unsubscribeAll)).subscribe(datas => {
          element.lessons = datas;
          this.selectedLessons = this.course.chapters[0].lessons;
          this.selectedLessons.sort((a, b) => (a.rank < b.rank ? -1 : 1));
          this.selectedLength = this.selectedLessons.length;
          this.goToStep(this.currentStep);
        });
      });
    });


    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {

      // Set the drawerMode and drawerOpened
      if (matchingAliases.includes('lg')) {
        this.drawerMode = 'side';
        this.drawerOpened = true;
      }
      else {
        this.drawerMode = 'over';
        this.drawerOpened = false;
      }

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }
  goToStep(step: number): void {
    // Set the current step
    this.currentStep = step;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    this.text = this.selectedLessons[this.currentStep].text;
  }

  goToPreviousStep(): void {
    // Return if we already on the first step
    if (this.currentStep === 0) {
      return;
    }

    // Go to step
    this.goToStep(this.currentStep - 1);

    // Scroll the current step selector from sidenav into view
    //this._scrollCurrentStepElementIntoView();
  }

  goToNextStep(): void {
    // Return if we already on the last step
    if (this.currentStep === this.selectedLessons.length - 1) {
      return;
    }

    // Go to step
    this.goToStep(this.currentStep + 1);


    // Scroll the current step selector from sidenav into view
    this._scrollCurrentStepElementIntoView();
  }

  onClick(id: number) {
    if (this.selectedChapter == id) {
      this.selectedChapter = -1;

    } else {
      this.selectedChapter = id;
      this.course.chapters.forEach(element => {
        if (element.id_chapter == id) {
          this.selectedLessons = element.lessons;
          this.selectedLessons.sort((a, b) => (a.rank < b.rank ? -1 : 1));

        }
        this.completed = 0;
        this.currentStep = 0;
      });
    }
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


  private _scrollCurrentStepElementIntoView(): void {
    // Wrap everything into setTimeout so we can make sure that the 'current-step' class points to correct element
    setTimeout(() => {

      // Get the current step element and scroll it into view
      const currentStepElement = this._document.getElementsByClassName('lessons')[0];
      if (currentStepElement) {
        currentStepElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}
