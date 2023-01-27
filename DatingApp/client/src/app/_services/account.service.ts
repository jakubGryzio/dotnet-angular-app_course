import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from 'src/utils/config';
import { BehaviorSubject, map } from 'rxjs';
import IUser from '../_models/user';
import IAccount from '../_models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: IAccount) {
    return this.handleAccount('login', model);
  };

  register(model: IAccount) {
    return this.handleAccount('register', model);
  }

  setCurrentUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  private handleAccount(type: string, model: IAccount) {
    return this.http.post<IUser>(baseUrl + `account/${type}`, model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }
}
