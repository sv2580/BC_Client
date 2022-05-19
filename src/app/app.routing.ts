import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { CourseEditComponent } from './modules/main/course-edit/course-edit.component';
import { CourseFormComponent } from './modules/main/course-edit/course-form/course-info.component';
import { LessonFormComponent } from './modules/main/course-edit/course-form/lesson-form/lesson-form.component';
import { ChapterFormComponent } from './modules/main/course-edit/course-form/chapter-form/chapter-form.component';
import { TextFormComponent } from './modules/main/course-edit/course-form/text-form/text-form.component';
import { UsersComponent } from './modules/main/users/users.component';
import { ViewCoursesComponent } from './modules/main/view-courses/view-courses.component';
import { ViewOneCourseComponent } from './modules/main/view-courses/view-one-course/view-one-course.component';
import { RoleAuthGuard } from './core/auth/guards/role-auth.guard';
import { authSignInRoutes } from './modules/auth/sign-in/sign-in.routing';
import { CourseResolver, ViewResolver } from './modules/main/view-courses/view-courses.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'sign-in' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'view' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [

            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },


        ]
    },
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },

        children: [
            
        ]
    },
    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },

        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
        ]
    },

    // Landing routes
    {
        path: '',
        canActivate: [AuthGuard],
        component: LayoutComponent,
       
        children: [
            {

                path: 'view', children: [
                    { path: '', component: ViewCoursesComponent,
                     resolve: {
                        data: ViewResolver,
    
                    },},
                    { path: ':id', component: ViewOneCourseComponent,
                    resolve: {
                        data: CourseResolver,
    
                    }, },
                ]
            },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard, RoleAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {
            role: 'admin'
        },
        children: [
            { path: 'admin', component: UsersComponent, }]
    },

    {
        path: '',
        canActivate: [AuthGuard, RoleAuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {
            role: 'teacher admin'
        },
        children: [
            {
                path: 'courses', children: [
                    { path: '', loadChildren: () => import('app/modules/main/main.module').then(m => m.ExampleModule) },
                    { path: 'edit-courses', component: CourseEditComponent },
                    {
                        path: 'edit/:id', component: CourseFormComponent, children: [
                            { path: '', component: ChapterFormComponent },
                            { path: 'chapter/:id_chapter', component: LessonFormComponent },
                            { path: 'lesson/:id_lesson', component: TextFormComponent }
                        ]
                    },
                ]
            },
        ]
    }
];
