import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { SignupPageComponent } from './auth/signup-page/signup-page.component';
import { HeaderComponent } from './header/header.component';
import { DetailsComponent } from './profile/details/details.component';
import { AuthGuardService } from './shared/auth-guard.service';
import { UpdateProfileComponent } from './profile/update-profile/update-profile.component';
import { TariffComponent } from './tariff/tariff.component';
import { CardComponent } from './payment/card/card.component';
import { ResultComponent } from './payment/result/result.component';
import { MainComponent } from './main/main.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { MatchInfoComponent } from './main/match-info/match-info.component';

const appRoutes: Routes = [
  {
    path: '', component: HeaderComponent, children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'signup', component: SignupPageComponent },
      { path: 'login', component: LoginPageComponent },
      { path: 'profile/:id', component: DetailsComponent, canActivate: [AuthGuardService] },
      { path: 'profile/edit/:id', component: UpdateProfileComponent, canActivate: [AuthGuardService] },
      { path: 'tariff/:id', component: TariffComponent, canActivate: [AuthGuardService] },
      { path: 'card/:id/:tariff', component: CardComponent, canActivate: [AuthGuardService] },
      { path: 'result/:id/:price/:tariff', component: ResultComponent, canActivate: [AuthGuardService] },
      { path: 'main/:id', component: MainComponent, canActivate: [AuthGuardService] },
      { path: 'detail/:id/:matchid', component: MatchInfoComponent, canActivate: [AuthGuardService] },

    ],
  },
  { path: 'verify/:email', component: EmailVerificationComponent },
  { path: 'change/:email', component: ChangePasswordComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


