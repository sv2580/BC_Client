import { Component, OnInit } from '@angular/core';
import { Course } from '../../../shared/classes';
import { CourseService } from '../../../shared/course.service';
import { MatTableDataSource } from '@angular/material/table'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { MatSort, MatSortable } from '@angular/material/sort';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-course',
  templateUrl: './course-edit.component.html',
  animations   : FuseAnimations,
  styles: [
  ]
})
export class CourseEditComponent implements OnInit {

  constructor(public _coursesService: CourseService, public formBuilder: FormBuilder,
    public router: Router,
    public dialog: MatDialog) { }
  courseForm !: FormGroup;
  displayedColumns: string[] = ['name', 'subject', 'edit', 'visibility'];
  data: MatTableDataSource<Course>;
  resize: boolean;
  alert: { type: FuseAlertType, message: string } = {
    type   : 'warning',
    message: ''
};
signInForm: FormGroup;
showAlert: boolean = false;

  ngOnInit(): void {
    if (window.screen.width === 360) { // 768px portrait
      this.resize = true;
    }
    this._coursesService.refreshList();
    this.getAllCourses();
    this.courseForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    });
  }


  getAllCourses() {
    this._coursesService.getCourses().subscribe({
      next: (res) => {
        this.data = new MatTableDataSource(res);
        
        this.data.sort = new MatSort();
        this.sortDataSource("name","asc");
      },

      error: (err) => {
        console.log(err)
      }
    })
  }

  editCourse(id: number) {
    this.router.navigate(['/courses/edit', id]);
  }
  public show: boolean = false;
  toggle() {
    this.show = !this.show;
  }

  changeVisibility(id: number) {
    for (let index = 0; index < this.data.data.length; index++) {
      const element = this.data.data[index];
      if (element.id == id) {
        var chapt = new Course();
        chapt.id = id;
        chapt.name = element.name;
        chapt.subject = element.subject;
        chapt.visibility = !element.visibility;
        chapt.description = element.description;
        this._coursesService.editCourse(id, chapt).subscribe({
          next: (_res) => {
            this.getAllCourses();
          },
          error: (err) => {
            console.log(err)
          }
        });

      }
    }
  }

  addCourse(_id: number) {
    if (this.courseForm.invalid) {
      return;
    }

    if (this.courseForm.valid) {
      this._coursesService.postOneCourse(this.courseForm.value).subscribe({
        next: (_res) => {
          alert("Kurz bol pridaný, teraz môžete pridať učebné materiály a následne ho zverejniť.");
          this.courseForm.reset();
          this.getAllCourses();
        },
        error: (err) => {
          console.log(err);
          this.alert.message = err.error.message;
          this.showAlert = true;
        }
      })
    }
  }

  deleteCourse(id: number) {
    if (confirm("Naozaj chcete zmazať tento kurz a všetky jeho kapitoly a lekcie?")) {
      this._coursesService.deleteCourse(id).subscribe({
        next: (_res) => {
          this.getAllCourses();
        },
        error: (_err) => {
          console.log("_err")
        }
      })
    }
  }


  openDialog(elementId: number) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      elementId,
    };

    const dialogRef = this.dialog.open(CourseDialogComponent,
      dialogConfig);


    dialogRef.afterClosed().subscribe(
      val => {
        if (val == true) {
          this.changeVisibility(elementId);
        }
      }
    );
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
