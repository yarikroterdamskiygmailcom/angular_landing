import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SignUpService} from '../shared/sign-up.service';
import {TariffService} from '../shared/tariff.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  faqContent = [];
  plansContent = [];
  contactUs;
  signUpOpen = false;
  now;

  constructor(private fb: FormBuilder,
              private signUpService: SignUpService,
              private tariffService: TariffService) {
    this.now = new Date();
  }

  ngOnInit() {
    this.fillContent();
    this.initContactUsForm();
    this.tariffService.getAll().subscribe((plans) => {
      this.plansContent = plans;
    });
  }

  initContactUsForm() {
    this.contactUs = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
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

  openModal(e) {
    e.preventDefault();
    this.signUpService.setEvent({signUp: true, top: '450px'});
    window.scrollTo({
      top: 30,
      behavior: 'smooth'
    });
  }

  fillContent(): void {
    for (let i = 0; i < 4; i++) {
      this.faqContent.push({
        isOpen: false,
        title: 'Lorem ipsum dolor sit amet, nec quidam eripuit mediocrem id?',
        content: 'Lorem ipsum dolor sit amet, nec quidam eripuit mediocrem id, maiestatis percipitur mel at,' +
          ' cu tibique omittam est. Debet erant qui te. Eu amet natum justo ius. Id dicam constituto referrentur ' +
          'vim, an prompta splendide disputationi vim, affert exerci altera mei in.'
      });
    }
  }
}
