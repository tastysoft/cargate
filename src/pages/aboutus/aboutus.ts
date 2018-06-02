import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private callNumber: CallNumber) {
    
  }
  callnumber1(){
    this.callNumber.callNumber("09 258 259 091",true);
  }
  callnumber2(){
    this.callNumber.callNumber("09 798 919 772",true);
  }

}
