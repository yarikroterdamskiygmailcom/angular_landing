import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/main.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { ProfileServiceService } from 'src/app/shared/profile-service.service';

@Component({
  selector: 'app-match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.css']
})
export class MatchInfoComponent implements OnInit {

  networkingErr = false;
  matchInfo: any = "";
  userid = '';
  matchid = '';
  timenow;
  timeZone;
  profile = {};
  matchTime = "";
  firstPlayer = "";
  secondPlayer = "";

  constructor(private mainService: MainService,
    private route: ActivatedRoute,
    private profileService: ProfileServiceService,
    private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.userid = params['id'];
          this.matchid = params['matchid']

          console.log(this.userid)
          console.log(this.matchid)
          this.getMatch(this.matchid)
          this.fetch(this.userid);
        }
      );
  }

  fetch(userid: string) {
    this.profileService.getProfile(userid)
      .subscribe(profile => {
        this.timenow = moment.tz(new Date(), profile.timeZone);
        this.timeZone = profile.timeZone;
        this.profile = profile;
      },
        err => {
          this.networkingErr = true;
        })
  }

  getMatch(id: string) {
    this.mainService.getMatch(id)
      .subscribe(match => {
        this.matchInfo = match;
        console.log(this.timeZone);
        this.matchTime = moment.tz(this.matchInfo.data.match_data.event_play_timestamp, this.timeZone);
        let id = this.matchInfo.data.match_data.players.indexOf('-');
        console.log('-----', id)
        this.firstPlayer = this.matchInfo.data.match_data.players.substring(0, id)
        console.log('FIRST', this.firstPlayer)
        this.secondPlayer = this.matchInfo.data.match_data.players.substring(id + 1)
        console.log('SECOND', this.secondPlayer)


      },
        err => {
          this.networkingErr = true;

        })

  }
  update() {
    this.router.navigate([`/profile/edit/${this.userid}`])
  }
  updateTarif() {
    this.router.navigate([`/tariff/${this.userid}`])
  }
}


