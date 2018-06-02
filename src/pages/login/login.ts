import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Platform } from 'ionic-angular/platform/platform';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { UpdatecartypePage } from '../updatecartype/updatecartype';
import { HomesPage } from '../homes/homes';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private faio: FingerprintAIO, private platform: Platform, private menuCtrl: MenuController, public file: File) {
    this.menuCtrl.enable(false,'MyMenu');
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password',
      disableBackup: false,
      localizedFallbackTitle: 'Use Pin',
      localizedReason: 'Please authenticate'
    })
    .then((result) => {
      this.navCtrl.setRoot(HomesPage);
    })
    .catch((e) => {
      this.platform.exitApp();
    })
  }

  ionViewDidLoad() {
    // this.faio.show({
    //   clientId: 'Fingerprint-Demo',
    //   clientSecret: 'password',
    //   disableBackup: false,
    //   localizedFallbackTitle: 'Use Pin',
    //   localizedReason: 'Please authenticate'
    // })
    // .then((result) => {
    //   this.navCtrl.setRoot(UpdatecartypePage);
    // })
    // .catch((e) => {
    //   this.platform.exitApp();
    // })
  }
  open(){
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password',
      disableBackup: false,
      localizedFallbackTitle: 'Use Pin',
      localizedReason: 'Please authenticate'
    })
    .then((result) => {
      this.navCtrl.setRoot(HomesPage);
    })
    .catch((e) => {
      this.platform.exitApp();
    })
  }
}
