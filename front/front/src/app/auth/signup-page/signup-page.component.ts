import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

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



  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
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
  }
  onSubmit() {
    this.aSup = this.authService.register(this.form.value)
      .subscribe(
        () => this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        }),
        err => {
          this.networkingErr = true;
          console.log(err);
        }
      );
  }
  checked() {
    this.limits = false;
  }
  ngOnDestroy() {
    if (this.aSup) {
      this.aSup.unsubscribe();
    }
  }

}