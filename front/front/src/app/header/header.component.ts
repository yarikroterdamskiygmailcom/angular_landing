import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { ProfileServiceService } from '../shared/profile-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profileId = "";
  constructor(private authService: AuthService,
    private profileService: ProfileServiceService,
    private router: Router,
    private translateService: TranslateService) {
    translateService.setDefaultLang('en');
  }

  ngOnInit() {

  }
  onLogout() {
    this.authService.logOut();
    this.router.navigate(['/login/']);
  }

  switchLanguage(language: string) {
    this.translateService.use(language);
  }


}
