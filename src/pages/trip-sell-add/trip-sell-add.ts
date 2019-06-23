import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, App, ViewController, ModalController, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AppData } from '../../providers/app-data';

declare var google;

@Component({
    selector: 'page-trip-sell-add',
    templateUrl: 'trip-sell-add.html'
})
export class TripSellAddPage {
    @ViewChild('map') mapElement: ElementRef
    map: any

    user_info: any
    userID: any

    data: any
    params: any = {}

    apiKey: any = 'AIzaSyD7iBIhRsXT0SzEJTxSxyOkqJvTYvBS2h4'

    constructor(
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public appData: AppData,
    ) {
        /* load google map script dynamically */
        const script = document.createElement('script')
        script.id = 'google'
        if (this.apiKey) {
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing,geometry,places&key=' + this.apiKey
        } else {
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing,geometry,places&key='
        }
        document.head.appendChild(script)

        // wait a bit to make sure the script is loaded
        setTimeout(() => {
            let mapOptions = {
                // center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
            this.searchBar()
        }, 500)

        this.appData.getUserInfoPromise().then((data) => {
            this.user_info = data
            this.userID = data['id']
        })
    }

    ionViewDidLoad() {

    }

    ionViewWillEnter() {
        /*this.appData.loadTour(this.navParams.data.tripInfoId).subscribe((data: any) => {
            this.tripInfo = data;
            console.log(this.tripInfo);
        });*/
    }

    parseInt(n) {
        return parseInt(n)
    }


    searchBar() {
        // let $scope = this

        // let sidebar = document.getElementById('pac-sidebar')
        let from = document.getElementById('pac-from'),
            to = document.getElementById('pac-to')

        let options = { componentRestrictions: { country: 'vn' } }

        let autocomplete_from = new google.maps.places.Autocomplete(from, options)
        let autocomplete_to = new google.maps.places.Autocomplete(to, options)

        google.maps.event.addDomListener(from, 'keydown', function (e) {
            //console.log('keydown!')
            if (e.keyCode == 13 && document.getElementsByClassName("pac-container")[0]) {
                e.preventDefault()
            }
        })

        google.maps.event.trigger(to, 'keydown', function (e) {
            //console.log(e.keyCode);
            if (e.keyCode === 13 && !e.triggered) {
                google.maps.event.trigger(this, 'keydown', { keyCode: 40 })
                google.maps.event.trigger(this, 'keydown', { keyCode: 13, triggered: true })
            }
        })

        google.maps.event.addListener(autocomplete_to, 'place_changed', function () {
            let place = autocomplete_to.getPlace()
            if (place.geometry) {
                (<HTMLInputElement>document.getElementById('end')).value = place.formatted_address
            }
        })

        google.maps.event.addListener(autocomplete_from, 'place_changed', function () {
            let place = autocomplete_from.getPlace()
            if (place.geometry) {
                (<HTMLInputElement>document.getElementById('start')).value = place.formatted_address
            }
        })
    }

    select_seat(seat) {
        (<HTMLInputElement>document.getElementById('seat')).value = seat
        let sones = document.getElementsByClassName('sone')
        for (let i = 0; i < sones.length; i++) {
            sones[i].classList.remove('active')
            if (sones[i].id == 'seat' + seat) {
                sones[i].classList.add('active')
            }
        }
    }

    dismiss(data?: any) {
        this.viewCtrl.dismiss(data);
    }


    getPrice(frAr, toAr, distance, seat) {
        let fromDistrict = frAr[frAr.length - 3].trim(), // quận đi
            toDistrict = toAr[toAr.length - 3].trim() // quận đến

        let mult = 10
        if (seat == 7) mult = 12

        let priceThisTrip = parseFloat(distance) * mult
        if (seat == 16) priceThisTrip = 1

        if ((fromDistrict == 'Cầu Giấy' || fromDistrict == 'Đống Đa' || fromDistrict == 'Ba Đình' || fromDistrict == 'Hai Bà Trưng' || fromDistrict == 'Nam Từ Liêm' || fromDistrict == 'Bắc Từ Liêm') && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5) { priceThisTrip = 190 }
            else if (seat == 7) { priceThisTrip = 300 }
        }

        if ((toDistrict == 'Cầu Giấy' || toDistrict == 'Đống Đa' || toDistrict == 'Ba Đình' || toDistrict == 'Hai Bà Trưng' || toDistrict == 'Nam Từ Liêm' || toDistrict == 'Bắc Từ Liêm') && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5) { priceThisTrip = 250 }
            else if (seat == 7) { priceThisTrip = 350 }
        }

