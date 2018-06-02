import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { OutcomesPage } from '../outcomes/outcomes';
import { GeneralusePage } from '../generaluse/generaluse';
import { HomesPage } from '../homes/homes';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-generaluseinsert',
  templateUrl: 'generaluseinsert.html',
})
export class GeneraluseinsertPage {
  electricity: string;
  remark: string;

  dateOfEvent: string;
  private database: SQLiteObject;

  public inid: any = [];
  public eLectricity: any = [];
  public eLectricityremark: any = [];
  public eLectricitydate: any = [];
  num: number;
  dates: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SQLite, public alertCtrl: AlertController,
    public keyboard: Keyboard, public datePicker: DatePicker,public file: File) {
      this.inid = this.navParams.get('id');
      this.eLectricity = this.navParams.get('electricity');
      this.eLectricityremark = this.navParams.get('remark');
      this.eLectricitydate = this.navParams.get('date');
  
  
      this.electricity = this.eLectricity;
      this.remark = this.eLectricityremark;
      this.dateOfEvent = this.eLectricitydate;
  
  
      this.sqlite.create({
        name: 'cargate.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
  
          this.database.executeSql('CREATE TABLE IF NOT EXISTS cartypes ( id INTEGER PRIMARY KEY AUTOINCREMENT, cartype TEXT, remark TEXT, date TEXT, types TEXT)', {})
            .catch(error => {
              alert("CT ER" + error);
            });
  
        });
  } message(mes) {
    let alert = this.alertCtrl.create({
      subTitle: mes,
      buttons: ['OK']
    });
    alert.present();
  }
  save() {
    if ((this.electricity == "" || this.electricity == undefined) && (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      this.message('ကုန်ကျငွေနှင့် ရက်စွဲဖြည့်ပါ။');
    } else if ((this.electricity != "" || this.electricity != undefined) && (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      this.message('ရက်စွဲဖြည့်ပါ။');
    } else if ((this.electricity == "" || this.electricity == undefined) && (this.dateOfEvent != "" || this.dateOfEvent != undefined)) {
      this.message('ကုန်ကျငွေဖြည့်ပါ။');
    } else {
      this.insertCarnumber();
    }
  }
  insertCarnumber() {
    if (this.remark == "" || this.remark == undefined) {
      this.remark = "";
    }
    let ty = "generaluse";
    this.database.executeSql('Insert into cartypes (cartype,remark,date,types) values (?,?,?,?)', [this.electricity, this.remark, this.dateOfEvent, ty])
      .then((result) => {
        this.message('သွင်းပြီးပါပြီ။');
        this.electricity = "";
        this.remark = "";
        this.dateOfEvent = "";
      })
  }

  edit() {
    if ((this.electricity == "" || this.electricity == undefined) && (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      this.message('ကုန်ကျငွေနှင့် ရက်စွဲဖြည့်ပါ။');
    } else if ((this.electricity != "" || this.electricity != undefined) && (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      this.message('ရက်စွဲဖြည့်ပါ။');
    } else if ((this.electricity == "" || this.electricity == undefined) && (this.dateOfEvent != "" || this.dateOfEvent != undefined)) {
      this.message('ကုန်ကျငွေဖြည့်ပါ။');
    } else {
      if (this.remark == "" || this.remark == undefined) {
        this.remark = "";
      }
      this.database.executeSql("UPDATE carnumber set cartype='" + this.electricity + "', remark='" + this.remark + "', date='" + this.dateOfEvent + "' where id='" + this.inid + "'", {})
        .then((result) => {
          let alert = this.alertCtrl.create({
            subTitle: 'ပြင်ပြီးပါပြီ။',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.updatedata();
              }
            }]
          });
          alert.present();
        })
        .catch(e => alert(JSON.stringify(e)));
    }
  }
  updatedata() {
    this.electricity = "";
    this.remark = "";
    this.dateOfEvent = "";
    this.navCtrl.setRoot(HomesPage);
    this.navCtrl.push(OutcomesPage);
    this.navCtrl.push(GeneralusePage);
  }
  dateTap(){
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
