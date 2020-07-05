import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    showChat;
    constructor(
        private userService: UserService
    ) {

    }

    ngOnInit() {
    }

    showChatBot() {
        return this.userService.getUserRole() === 2;
    }
}
