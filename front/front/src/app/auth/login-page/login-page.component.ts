import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/shared/user-service';
import { ProfileServiceService } from 'src/app/shared/profile-service.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSup: Subscription;
  networkingErr = false;

  message = "";
  notes = "";
  otherForm: FormGroup;
  passforgot = false;
  remember = false;


  constructor(private authService: AuthService,
    private profileService: ProfileServiceService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const potencialid = localStorage.getItem('userid');
    const potencialRemember = localStorage.getItem('remember');


    if (this.authService.isAuthenticated() && potencialRemember !== null && potencialid !== null) {
      this.getUserTimeZone(potencialid);
      console.log(localStorage.getItem('timezone'));
      this.router.navigate([`/profile/${potencialid}`]);
    }
    this.otherForm = new FormGroup({
      'email': new FormControl(null, [
        Validators.required,
        Validators.email
      ])
    });
    this.form = new FormGroup({
      'email': new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
    console.log(this.form);
    this.route.queryParams
      .subscribe(
        (params: Params) => {
          if (params['registered']) {
            this.notes = "Thanks Check your email and activate your acount!!!"

          } else if (params['accessDenied']) {

          } else if (params['sessionFailed']) {

          }
        }
      );
  }

  ngOnDestroy() {
    if (this.aSup) {
      this.aSup.unsubscribe();
    }
  }

  onSubmit() {
    this.aSup = this.authService.login(this.form.value)
      .subscribe(
        data => {
          if (this.remember) {
            console.log("ZZZ")
            localStorage.setItem('remember', 'remember');
            localStorage.setItem('userid', data.id);
            this.getUserTimeZone(data.id);
            console.log(localStorage.getItem('timezone'))
            this.router.navigate([`/main/${data.id}`]);

          }
          this.getUserTimeZone(data.id);
          this.router.navigate([`/main/${data.id}`]);
          this.profileService.profileId.next(data.id);

        },
        err => {
          this.networkingErr = true;
          console.log(err);
          this.message = err.message
        }
      );
  }
  resend() {
    console.log("MAIL", this.form.value.email)
    const data = {
      email: this.form.value.email
    }
    this.authService.postResend(data)
      .subscribe(
        () => {
          console.log("Lena")
          //this.router.navigate([`/login`])
          this.notes = "Has been sent to your email"
        },
        err => {
          console.log(err)
          this.networkingErr = true;
          this.message = err.message


        }
      )

  }
  onSend() {
    console.log(this.otherForm.value.email)
    const data = {
      email: this.otherForm.value.email
    }
    this.aSup = this.authService.meilSend(data)
      .subscribe(
        () => {
          this.notes = "Has been sent to your email"
        },
        err => {
          this.networkingErr = true;
          console.log(err);
          this.message = err.message
        }
      );
  }
  enterMail() {
    this.passforgot = true;
  }

  checked() {
    this.remember = true;
    console.log(this.remember)
  }

  getUserTimeZone(data: string) {
    this.profileService.getProfile(data)
      .subscribe(profile => {
        localStorage.setItem('timezone', profile.timeZone);
      })
  }
}
