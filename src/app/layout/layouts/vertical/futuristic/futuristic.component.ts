import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService } from '@fuse/components/navigation';
import { InitialData } from 'app/app.types';
import { CourseService } from 'app/shared/course.service';
import { UserService } from 'app/shared/user.service';
import { UserRole } from 'app/shared/classes';
import { RoleAuthGuard } from 'app/core/auth/guards/role-auth.guard';

@Component({
    selector     : 'futuristic-layout',
    templateUrl  : './futuristic.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FuturisticLayoutComponent implements OnInit, OnDestroy
{
    CourseList:any=[];
    role : string; 
    data: InitialData;
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public user : any;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private service: CourseService,
        private roles : RoleAuthGuard 
    )
    {
    }
    

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.user = this.roles.getUser(localStorage.getItem('access_token'));
        // Subscribe to the resolved route mock-api
        this._activatedRoute.data.subscribe((data: Data) => {
            this.data = data.initialData;
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }


      signOut()
      {
          this._router.navigate(['/sign-out']);
      }
      
}
