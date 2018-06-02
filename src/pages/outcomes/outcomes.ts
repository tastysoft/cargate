import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PhonebillPage } from '../phonebill/phonebill';
import { EmployeesalaryPage } from '../employeesalary/employeesalary';
import { RentPage } from '../rent/rent';
import { StationaryPage } from '../stationary/stationary';
import { ElectricityPage } from '../electricity/electricity';
import { AdvertisingPage } from '../advertising/advertising';
import { GeneralusePage } from '../generaluse/generaluse';
import { AnnualpartyPage } from '../annualparty/annualparty';

@Component({
  selector: 'page-outcomes',
  templateUrl: 'outcomes.html',
})
export class OutcomesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  phonebill(){
    this.navCtrl.push(PhonebillPage);
  }
  employeeSalary(){
    this.navCtrl.push(EmployeesalaryPage);
  }

  rent(){
    this.navCtrl.push(RentPage);
  }
  stationary(){
    this.navCtrl.push(StationaryPage);
  }
  electricity(){
    this.navCtrl.push(ElectricityPage);
  }
  advertising(){
    this.navCtrl.push(AdvertisingPage);
  }
  generaluse(){
    this.navCtrl.push(GeneralusePage);
  }
  annualparty(){
    this.navCtrl.push(AnnualpartyPage);
  }

}
