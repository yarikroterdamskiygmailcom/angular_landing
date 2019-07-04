import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  useremail = '';
  verifiedToken = '';
  networkingErr = false;
  message = '';
  notes = '';
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.useremail = params.email;

        }
      );
    this.route.queryParams.subscribe(params => {
      this.verifiedToken = params.id;

    });
    this.form = new FormGroup({
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  onSubmit() {
    const data = {
      token: this.verifiedToken,
      email: this.useremail,
      password: this.form.value.password
    };
    this.authService.changepass(data)
      .subscribe(
        (user) => {
          this.router.navigate([`/login`]);
        },
        err => {
          this.networkingErr = true;
          this.message = err.message;
        }
      );
  }
  resend() {
    const data = {
      email: this.useremail
    };
    this.authService.postResend(data)
      .subscribe(
        () => {
          //this.router.navigate([`/login`])
          this.notes = 'Has been sent to your email';
        },
        err => {
          this.networkingErr = true;
          this.message = err.message;
        }
      );
  }
}
