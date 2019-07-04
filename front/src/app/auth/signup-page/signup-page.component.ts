import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {AuthService} from 'src/app/shared/auth.service';
import {Subscription} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {SignUpService} from "../../shared/sign-up.service";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  aSup: Subscription;
  networkingErr = false;
  limits = true;
  privacy = true;

  email;
  confirmationVisible;
  secondMessage = 'Please follow the link indicated in the letter.';
  action = 'to account activation.';


  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private signUpService: SignUpService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      privacy: [false, [Validators.required, Validators.requiredTrue]],
      limits: [false, [Validators.required, Validators.requiredTrue]],
    });
  }

  onSubmit() {
    this.aSup = this.authService.register(this.form.value)
      .subscribe(() => {
          this.email = this.form.value.email;
          this.confirmationVisible = true;
          // this.router.navigate(['/login'], {
          //   queryParams: {
          //     registered: true
          //   }
          // });
        },
        err => {
          this.networkingErr = true;
        }
      );
  }

  closeSignUp() {
    this.signUpService.setEvent({signUp: false, signIn: false, top: 0});
  }

  checkConfirmOpen(bool) {
    this.confirmationVisible = bool;
    this.signUpService.setEvent({signUp: false, signIn: false, top: 0});
  }

  ngOnDestroy() {
    if (this.aSup) {
      this.aSup.unsubscribe();
    }
  }

}
