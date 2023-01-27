import { Component, OnInit } from '@angular/core';
import IAccount from '../_models/account';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  model: IAccount = { username: '', password: '' };

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => console.error(error)
    })
  }

  logout() {
    this.accountService.logout();
  }

}
