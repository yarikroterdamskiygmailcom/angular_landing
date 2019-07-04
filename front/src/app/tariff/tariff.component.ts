import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tariff} from '../shared/models/tariff.model';
import {TariffService} from '../shared/tariff.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ProfileServiceService} from '../shared/profile-service.service';
import {SignUpService} from "../shared/sign-up.service";


@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.css']
})
export class TariffComponent implements OnInit, OnDestroy {
  networkingErr = false;
  tariffs: Tariff[];
  subscription: Subscription;
  userId = '';


  constructor(private tariffService: TariffService,
              private profileService: ProfileServiceService,
              private route: ActivatedRoute,
              private router: Router,
              private signUpService: SignUpService) {}

  ngOnInit() {
    this.signUpService.setEvent({activeTab: 3});
    this.route.params
      .subscribe((params: Params) => {
          this.userId = params.id;
        }
      );
    this.getAll();
  }

  getAll() {
    this.subscription = this.tariffService.getAll()
      .subscribe(tariffs => {
          this.tariffs = tariffs;
        },
        (err) => {
          this.networkingErr = true;
        });
  }

  pay(e, index) {
    e.preventDefault();
    this.router.navigate([`/card/${this.userId}/${index}`]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  back() {
    this.router.navigate([`/profile/${this.userId}`]);
  }
}
