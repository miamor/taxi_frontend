import { Component } from '@angular/core';
import { AlertController, App, ModalController, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';


@Component({
    selector: 'page-infrienge-detail',
    templateUrl: 'infrienge-detail.html'
})
export class InfriengeDetailPage {
    dataInfo: any
    title: any
    infID: any

    user_info: any
    userID: any

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

        this.dataInfo = this.navParams.data.dataInfo
        // this.dataInfo['title'] = this.title
        this.infID = this.navParams.data.infID

        console.log(this.dataInfo)

        this.appData.getUserInfo().then((data) => {
            this.user_info = data
            this.userID = data['id']

            this.view()
        })

    }

    view() {
        this.appData.changeInfriengeStt(this.infID, this.userID)

        this.appData.getInfriengeInfo(this.infID, this.userID).subscribe((data: any) => {
            console.log(data)

            this.dataInfo = data

        })
    }

    parseInt(n) {
        return parseInt(n)
    }

}