        if (fromDistrict == 'Gia Lâm' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250
            else if (seat == 7)
                priceThisTrip = 350
        }

        if (toDistrict == 'Gia Lâm' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 300
            else
                priceThisTrip = 370
        }

        if (fromDistrict == 'Thanh Xuân' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 230;
            else if (seat == 7)
                priceThisTrip = 320;
        }

        if (toDistrict == 'Thanh Xuân' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250;
            else if (seat == 7)
                priceThisTrip = 330;
        }

        if (fromDistrict == 'Long Biên' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 230;
            else if (seat == 7)
                priceThisTrip = 320;
        }

        if (toDistrict == 'Long Biên' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 260;
            else if (seat == 7)
                priceThisTrip = 350;
        }

        if (fromDistrict == 'Hà Đông' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250;
            else if (seat == 7)
                priceThisTrip = 350;
        }

        if (toDistrict == 'Hà Đông' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 270;
            else if (seat == 7)
                priceThisTrip = 370;
        }

        if (fromDistrict == 'Thanh Trì' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250;
            else if (seat == 7)
                priceThisTrip = 350;
        }

        if (toDistrict == 'Thanh Trì' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 300;
            else if (seat == 7)
                priceThisTrip = 370;
        }

        if (fromDistrict == 'Hoàng Mai' && toDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 250;
            else if (seat == 7)
                priceThisTrip = 350;
        }

        if (toDistrict == 'Hoàng Mai' && fromDistrict == 'Sóc Sơn') {
            if (seat == 4 || seat == 5)
                priceThisTrip = 280;
            else if (seat == 7)
                priceThisTrip = 370;
        }

        return priceThisTrip
    }

    request(form: NgForm) {
        if (form.valid) {
            let from = (<HTMLInputElement>document.getElementById('start')).value,
                to = (<HTMLInputElement>document.getElementById('end')).value,
                seat = parseInt((<HTMLInputElement>document.getElementById('seat')).value)

            let frAr = from.split(','),
                toAr = to.split(','),
                distance = document.getElementById('box-search-one-distance').innerHTML
            this.params.price = this.getPrice(frAr, toAr, distance, seat)

            this.params.from = from
            this.params.to = to
            this.params.seat = seat
            this.params.time = this.params.time_date + ' ' + this.params.time_time + ':00'
            this.params.guess_num = parseInt(this.params.guess_num)

            this.params.taxiid = this.userID

            console.log(this.params)

            if (this.params.name && this.params.phone && from && to && seat > 0 && this.params.guess_num > 0 && this.params.time && this.params.price) {
                this.appData.addTrip(this.params).subscribe((data: any) => {
                    console.log(data)
                    if (data == 1) {
                        let alert = this.alertCtrl.create({
                            title: 'Thành công',
                            message: 'Quý khách đã đặt xe thành công. Nhân viên công ty sẽ liên hệ để xác nhận với quý khách ngay bây giờ. Cảm ơn quý khác đã tin tưởng và sử dụng dịch vụ của công ty Đông Dương D.C. Trân trọng.',
                            buttons: [
                                {
                                    text: 'Đóng',
                                    handler: (data: any) => {
                                        this.closeAlertHandl()
                                        location.reload()
                                    }
                                }
                            ]
                        })
                        alert.present()
                    }
                })
            }
        } else {
            let alert = this.alertCtrl.create({
                title: 'Lỗi',
                message: 'Bạn phải nhập đầy đủ thông tin để đặt xe.',
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
        }
    }

    closeAlertHandl() {
        // this.navCtrl.pop() // go back
    }

}
