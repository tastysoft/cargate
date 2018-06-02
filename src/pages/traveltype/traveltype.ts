import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ListtravelPage } from '../listtravel/listtravel';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-traveltype',
  templateUrl: 'traveltype.html',
})
export class TraveltypePage {

  travel: string;
  remark: string;
  dates: string;
  num: number;

  dateOfEvent: string;
  condition: any;
  private database: SQLiteObject;
  item = [];

  public inid: any = [];
  public travelType: any = [];
  public travelRemark: any = [];
  public travelDate: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite,private alertCtrl: AlertController
    ,public keyboard: Keyboard, public datePicker: DatePicker,public file:File) {

    this.inid = this.navParams.get('travelid');
    this.travelType = this.navParams.get('traveltype');
    this.travelRemark = this.navParams.get('travelremark');
    this.travelDate = this.navParams.get('traveldate');


    this.travel = this.travelType;
    this.remark = this.travelRemark;
    this.dateOfEvent = this.travelDate;

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

  save() {
    if ((this.travel == "" || this.travel == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      let alert = this.alertCtrl.create({
        subTitle: 'အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let traveltype="travel"
      this.database.executeSql("SELECT * FROM cartypes where types='"+traveltype+"'", {}).then((data) => {
        if (data.rows.length > 0) {
          this.condition = "0";
          for (var i = 0; i < data.rows.length; i++) {
            if (this.travel == data.rows.item(i).cartype) {
              let alert = this.alertCtrl.create({
                subTitle: 'ခရီးစဉ်ရှိပြီးပါပြီ။',
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
    this.database.executeSql('INSERT INTO cartypes (cartype,remark,date,types) VALUES(?,?,?,?)', [this.travel, this.remark, this.dateOfEvent, "travel"])
      .then((result) => {
        let alert = this.alertCtrl.create({
          subTitle: 'သွင်းပြီးပါပြီ။',
          buttons: ['OK']
        });
        alert.present();
        this.travel = "";
        this.remark = "";
        this.dateOfEvent = "";
      })
      .catch(e => alert(JSON.stringify(e)));
  }

  edit() {
    if ((this.travel == "" || this.travel == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined)) {
      let alert = this.alertCtrl.create({
        subTitle: 'အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။',
        buttons: ['OK']
      });
      alert.present();
    } else {
      if(this.remark == "" || this.remark == undefined){
        this.remark = "";
      }
      this.database.executeSql("UPDATE cartypes set cartype='" + this.travel + "', remark='" + this.remark + "', date='" + this.dateOfEvent + "' where id='" + this.inid + "'", {})
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
    this.travel = "";
    this.remark = "";
    this.dateOfEvent = "";
    this.navCtrl.setRoot(ListtravelPage);
  }

}
