import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";

import { PipeModule } from '../pipes/pipes'

import { AppData } from '../providers/app-data';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TripsBuyPage } from '../pages/trips-buy/trips-buy';
import { LoginPage } from '../pages/login/login';
import { TripDetailPage } from '../pages/trip-detail/trip-detail';
import { TripsSellPage } from '../pages/trips-sell/trips-sell';
import { TripSellAddPage } from '../pages/trip-sell-add/trip-sell-add';
import { InfriengePage } from '../pages/infrienge/infrienge';
import { InfriengeDetailPage } from '../pages/infrienge-detail/infrienge-detail';


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        ListPage,
        TripsBuyPage,
        TripDetailPage,
        TripsSellPage,
        TripSellAddPage,
        InfriengePage,
        InfriengeDetailPage,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        PipeModule.forRoot(),
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        ListPage,
        TripsBuyPage,
        TripDetailPage,
        TripsSellPage,
        TripSellAddPage,
        InfriengePage,
        InfriengeDetailPage,
    ],
    providers: [
        AppData,
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
