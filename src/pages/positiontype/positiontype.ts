import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ListpositionPage } from '../listposition/listposition';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-positiontype',
  templateUrl: 'positiontype.html',
})
export class PositiontypePage {

  position: string;
  remark: string;

  dateOfEvent: string;
  condition: any;
  private database: SQLiteObject;
  private realDate: string;
  item = [];

  public inid: any = [];
  public positionType: any = [];
  public positionRemark: any = [];
  public positionDate: any = [];
  num: number;
  dates: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private alertCtrl: AlertController,
    public keyboard: Keyboard, public datePicker: DatePicker,public file: File) {

    this.inid = this.navParams.get('positionid');
    this.positionType = this.navParams.get('positiontype');
    this.positionRemark = this.navParams.get('positionremark');
    this.positionDate = this.navParams.get('positiondate');


    this.position = this.positionType;
    this.remark = this.positionRemark;
    this.dateOfEvent = this.positionDate;

    this.sqlite.create({
      name: 'cargate.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.database = db;
      })
  }
  save() {
    if ((this.position == "" || this.position == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {

      let alert = this.alertCtrl.create({
        subTitle: 'အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let gt = "position"
      this.database.executeSql("SELECT * FROM cartypes where types='" + gt + "'", {}).then((data) => {
        if (data.rows.length > 0) {
          this.condition = "0";
          for (var i = 0; i < data.rows.length; i++) {
            if (this.position == data.rows.item(i).cartype) {
              let alert = this.alertCtrl.create({
                subTitle: 'ရာထူးအမျိုးအစားရှိပြီးပါပြီ။',
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
    if (this.remark == "" || this.remark == undefined) {
      this.remark = "";
    }
    this.database.executeSql('INSERT INTO cartypes (cartype,remark,date,types) VALUES(?,?,?,?)', [this.position, this.remark, this.dateOfEvent, "position"])
      .then((result) => {
        let alert = this.alertCtrl.create({
          subTitle: 'သွင်းပြီးပါပြီ။',
          buttons: ['OK']
        });
        alert.present();
        this.position = "";
        this.remark = "";
        this.dateOfEvent = "";
      })
      .catch(e => alert(JSON.stringify(e)));
  }

  edit() {
    if ((this.position == "" || this.position == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      let alert = this.alertCtrl.create({
        subTitle: 'အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။',
        buttons: ['OK']
      });
      alert.present();
    } else {
      if (this.remark == "" || this.remark == undefined) {
        this.remark = "";
      }
      this.database.executeSql("UPDATE cartypes set cartype='" + this.position + "', remark='" + this.remark + "', date='" + this.dateOfEvent + "' where id='" + this.inid + "'", {})
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
    this.position = "";
    this.remark = "";
    this.dateOfEvent = "";
    this.navCtrl.setRoot(ListpositionPage);
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
