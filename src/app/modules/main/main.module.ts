import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {MatTableModule} from '@angular/material/table'
import { Route, RouterModule } from '@angular/router';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { FuseCardModule } from '@fuse/components/card'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { CourseFormComponent } from './course-edit/course-form/course-info.component';
import { ChapterFormComponent } from './course-edit/course-form/chapter-form/chapter-form.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { LessonFormComponent } from './course-edit/course-form/lesson-form/lesson-form.component';
import { TextFormComponent } from './course-edit/course-form/text-form/text-form.component';
import { UsersComponent } from './users/users.component';
import { QuillModule } from 'ngx-quill';
import { ViewCoursesComponent } from './view-courses/view-courses.component';
import { ViewOneCourseComponent } from './view-courses/view-one-course/view-one-course.component';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CourseDialogComponent } from './course-edit/course-dialog/course-dialog.component';
import { FuseAlertModule } from '@fuse/components/alert';

const exampleRoutes: Route[] = [
    {
        path     : '',
       
    }
    
];

@NgModule({
    declarations: [
        CourseEditComponent,
        CourseFormComponent,
        ChapterFormComponent,
        LessonFormComponent,
        TextFormComponent,
        UsersComponent,
        ViewCoursesComponent,
        ViewOneCourseComponent,
        CourseDialogComponent
    ],
    imports     : [
        QuillModule.forRoot(),
        MatDialogModule,

         RouterModule.forChild(exampleRoutes),
        FormsModule,
        CommonModule,
        MatButtonToggleModule,
        MatTabsModule,
        FuseCardModule,
        MatTableModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        MatSelectModule,
        SharedModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        MatTabsModule,
        FuseAlertModule,

    ]
})
export class ExampleModule
{
}
