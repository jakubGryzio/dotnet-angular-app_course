import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private accountSerivce: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register() {
    this.accountSerivce.register(this.model).subscribe({
      next: () => {
        this.cancel();
      },
      error: message => this.toastr.error(message.error)
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
