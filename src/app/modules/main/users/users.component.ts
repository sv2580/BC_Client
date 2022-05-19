import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoleAuthGuard } from 'app/core/auth/guards/role-auth.guard';
import { User, UserRole } from 'app/shared/classes';
import { UserService } from 'app/shared/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit {

  constructor(public service: UserService, public formBuilder: FormBuilder,
    public router: Router,
    public roleguard : RoleAuthGuard) { }

  roleForm !: FormGroup;
  displayedColumns: string[] = ['email', 'role'];
  data: MatTableDataSource<UserRole>;
  admin : string = this.roleguard.getUser(localStorage.getItem("access_token")).user_email;

  ngOnInit(): void {
    this.getAllData();
    this.roleForm = this.formBuilder.group({
      email: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  getAllData() {
    this.service.getUserRole().subscribe({
      next: (res) => {
        this.data = new MatTableDataSource(res);
        delete this.data.data[this.roleguard.getUser(localStorage.getItem("access_token")).user_email];
        this.data.sort = new MatSort();       
        this.sortDataSource("user_email","asc");
      },
      error: (err) => {
        console.log("Error")
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
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

  getRole(user_email : string){
    this.data.data.forEach(element => {
        if(element.user_email == user_email){
          return element.role;
        }
      });
  }

  show: boolean = false;
  name: string;
  newRole : string;
  setShowTrue(email : string, value){
    this.name = email;
    this.show = true;
    this.newRole = value;
  }
  changeRole(form : NgForm, email : string){
      this.service.editUserRole(email,this.newRole).subscribe({
        next:(res)=>{
          this.getAllData();
          this.setShowTrue(email,"");
          window.alert("Rola používateľa " + email + " bola zmenená.");
        },
        error:(er)=>{
          console.log(er);
        }
      })
    }

    
  
}
