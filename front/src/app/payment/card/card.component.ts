import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs';
import {TariffService} from 'src/app/shared/tariff.service';
import {Tariff} from 'src/app/shared/models/tariff.model';
import {CardService} from 'src/app/shared/card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnDestroy {
  activeUser: string = '';
  tariffIndex: string = '';
  private subscription: Subscription;
  selectedTariff: any = {};
  btnDisabled = false;
  handler: any;
  quantities = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tarifService: TariffService,
    private data: CardService
  ) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.activeUser = params.id;
          this.tariffIndex = params.tariff;
          this.fetch();
        }
      );


    this.handler = (<any>window).StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: async stripeToken => {
        let products;
        products = this.selectedTariff._id;
        this.quantities.push(1);

        try {
          const newCard = {
            price: this.selectedTariff.price,
            tariff: this.selectedTariff._id,
            stripeToken,
            user: this.activeUser
          };
          await this.data.createCard(newCard)
            .subscribe(
              res => {
                console.log(res);
                this.router.navigate([`/profile/${this.activeUser}`], {
                  queryParams: {
                    success: true
                  }
                });
              },
              err => {
                this.router.navigate([`/profile/${this.activeUser}`], {
                  queryParams: {
                    wrong: true
                  }
                });

              });
        } catch (error) {
          this.router.navigate([`/profile/${this.activeUser}`], {
            queryParams: {
              wrong: true
            }
          });
        }

      },
    });
  }

  checkout() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        this.handler.open({
          name: 'BetSoccer',
          description: 'Checkout Payment',
          amount: this.selectedTariff.price * 100,
          closed: () => {
            this.btnDisabled = false;
          },
        });
      } else {
        this.btnDisabled = false;
      }
    } catch (error) {
      this.data.error('Something goes wrong!!! try again');

    }
  }

  validate() {
    if (!this.quantities.every(data => data > 0)) {
      this.data.warning('Quantity cannot be less than one.');
    } else {
      this.data.message = '';
      return true;
    }
  }

  fetch() {
    this.subscription = this.tarifService.getAll()
      .subscribe(tariffs => {
        const alltariffs = tariffs;
        this.selectedTariff = alltariffs[this.tariffIndex];
        this.selectedTariff._id = alltariffs[this.tariffIndex]._id;
      });

  }

  back() {
    this.router.navigate([`/profile/${this.activeUser}`]);
  }

  payViaPaypal() {
    const newCard = {
      price: this.selectedTariff.price,
      tariff: this.selectedTariff._id,
      description: this.selectedTariff.name,
      user: this.activeUser
    };
    this.data.payViaPaypal(newCard)
      .subscribe(
        (res: any) => {
          window.location.href = res.url;
          this.data.success('Connected to PayPal Successfully. Wait a minute, please');
        },
        err => {
          this.data.error('Something goes wrong!!! Try again');
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
