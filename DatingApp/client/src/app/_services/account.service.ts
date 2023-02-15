import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import User from '../_models/user';
import IAccount from '../_models/account';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: IAccount) {
    return this.handleAccount('login', model);
  };

  register(model: IAccount) {
    return this.handleAccount('register', model);
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  private handleAccount(type: string, model: IAccount) {
    return this.http.post<User>(this.baseUrl + `account/${type}`, model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }
}
