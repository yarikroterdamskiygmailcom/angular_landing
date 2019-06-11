import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { SignupPageComponent } from './auth/signup-page/signup-page.component';
import { DetailsComponent } from './profile/details/details.component';

import { TokenInterceptor } from './shared/token.interceptor';
import { MaterialModule } from './layout/material.module';
import { TariffComponent } from './tariff/tariff.component';
import { UpdateProfileComponent } from './profile/update-profile/update-profile.component';
import { MainComponent } from './main/main.component';
import { CardComponent } from './payment/card/card.component';
import { ResultComponent } from './payment/result/result.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { MatchInfoComponent } from './main/match-info/match-info.component';
import { FilterPipe } from './shared/datepipe';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    SignupPageComponent,
    DetailsComponent,
    TariffComponent,
    UpdateProfileComponent,
    MainComponent,
    CardComponent,
    ResultComponent,
    EmailVerificationComponent,
    ChangePasswordComponent,
    MatchInfoComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
