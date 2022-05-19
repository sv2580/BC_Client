import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { ChapterService } from "app/shared/chapter.service";
import { CourseService } from "app/shared/course.service";
import { LessonService } from "app/shared/lesson.service";
import { forkJoin, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ViewResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _courseService: CourseService,
        private _chapterService: ChapterService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return forkJoin([

            this._courseService.getCourses()
                .pipe(

                    // Error here means the requested task is not available
                    catchError((error) => {

                        // Log the error
                        console.error(error);

                        // Navigate to there
                        this._router.navigateByUrl("");

                        // Throw an error
                        return throwError(error);
                    })
                ),
            this._chapterService.getChapters()
                .pipe(

                    // Error here means the requested task is not available
                    catchError((error) => {

                        // Log the error
                        console.error(error);

                        // Navigate to there
                        this._router.navigateByUrl("");

                        // Throw an error
                        return throwError(error);
                    })
                ),
        ]);
    }
}



@Injectable({
    providedIn: 'root'
})
export class CourseResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _courseService: CourseService,
        private _chapterService: ChapterService,
        private _lessonService: LessonService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return forkJoin([

            this._courseService.getOneCourse(parseInt(route.paramMap.get('id')))
                .pipe(

                    // Error here means the requested task is not available
                    catchError((error) => {

                        // Log the error
                        console.error(error);

                        // Navigate to there
                        this._router.navigateByUrl("");

                        // Throw an error
                        return throwError(error);
                    })
                ),
            this._chapterService.getChaptersFromCourse(parseInt(route.paramMap.get('id')))
                .pipe(

                    // Error here means the requested task is not available
                    catchError((error) => {

                        // Log the error
                        console.error(error);

                        // Navigate to there
                        this._router.navigateByUrl("");

                        // Throw an error
                        return throwError(error);
                    })
                ),
            this._lessonService.getLesson()
                .pipe(

                    // Error here means the requested task is not available
                    catchError((error) => {

                        // Log the error
                        console.error(error);

                        // Navigate to there
                        this._router.navigateByUrl("");

                        // Throw an error
                        return throwError(error);
                    })
                ),
        ]);
    }
}


