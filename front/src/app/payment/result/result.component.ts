import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params,} from '@angular/router';
import {CardService} from 'src/app/shared/card.service';
import {Profile} from '../../shared/models/profile.model';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  userId = '';
  paymentId = '';
  payerID = '';
  price = 0;
  tariff = '';
  profile: {};
  networkingErr = false;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private cardService: CardService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          const id = params.id;
          this.userId = id;
          this.price = params.price;
          this.tariff = params.tariff;

        }
      );
    this.route.queryParams.subscribe(params => {
      this.paymentId = params.paymentId;
      this.payerID = params.PayerID;
    });

  }

  confirm() {
    this.cardService.paypalConfirm(this.userId, this.price, this.tariff, this.paymentId, this.payerID)
      .subscribe(
        data => {
          this.profile = data;
          this.router.navigate([`/profile/${this.userId}`]);
        },
        err => {
          this.networkingErr = true;
        }
      );
  }
}
