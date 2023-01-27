import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import IAccount from '../_models/account';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: IAccount = { username: "", password: "" };

  constructor(private accountSerivce: AccountService) { }

  ngOnInit(): void {
  }

  register() {
    this.accountSerivce.register(this.model).subscribe({
      next: () => {
        this.cancel();
      },
      error: error => console.error(error)
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
