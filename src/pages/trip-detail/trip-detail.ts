import { Component } from '@angular/core';
import { AlertController, App, ModalController, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';


@Component({
    selector: 'page-trip-detail',
    templateUrl: 'trip-detail.html'
})
export class TripDetailPage {
    tripInfo: any
    tripID: any
    title: any
    action: string

    user_info: any
    userID: any
    time_diff: any

    buyed: boolean = false
    owned: boolean = false
    outDate: boolean = false
    canbuy: boolean = false

    constructor(
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public appData: AppData
    ) {
        this.title = this.navParams.data.title
        this.app.setTitle(this.title)

        this.tripInfo = this.navParams.data.tripInfo
        this.tripInfo['title'] = this.title
        this.tripID = this.navParams.data.tripID

        this.canbuy = this.tripInfo.canbuy

        console.log(this.tripInfo)
        console.log('this.canbuy', this.canbuy)

        this.checkTime()
        setInterval(() => {
            this.checkTime()
        }, 1000)

        this.action = this.navParams.data.action

        this.appData.getUserInfo().then((data) => {
            this.user_info = data
            this.userID = data['id']

            if (this.tripInfo.taxiid) {
                this.canbuy = false
                this.buyed = true
                if (this.tripInfo.taxiid == this.userID)
                    this.owned = true
            }

            if (this.action == 'buy') this.buy()
            // else this.view()
        })

    }

    checkTime() {
        let end_time = new Date(this.tripInfo.time).getTime()
        let now = new Date().getTime()
        let diff_sec = (end_time - now) / 1000
        // console.log(diff_sec)

        if (diff_sec > 0) {
            let diff_day = Math.floor(diff_sec / 86400)
            diff_sec = diff_sec % 86400
            let diff_hr = Math.floor(diff_sec / 3600)
            diff_sec = diff_sec % 3600
            let diff_min = Math.floor(diff_sec / 60)
            diff_sec = Math.floor(diff_sec % 60)

            this.time_diff = '<span class="time_left">' + diff_day + ' days, ' + diff_hr + ' hours, ' + diff_min + ' min, ' + diff_sec + ' seconds</span>'
        } else {
            this.time_diff = '<span class="time_left passed">Hết hạn</span>'
            this.outDate = true
            this.canbuy = false
        }
    }

    ionViewWillEnter() {
        /*this.appData.loadTour(this.navParams.data.tripInfoId).subscribe((data: any) => {
            this.tripInfo = data;
            console.log(this.tripInfo);
        });*/
    }

    view() {
        this.appData.getTripInfo(this.tripID, this.userID).subscribe((data: any) => {
            console.log(data)

            this.tripInfo = data

        })
    }

    parseInt(n) {
        return parseInt(n)
    }

    closeAlertHandl() {
        if (this.action == 'buy') {
            this.navCtrl.pop() // go back
        }
    }

    buy() {
        // let pricebuy = parseInt(this.tripInfo.price) - parseInt(this.tripInfo.coin)
        let end_time = new Date(this.tripInfo.time).getTime()
        let now = new Date().getTime()
        let diff_sec = (end_time - now) / 1000

        console.log('buy clicked')

        if (diff_sec <= 0) {
            this.outDate = true
            let alert = this.alertCtrl.create({
                title: 'Lỗi',
                message: 'Chuyến hết hạn.',
                buttons: [
                    {
                        text: 'Đóng',
                        handler: (data: any) => {
                            this.closeAlertHandl()
                        }
                    }
                ]
            })
            alert.present()

            return false
        }

        if (this.tripInfo.taxiid) {
            let alert = this.alertCtrl.create({
                title: 'Lỗi',
                message: 'Chuyến đã được mua.',
                buttons: [
                    {
                        text: 'Đóng',
                        handler: (data: any) => {
                            this.closeAlertHandl()
                        }
                    }
                ]
            })
            alert.present()
            return false
        }

        if (parseInt(this.tripInfo.coin) <= 0) {
            let alert = this.alertCtrl.create({
                title: 'Lỗi',
                message: 'Chuyến chưa có sẵn.',
                buttons: [
                    {
                        text: 'Đóng',
                        handler: (data: any) => {
                            this.closeAlertHandl()
                        }
                    }
                ]
            })
            alert.present()
            return false
        }

        if (parseInt(this.tripInfo.seat) > parseInt(this.user_info.seat)) {
            let alert = this.alertCtrl.create({
                title: 'Lỗi',
                message: 'Xe của bạn không đủ chỗ để nhận chuyến này.',
                buttons: [
                    {
                        text: 'Đóng',
                        handler: (data: any) => {
                            this.closeAlertHandl()
                        }
                    }
                ]
            })
            alert.present()
            return false
        }

        if (parseInt(this.tripInfo.coin) > parseInt(this.user_info.coin)) {
            let alert = this.alertCtrl.create({
                title: 'Lỗi',
                message: 'Tài khoản của bạn không đủ tiền.',
                buttons: [
                    {
                        text: 'Đóng',
                        handler: (data: any) => {
                            this.closeAlertHandl()
                        }
                    }
                ]
            })
            alert.present()
            return false
        }


        this.appData.buyTrip(this.tripID, this.userID).subscribe((data: any) => {
            console.log(data)

            this.buyed = true
            this.owned = true
        })


        if (diff_sec > 0 && parseInt(this.tripInfo.coin) > 0 && parseInt(this.tripInfo.status) == 0 && parseInt(this.tripInfo.coin) <= parseInt(this.user_info.coin) && parseInt(this.tripInfo.seat) <= parseInt(this.user_info.seat)) {
        }
    }

    sellTrip() {

    }

}
