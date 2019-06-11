import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  verifiedToken = "";
  useremail = "";
  networkingErr = false;
  message = "";
  notes = "";
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router

  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.useremail = params['email'];
          console.log(this.useremail)

        }
      );
    this.route.queryParams.subscribe(params => {
      this.verifiedToken = params['id'];
      console.log(this.verifiedToken);

    })

  }
  confirm() {
    console.log("TOKEN", this.verifiedToken)
    console.log("MAIL", this.useremail)

    const data = {
      token: this.verifiedToken,
      email: this.useremail
    }
    this.authService.postConfirm(data)
      .subscribe(
        () => {
          console.log("Lena")
          this.router.navigate([`/login`])
        },
        err => {
          console.log(err)
          this.networkingErr = true;
          this.message = err.message

        }
      )

  }
  resend() {

    console.log("MAIL", this.useremail)

    const data = {

      email: this.useremail
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
          if (this.message === "This account has already been verified. Please log in.") {
            this.router.navigate([`/login`])
          }

        }
      )

  }

}
