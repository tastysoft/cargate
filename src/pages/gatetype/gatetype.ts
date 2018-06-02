import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ListgatePage } from '../listgate/listgate';
import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-gatetype',
  templateUrl: 'gatetype.html',
})
export class GatetypePage {
  gate: string;
  remark: string;

  dateOfEvent: string;
  condition: any;
  private database: SQLiteObject;
  dates: string;
  num: number;
  item = [];

  public inid: any = [];
  public gateType: any = [];
  public gateRemark: any = [];
  public gateDate: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private alertCtrl: AlertController
    ,public datePicker: DatePicker, public keyboard: Keyboard, public file: File) {

    this.inid = this.navParams.get('gateid');
    this.gateType = this.navParams.get('gatetype');
    this.gateRemark = this.navParams.get('gateremark');
    this.gateDate = this.navParams.get('gatedate');


    this.gate = this.gateType;
    this.remark = this.gateRemark;
    this.dateOfEvent = this.gateDate;

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
      })
  }
  save() {
    if ((this.gate == "" || this.gate == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      let alert = this.alertCtrl.create({
        subTitle: 'အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let gt = "gate"
      this.database.executeSql("SELECT * FROM cartypes where types='" + gt + "'", {}).then((data) => {
        if (data.rows.length > 0) {
          this.condition = "0";
          for (var i = 0; i < data.rows.length; i++) {
            if (this.gate == data.rows.item(i).cartype) {
              let alert = this.alertCtrl.create({
                subTitle: 'ဂိတ်အမျိုးအစားရှိပြီးပါပြီ။',
                buttons: ['OK']
              });
              alert.present();
              this.condition = "1";
              break;
            }
          }
          if (this.condition !== "1") {
            this.insertData();
          }
        }
        else {
          this.insertData();
        }
      })
        .catch(e => alert(e));
    }
  }

  insertData() {
    if(this.remark == "" || this.remark == undefined){
      this.remark = "";
    }
    this.database.executeSql('INSERT INTO cartypes (cartype,remark,date,types) VALUES(?,?,?,?)', [this.gate, this.remark, this.dateOfEvent, "gate"])
      .then((result) => {
        let alert = this.alertCtrl.create({
          subTitle: 'သွင်းပြီးပါပြီ။',
          buttons: ['OK']
        });
        alert.present();
        this.gate = "";
        this.remark = "";
        this.dateOfEvent = "";
      })
      .catch(e => alert(JSON.stringify(e)));
  }

  edit() {
    if ((this.gate == "" || this.gate == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      let alert = this.alertCtrl.create({
        subTitle: 'အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။',
        buttons: ['OK']
      });
      alert.present();
    } else {
      if(this.remark == "" || this.remark == undefined){
        this.remark = "";
      }
      this.database.executeSql("UPDATE cartypes set cartype='" + this.gate + "', remark='" + this.remark + "', date='" + this.dateOfEvent + "' where id='" + this.inid + "'", {})
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
    this.gate = "";
    this.remark = "";
    this.dateOfEvent = "";
    this.navCtrl.setRoot(ListgatePage);
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
