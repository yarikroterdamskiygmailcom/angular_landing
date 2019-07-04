import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  verifiedToken = '';
  useremail = '';
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

  }
  confirm() {
    const data = {
      token: this.verifiedToken,
      email: this.useremail
    };
    this.authService.postConfirm(data)
      .subscribe(
        () => {
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
          // this.router.navigate([`/login`])
          this.notes = 'Has been sent to your email';
        },
        err => {
          this.networkingErr = true;
          this.message = err.message;
          if (this.message === 'This account has already been verified. Please log in.') {
            this.router.navigate([`/login`]);
          }
        }
      );
  }
}
