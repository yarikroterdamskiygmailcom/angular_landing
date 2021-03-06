import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ProfileServiceService} from '../shared/profile-service.service';
import {Subscription} from 'rxjs';
import * as moment from 'moment-timezone';
import {MainService} from '../shared/main.service';
import {TariffService} from '../shared/tariff.service';
import {FilterPipe} from '../shared/datepipe';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {SignUpService} from '../shared/sign-up.service';

interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit, OnDestroy {

  constructor(
    private profileService: ProfileServiceService,
    private mainService: MainService,
    private tariffService: TariffService,
    private route: ActivatedRoute,
    private router: Router,
    private signUpService: SignUpService) {
  }

  private subscription: Subscription;
  networkingErr = false;
  events = [];
  displayedColumns: string[] = [
    'time', 'country', 'leaque', 'match', '1', 'x', '2', 'over 0.5 HT', 'over 0.5 SH',
    'over 1.5', 'over 2.5', 'under 3.5', 'under 4.5', 'btts yes', 'btts no'];
  dataSource;
  timenow = new Date();
  userid = '';
  profile = {};
  tariffPlanName = 'Free';
  timeZone = '';
  spinner = true;

  // @ts-ignore
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.signUpService.setEvent({activeTab: 2});
    this.route.params
      .subscribe(
        (params: Params) => {
          this.userid = params.id;
          this.fetch(this.userid);
          this.signUpService.setEvent({userId: this.userid});
          // this.getMatches('2019-05-19')
        }
      );
  }

  fetch(userid: string) {
    this.subscription = this.profileService.getProfile(userid)
      .subscribe(profile => {
          this.timenow = moment.tz(new Date(), profile.timeZone);
          this.timeZone = profile.timeZone;
          this.profile = profile;
          this.getMatches('2019-05-19');
          this.tariffService.getTariff(profile.tariffPlan)
            .subscribe(
              (tariff) => {
                this.tariffPlanName = tariff.name;
              }
            );
        },
        err => {
          this.networkingErr = true;
        });

  }

  update() {
    this.router.navigate([`/profile/edit/${this.userid}`]);
  }

  updateTarif() {
    this.router.navigate([`/tariff/${this.userid}`]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getMatches(date: string) {
    this.mainService.getMatches(date)
      .subscribe(matches => {
          if (this.tariffPlanName === 'Free') {
            const limitations = (matches.data.length * 0.10).toFixed();
            const limitedMatches = matches.data.slice(0, Number(limitations));
            this.events = limitedMatches;
            for (let i = 0; i < this.events.length; i++) {
              const date = new Date(this.events[i].event_play_time * 1000);
              this.events[i].event_play_time = moment.tz(date, this.timeZone);
            }
          } else {
            this.events = matches.data;
          }
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.events);
          this.dataSource.paginator = this.paginator;
          this.spinner = false;
        },
        err => {
          this.networkingErr = true;
        }
      );
  }
}
