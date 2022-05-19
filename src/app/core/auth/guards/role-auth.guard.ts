import { Injectable } from '@angular/core';
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { User, UserRole } from 'app/shared/classes';
import { UserService } from 'app/shared/user.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _userService: UserService
    ) {

    }

    user: UserRole;

    //--------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    public getUser(token: string): UserRole | null {
        if (!token) {
            return null
        }
        return JSON.parse(atob(token.split('.')[1])) as UserRole;
    }

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {
        this.user = this.getUser(localStorage.getItem('access_token'));
        var result = String(route.data.role).includes(this.user.role);
        if (!result) {
            window.alert("Nemáte prístup k tejto stránke!");
            if (this.user == null)
                this._router.navigate(['sign-in']);
            else(this._router.navigate(['view']))
        }
        return result;
    }
}
