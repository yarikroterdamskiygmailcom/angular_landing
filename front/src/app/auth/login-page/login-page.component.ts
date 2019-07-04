import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, ValidationErrors} from '@angular/forms';
import {AuthService} from 'src/app/shared/auth.service';
import {Subscription} from 'rxjs';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from 'src/app/shared/user-service';
import {ProfileServiceService} from 'src/app/shared/profile-service.service';
import {SignUpService} from '../../shared/sign-up.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSup: Subscription;
  networkingErr = false;

  message = '';
  notes = '';
  otherForm: FormGroup;
  passforgot = false;
  remember = false;

  email: string;
  secondMessage = 'If your don’t receive the email within a few minutes, please try again.';
  action = 'to reset your password';
  visible = false;



  constructor(
    private authService: AuthService,
    private profileService: ProfileServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private signUpService: SignUpService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    const potencialid = localStorage.getItem('userid');
    const potencialRemember = localStorage.getItem('remember');


    if (this.authService.isAuthenticated() && potencialRemember !== null && potencialid !== null) {
      this.getUserTimeZone(potencialid);
      this.router.navigate([`/profile/${potencialid}`]);
    }
    this.otherForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ])
    });
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
    this.route.queryParams
      .subscribe(
        (params: Params) => {
          if (params.registered) {
            this.notes = 'Thanks check Your email and activate your account!';

          } else if (params.accessDenied) {

          } else if (params.sessionFailed) {

          }
        }
      );
  }

  ngOnDestroy() {
    this.aSup && this.aSup.unsubscribe();
  }

  onSubmit() {
    this.aSup = this.authService.login(this.form.value)
      .subscribe(
        data => {
          if (this.form.value.remember) {
            localStorage.setItem('remember', 'remember');
            localStorage.setItem('userid', data.id);
          }
          this.closeSignUp();
          this.getUserTimeZone(data.id);
          this.router.navigate([`/main/${data.id}`]);
          this.profileService.profileId.next(data.id);
          this.signUpService.setEvent({userId: data.id});
        },
        err => {
          this.networkingErr = true;
          this.message = err.message;
        }
      );
  }

  resend() {
    const data = {
      email: this.form.value.email
    };
    this.authService.postResend(data)
      .subscribe(
        () => {
          // this.router.navigate([`/login`])
          this.notes = 'Has been sent to your email';
        },
        err => {
          this.networkingErr = true;
          this.message = err.message;
        }
      );
  }

  closeModal(bool) {
    this.visible = bool;
    this.passforgot = false;
    this.signUpService.setEvent({signUp: false, signIn: false, top: 0});
  }

  onSend() {
    const data = {
      email: this.otherForm.value.email
    };
    this.aSup = this.authService.meilSend(data)
      .subscribe(() => {
        this.notes = 'Has been sent to your email';
        this.visible = true;
        this.email = this.otherForm.value.email;
        },
        (err) => {
          this.networkingErr = true;
          this.message = err.message;
        }
      );
  }

  enterMail() {
    this.passforgot = true;
  }

  closeSignUp() {
    this.signUpService.setEvent({signUp: false, signIn: false, top: 0});
  }

  getUserTimeZone(data: string) {
    this.profileService.getProfile(data)
      .subscribe(profile => localStorage.setItem('timezone', profile.timeZone));
  }
}
