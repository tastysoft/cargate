import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { OutcomesPage } from '../outcomes/outcomes';
import { AnnualpartyPage } from '../annualparty/annualparty';
import { HomesPage } from '../homes/homes';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-annualpartyinsert',
  templateUrl: 'annualpartyinsert.html',
})
export class AnnualpartyinsertPage {
  dates: string;
  num: number;
  GateTypes: any = [];
  selectedGatetype: string;
  phonebill: string;
  dateOfEvent: string;
  remark: string;
  public iD: any = [];
  public gAtetype: any = [];
  public pHonebill: any = [];
  public dAte: any = [];
  public rEmark: any = [];
  private database: SQLiteObject;
  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SQLite, public alertCtrl: AlertController,
    public keyboard: Keyboard, public datePicker: DatePicker, public file: File) {
    this.iD = this.navParams.get('incomeid');
    this.gAtetype = this.navParams.get('gatetype');
    this.pHonebill = this.navParams.get('phonebill');
    this.dAte = this.navParams.get('date');
    this.rEmark = this.navParams.get('remark');

    this.selectedGatetype = this.gAtetype;
    this.phonebill = this.pHonebill;
    this.dateOfEvent = this.dAte;
    this.remark = this.rEmark;


    this.sqlite.create({
      name: 'cargate.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.database.executeSql('CREATE TABLE IF NOT EXISTS annualParty ( id INTEGER PRIMARY KEY AUTOINCREMENT, place TEXT, outcome TEXT, remark TEXT, date TEXT)', {})
          .catch(error => {
            alert("CT ER" + error);
          });
      })
  }
  message(mes) {
    let alert = this.alertCtrl.create({
      subTitle: mes,
      buttons: ['Ok']
    });
    alert.present();
  }
  save() {
    if (((this.selectedGatetype == "" || this.selectedGatetype == undefined) || (this.phonebill == "" || this.phonebill == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined))) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if (this.remark == "" || this.remark == undefined) {
        this.remark = "";
      }
      this.database.executeSql('Insert into annualParty (place,outcome,date,remark) values (?,?,?,?)', [this.selectedGatetype, this.phonebill, this.dateOfEvent, this.remark])
        .then((data) => {
          this.message('သွင်းပြီးပါပြီ။');
          this.clean();
        })
    }
  }
  clean() {
    this.selectedGatetype = "";
    this.phonebill = "";
    this.remark = "";
    this.dateOfEvent = "";
  }
  edit() {
    if (((this.selectedGatetype == "" || this.selectedGatetype == undefined) || (this.phonebill == "" || this.phonebill == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined))) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if (this.remark == "" || this.remark == undefined) {
        this.remark = "";
      }
      this.database.executeSql("Update outCome set subtype='" + this.selectedGatetype + "', outcometype='" + this.phonebill + "', date='" + this.dateOfEvent + "',remark='" + this.remark + "' where id='" + this.iD + "'", {})
        .then((result) => {
          let alert = this.alertCtrl.create({
            subTitle: 'ပြင်ပြီးပါပြီ။',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.clean();
                this.navCtrl.setRoot(HomesPage);
                this.navCtrl.push(OutcomesPage);
                this.navCtrl.push(AnnualpartyPage);
              }
            }]
          });
          alert.present();
        })
    }
  }
  dateTap() {
    this.keyboard.close();
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    })
      .then((data) => {
        this.dates = data.toISOString();
        this.num = parseInt(this.dates.substring(8, 10).toString()) + 1;
        this.dateOfEvent = this.dates.substring(0, 8).toString() + this.num.toString();
        this.keyboard.close();
      })
      .catch(() => {
        this.dateOfEvent = "";
        this.keyboard.close();
      })
  }
}
