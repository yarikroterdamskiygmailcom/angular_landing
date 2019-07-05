import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProfileServiceService} from 'src/app/shared/profile-service.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TariffService} from 'src/app/shared/tariff.service';
import * as moment from 'moment-timezone';
import {SignUpService} from '../../shared/sign-up.service';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  constructor(private profileService: ProfileServiceService,
              private tariffService: TariffService,
              private route: ActivatedRoute,
              private router: Router,
              private signUpService: SignUpService) {
  }

  profile = {};
  private subscription: Subscription;
  userid = '';
  tariffPlan = {};
  timenow;
  networkingErr = false;
  notes = '';
  profileTab = true;
  updatedPlan = false;
  env;


  ngOnInit() {
    this.env = environment;
    this.signUpService.setEvent({activeTab: 1});
    this.route.params
      .subscribe(
        (params: Params) => {
          this.userid = params.id;
          this.fetch(this.userid);
        }
      );
    this.route.queryParams
      .subscribe(
        (params: Params) => {
          if (params.success) {
            this.notes = 'Purchase successful';
          } else if (params.wrong) {
            this.notes = 'Something goes wrong, please, try again';
          }
        }
      );
    if (this.route.snapshot.queryParams.success) {
      this.updatedPlan = true;
      this.profileTab = false;
    }
  }

  fetch(userid: string) {
    this.subscription = this.profileService.getProfile(userid)
      .subscribe(profile => {
          this.timenow = moment.tz(new Date(), profile.timeZone);
          this.profile = profile;
          this.getTariff(profile.tariffPlan);
        },
        err => {
          this.networkingErr = true;
        });

  }

  getTariff(tariffid: string) {
    this.subscription = this.tariffService.getTariff(tariffid)
      .subscribe(tariff => {
          this.tariffPlan = tariff;
        },
        err => {
          this.networkingErr = true;
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  update() {
    this.router.navigate([`/profile/edit/${this.userid}`]);
  }

  ontariff() {
    this.router.navigate([`/tariff/${this.userid}`]);
  }

  toAnalytics() {
    this.router.navigate([`/main/${this.userid}`]);
  }
}
