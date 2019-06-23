import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';

//import { UserData } from './user-data';

// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
//import { c } from '@angular/core/src/render3';


@Injectable()
export class AppData {
    
    HAS_LOGGED_IN = 'hasLoggedIn';
    user_info: any;
    userID: any;

    constructor(
        public events: Events,
        public storage: Storage,
        public http: Http
    ) {
        this.getUserInfo().then((data) => {
            if (data) {
                this.user_info = data
                this.userID = data['id']
            }
        })
    }

    addTrip(formData: any): any {
        return this.http.post('http://localhost/taxi_backend/trip_add.php', formData).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data;
        })
    }


    listTripsBuy(taxiid: any): any {
        return this.http.post('http://localhost/taxi_backend/trip_all.php', {taxiid: taxiid}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    listTripsBuyed(taxiid: any): any {
        return this.http.post('http://localhost/taxi_backend/trip_all_buy.php', {taxiid: taxiid}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    getTripInfo(tripID: any, taxiid: any): any {
        return this.http.post('http://localhost/taxi_backend/trip_one.php', {id: tripID, taxiid: taxiid}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    buyTrip(tripID: any, taxiid: any): any {
        return this.http.post('http://localhost/taxi_backend/trip_buy.php', {id: tripID, taxiid: taxiid}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        });
    }

    listTripsSelled(taxiid: any): any {
        return this.http.post('http://localhost/taxi_backend/trip_all_sell.php', {taxiid: taxiid}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    listInfrienges(taxiid: any): any {
        return this.http.post('http://localhost/taxi_backend/infrienge_all.php', {taxiid: taxiid}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    getInfriengeInfo(tripID: any, taxiid: any): any {
        return this.http.post('http://localhost/taxi_backend/infrienge_one.php', {id: tripID, taxiid: taxiid}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        });
    }

    changeInfriengeStt(tripID: any, taxiid: any): any {
        return this.http.post('http://localhost/taxi_backend/infrienge_changeStatus.php', {id: tripID, taxiid: taxiid}).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        });
    }


    login(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost/taxi_backend/login.php', params).map((res: any) => {
            let data = res.json()
            // console.log(data)

            return data
        })
    }

    logout(): void {
        this.storage.remove('hasLoggedIn')
        this.storage.remove('username')
        //this.storage.remove('token')
        this.storage.remove('user_info')
        this.events.publish('user:logout')
    }

    hasLoggedIn(): Promise<boolean> {
        return this.storage.get('hasLoggedIn').then((value) => {
            console.log('hasLoggedIn = '+value)
            return value == true
        })
    }


    getUserInfo(): Promise<string> {
        return this.storage.get('user_info')
    }

    getUserInfoPromise(): Promise<object> {
        return this.storage.get('user_info').then((value) => {
            return value
        })
    }

}
