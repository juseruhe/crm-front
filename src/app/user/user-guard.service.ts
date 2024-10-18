                                                                                                                                                                                                           
import { ActivatedRouteSnapshot, CanActivate, Router, CanDeactivate } from '@angular/router';


import { Injectable } from '@angular/core';
import { userComponent } from './user-form.component';

@Injectable()
export class userDetailGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
            alert('Invalid customer Id');
            // start a new navigation to redirect to list page
            this.router.navigate(['/customers']);
            // abort current navigation
            return false;
        };
        return true;
    }
}

@Injectable()
export class userEditGuard implements CanDeactivate<userComponent> {

    canDeactivate(component: userComponent): boolean {
        if (component.userForm.dirty) {
            let userName = component.userForm.get('firstname').value || 'New user';
            return confirm(`Navigate away and lose all changes to ${userName}?`);
        }
        return true;
    }
}
