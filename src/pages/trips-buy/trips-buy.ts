import { Component } from '@angular/core';
import { AlertController, App, ModalController, NavController, ToastController, LoadingController, Refresher, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';
import { TripDetailPage } from '../trip-detail/trip-detail';

@Component({
    selector: 'page-trips-buy',
    templateUrl: 'trips-buy.html'
})
export class TripsBuyPage {

    userID: any
    user_info: any

    dataList: any
    dataListBuyed: any
    shownData = 0

    totalTrips: number

    // tabs
    tabID: string
    tabs = {
        buy: 'Mua chuyến',
        buyed: 'Chuyến đã mua'
    };
    activated = {
        buy: 0,
        buyed: 0
    }


    constructor(
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public appData: AppData,
    ) {
        console.log(Date.now())

        this.appData.getUserInfoPromise().then((data) => {
            this.user_info = data
            this.userID = data['id']
            this.changeTab('buy')
            this.updateList(this.userID, null)
            this.updateListBuyed(this.userID, null)
        })
    }

    changeTab(id) {
        this.tabID = id;
        for (var _i in this.tabs) {
            if (_i == id) this.activated[_i] = 'active';
            else this.activated[_i] = '';
        }
    }

    updateList(userID: any, refresher: any) {
        // Close any open sliding items when the tour updates
        // this.dataList && this.dataList.closeSlidingItems()

        this.appData.listTripsBuy(userID).subscribe((data: any) => {
            let now = new Date().getTime()
            for (let key in data) {
                if (key != 'total') {
                    for (let trip_id in data[key]) {
                        let end_time = new Date(data[key][trip_id].time).getTime()
                        let diff_sec = (end_time - now) / 1000
                        // console.log(diff_sec)

                        if (diff_sec > 0) {
                            let diff_day = Math.floor(diff_sec / 86400)
                            diff_sec = diff_sec % 86400
                            let diff_hr = Math.floor(diff_sec / 3600)
                            diff_sec = diff_sec % 3600
                            let diff_min = Math.floor(diff_sec / 60)
                            diff_sec = diff_sec % 60

                            if (diff_day > 0) data[key][trip_id].time_diff = '<div class="time_left">' + diff_day + ' days left</div>'
                            else if (diff_hr > 0) data[key][trip_id].time_diff = '<div class="time_left">' + diff_hr + ' hours left</div>'
                            else if (diff_min > 0) data[key][trip_id].time_diff = '<div class="time_left">' + diff_min + ' mins left</div>'
                            else data[key][trip_id].time_diff = '<div class="time_left">' + diff_sec + ' seconds left</div>'
                            data[key][trip_id].outDate = false
                            
                            data[key][trip_id].canbuy = true
                            if (parseInt(data[key][trip_id].seat) > parseInt(this.user_info.seat)) {
                                data[key][trip_id].canbuy = false
                            }
                            if (data[key][trip_id].coin <= 0) {
                                data[key][trip_id].canbuy = false
                            }
                            if (data[key][trip_id].coin > this.user_info.coin) {
                                data[key][trip_id].canbuy = false
                            }
                            if (data[key][trip_id].taxiid) {
                                data[key][trip_id].canbuy = false
                            }
                        } else {
                            data[key][trip_id].time_diff = '<div class="time_left passed">Hết hạn</div>'
                            data[key][trip_id].outDate = true
                            data[key][trip_id].canbuy = false
                        }
                    }
                }
            }

            console.log(data)

            this.dataList = data
            // this.totalTrips = data.total
            this.shownData = data.total

            if (refresher) {
                // simulate a network request that would take longer
                // than just pulling from out local json file
                setTimeout(() => {
                    refresher.complete()

                    const toast = this.toastCtrl.create({
                        message: 'List have been updated.',
                        duration: 3000
                    });
                    toast.present()
                }, 1000)
            }
        });
    }

    updateListBuyed(userID: any, refresher: any) {
        // Close any open sliding items when the tour updates
        // this.dataList && this.dataList.closeSlidingItems()

        this.appData.listTripsBuyed(userID).subscribe((data: any) => {

            let now = new Date().getTime()
            for (let key in data) {
                if (key != 'total') {
                    for (let trip_id in data[key]) {
                        data[key][trip_id].canbuy = false

                        let end_time = new Date(data[key][trip_id].time).getTime()
                        let diff_sec = (end_time - now) / 1000

                        if (diff_sec > 0) {
                            let diff_day = Math.floor(diff_sec / 86400)
                            diff_sec = diff_sec % 86400
                            let diff_hr = Math.floor(diff_sec / 3600)
                            diff_sec = diff_sec % 3600
                            let diff_min = Math.floor(diff_sec / 60)
                            diff_sec = diff_sec % 60

                            if (diff_day > 0) data[key][trip_id].time_diff = '<div class="time_left">' + diff_day + ' days left</div>'
                            else if (diff_hr > 0) data[key][trip_id].time_diff = '<div class="time_left">' + diff_hr + ' hours left</div>'
                            else if (diff_min > 0) data[key][trip_id].time_diff = '<div class="time_left">' + diff_min + ' mins left</div>'
                            else data[key][trip_id].time_diff = '<div class="time_left">' + diff_sec + ' seconds left</div>'
                            data[key][trip_id].outDate = false
                        } else {
                            data[key][trip_id].time_diff = '<div class="time_left passed">Hết hạn</div>'
                            data[key][trip_id].outDate = true
                        }
                    }
                }
            }

            console.log(data)

            this.dataListBuyed = data

            if (refresher) {
                // simulate a network request that would take longer
                // than just pulling from out local json file
                setTimeout(() => {
                    refresher.complete()

                    const toast = this.toastCtrl.create({
                        message: 'List have been updated.',
                        duration: 3000
                    });
                    toast.present()
                }, 1000)
            }
        })
    }

    refresh_list(refresher: Refresher) {
        this.updateList(this.userID, refresher)
    }

    refresh_list_buyed(refresher: Refresher) {
        this.updateListBuyed(this.userID, refresher)
    }

    goToDetail(oneData: any) {
        // go to the tour detail page
        // and pass in the tour data

        this.navCtrl.push(TripDetailPage, {
            tripID: oneData.id,
            tripInfo: oneData,
            title: oneData.addressfrom + ' - ' + oneData.addressto,
            action: 'view'
        });
    }

    buy(oneData: any) {
        this.navCtrl.push(TripDetailPage, {
            tripID: oneData.id,
            tripInfo: oneData,
            title: oneData.addressfrom + ' - ' + oneData.addressto,
            action: 'buy'
        })
        // check time again
        /*let now = new Date().getTime()
        let end_time = new Date(oneData.time).getTime()
        let diff_sec = (end_time - now) / 1000
        // console.log(diff_sec)

        if (diff_sec > 0) {
            this.navCtrl.push(TripDetailPage, {
                tripID: oneData.id,
                tripInfo: oneData,
                title: oneData.addressfrom + ' - ' + oneData.addressto,
                action: 'buy'
            })
        } else {
            oneData.time_diff = '<div class="time_left passed">Hết hạn</div>'
            oneData.outDate = true
            oneData.canbuy = false

            for (let key in this.dataList) {
                if (key != 'total') {
                    for (let trip_id in this.dataList[key]) {
                        if (this.dataList[key][trip_id].id == oneData.id) {
                            this.dataList[key][trip_id].time_diff = '<div class="time_left passed">Hết hạn</div>'
                            this.dataList[key][trip_id].canbuy = false
                            this.dataList[key][trip_id].outDate = true
                        }
                    }
                }
            }
        }*/

    }

}
