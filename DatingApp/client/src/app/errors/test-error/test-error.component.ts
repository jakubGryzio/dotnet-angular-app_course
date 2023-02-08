import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { baseUrl } from 'src/utils/config';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css']
})
export class TestErrorComponent implements OnInit {
  validationErrors: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error() {
    this.http.get(baseUrl + 'bug/not-found').subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }

  get400Error() {
    this.http.get(baseUrl + 'bug/bad-request').subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }

  get500Error() {
    this.http.get(baseUrl + 'bug/server-error').subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }

  get401Error() {
    this.http.get(baseUrl + 'bug/auth').subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }

  get400ValidationError() {
    this.http.post(baseUrl + 'account/register', {}).subscribe({
      next: response => console.log(response),
      error: error => {
        this.validationErrors = error;
      }
    })
  }
}
