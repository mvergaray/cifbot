import { Component, OnInit } from '@angular/core';
import {
    NavigationService,
    Page,
} from '../../services/navigation/navigation.service';
import { NavRoute } from '../../../nav-routing';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    isOpen = true;
    isAdmin;

    constructor(
        private navigationService: NavigationService,
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) {
        this.isAdmin = userService.getUserRole() === 1;
    }

    ngOnInit() {}

    public toggleSideNav() {
        this.isOpen = !this.isOpen;
    }

    public getNavigationItems(): NavRoute[] {
        if (this.isAdmin) {
            return this.navigationService.getNavigationItems();
        } else {
            return [];
        }

    }

    public getActivePage(): Page {
        return this.navigationService.getActivePage();
    }

    public logout() {
        this.authService.logout();
        this.router.navigate(['login'], { replaceUrl: true });
    }

    public getPreviousUrl(): string[] {
        return this.navigationService.getPreviousUrl();
    }
}
