import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    const potencialToken = localStorage.getItem('auth-token');
    if (potencialToken !== null) {
      this.authService.setTocken(potencialToken);

    }
  }
}

