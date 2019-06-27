import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {Router} from '@angular/router';
import {ProfileServiceService} from '../shared/profile-service.service';
import {TranslateService} from '@ngx-translate/core';
import {SignUpService} from '../shared/sign-up.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profileId = '';
  menuIsOpen = false;
  appMenuOpen = false;
  landing = true;
  signUpOpen = false;
  signInOpen = false;
  langDrop = false;

  constructor(private authService: AuthService,
              private profileService: ProfileServiceService,
              private router: Router,
              private translateService: TranslateService,
              private signUpService: SignUpService) {
    translateService.setDefaultLang('en');
  }

  ngOnInit() {
    this.landing = (this.router.url === '/');
    this.router.events.subscribe(event => {
      this.landing = (this.router.url === '/');
    });

    this.signUpService.getEvent().subscribe((res) => {
      this.signUpOpen = res.signUp;
      this.signInOpen = res.signIn;
      document.getElementById('sign-up-card').style.top = res.top;
      document.getElementById('sign-in-card').style.top = res.top;
    });
  }

  openSignUp(topPosition = '250px') {
    this.signUpService.setEvent({signUp: true, signIn: false, top: topPosition});
    document.getElementById('sign-up-card').style.top = topPosition;
  }

  openSignIn(topPosition = '250px') {
    this.signUpService.setEvent({signUp: false, signIn: true, top: topPosition});
    document.getElementById('sign-in-card').style.top = topPosition;
  }

  closeSignUp() {
    this.signUpService.setEvent({signUp: false, signIn: false, top: 0});
  }

  onLogout() {
    this.authService.logOut();
    this.router.navigate(['/login/']);
  }

  switchLanguage(language: string) {
    this.translateService.use(language);
  }

  scrollTo(e, el, close = false) {
    e.preventDefault();

    const element = document.getElementById(el);
    window.scrollTo({
      top: element.offsetTop,
      behavior: 'smooth'
    });
    if (close) {
      document.getElementById('burger-menu-wrapper').click();
    }
  }


}
