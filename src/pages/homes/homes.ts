import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InandoutcomePage } from '../inandoutcome/inandoutcome';
import { OwnupdatecarPage } from '../ownupdatecar/ownupdatecar';
import { OwnincomePage } from '../ownincome/ownincome';
import { OutcomesPage } from '../outcomes/outcomes';
import { ListincomePage } from '../listincome/listincome';
import { ListincomeregisterPage } from '../listincomeregister/listincomeregister';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AboutusPage } from '../aboutus/aboutus';


@Component({
  selector: 'page-homes',
  templateUrl: 'homes.html',
})
export class HomesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController) {
    this.menuCtrl.enable(true, 'MyMenu');
  }

  incomerecord(){
    this.navCtrl.push(ListincomeregisterPage);
  }
  aboutus(){
    this.navCtrl.push(AboutusPage);
  }

  income(){
    this.navCtrl.push(ListincomePage);
  }

  outgo(){
    this.navCtrl.push(OutcomesPage);
  }

  ownincome(){
    this.navCtrl.push(OwnincomePage);
  }

  owncarupdate(){
    this.navCtrl.push(OwnupdatecarPage);
  }

  inandout(){
    this.navCtrl.push(InandoutcomePage);
  }
}
