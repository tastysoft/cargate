import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CartypePage } from '../cartype/cartype';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Keyboard } from '@ionic-native/keyboard';
import { DatePicker } from '@ionic-native/date-picker';

import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-updatecartype',
  templateUrl: 'updatecartype.html',
})
export class UpdatecartypePage {

  num: number;
  dates: string;
  searchData: any;
  val: any;
  database: SQLiteObject;
  Outcome: any = [];
  listsOutcome: any = [];
  selectedSearchtype: any;
  SearchTypes: any = [];

  constructor(private menuCtrl: MenuController,private navCtrl: NavController, public navParams: NavParams, public sqlite: SQLite, private alertCtrl: AlertController, public keyboard: Keyboard, public datePicker: DatePicker, public file: File) {
    
    this.SearchTypes.push({ value: "ကားအမ်ိဳးအစား" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
    this.selectedSearchtype = "";
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

      this.database.executeSql('CREATE TABLE IF NOT EXISTS carnumber ( id INTEGER PRIMARY KEY AUTOINCREMENT, cartype TEXT, carnum TEXT, remark TEXT, date TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });

        this.database.executeSql('CREATE TABLE IF NOT EXISTS incomeReg ( id INTEGER PRIMARY KEY AUTOINCREMENT, track TEXT, cartype TEXT, carnum TEXT, owner TEXT, tracktype TEXT, date TEXT, remark TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });

        this.database.executeSql('CREATE TABLE IF NOT EXISTS income ( id INTEGER PRIMARY KEY AUTOINCREMENT, track TEXT, cartype TEXT, carnum TEXT, gateIncome TEXT, thingsIncome TEXT, date TEXT, remark TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });

        this.database.executeSql('CREATE TABLE IF NOT EXISTS outCome ( id INTEGER PRIMARY KEY AUTOINCREMENT, subtype TEXT, outcometype TEXT, remark TEXT, date TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });

        this.database.executeSql('CREATE TABLE IF NOT EXISTS annualParty ( id INTEGER PRIMARY KEY AUTOINCREMENT, place TEXT, outcome TEXT, remark TEXT, date TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });

        this.database.executeSql('CREATE TABLE IF NOT EXISTS ownIncome ( id INTEGER PRIMARY KEY AUTOINCREMENT, cartype TEXT, carnumber TEXT,income TEXT,place TEXT, remark TEXT, date TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });

        this.database.executeSql('CREATE TABLE IF NOT EXISTS ownUpdatecar ( id INTEGER PRIMARY KEY AUTOINCREMENT, cartype TEXT, carnumber TEXT,outcome TEXT, remark TEXT, date TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });
        
        this.database.executeSql('CREATE TABLE IF NOT EXISTS inandoutCome ( id INTEGER PRIMARY KEY AUTOINCREMENT, tracktype TEXT, cartype TEXT, carnumber TEXT, oil TEXT, road TEXT,times TEXT, gate TEXT, feed TEXT, carwash TEXT, air TEXT, income TEXT, remain TEXT, date TEXT, remark TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });

        this.showdata();
        this.val = this.searchData;
        this.filterData();
      })

  }
  insertPhonebill(){
    this.navCtrl.push(CartypePage);
  }
  showdata() {
    this.selectData();
    this.Outcome = this.listsOutcome;
  }
  getItems() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.Outcome = [];
      this.searchData = "";
      this.message("ရှာမည့်အမျိုးအစားအမည် ရွေးပါ။");
    } else {
      this.showdata();
      this.val = this.searchData;
      this.filterData();
    }
  }
  message(mes) {
    let alert = this.alertCtrl.create({
      subTitle: mes,
      buttons: ['OK']
    });
    alert.present();
  }
  searchTypes() {
    this.selectedSearchtype = "";
  }
  searchTap() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.message("ရှာမည့်အမျိုးအစားအမည် ရွေးပါ။");
    } else if (this.selectedSearchtype == "ရက္စြဲ") {
      this.keyboard.close();
      this.datePicker.show({
        date: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
      })
        .then((data) => {
          this.dates = data.toISOString();
          this.num = parseInt(this.dates.substring(8, 10).toString()) + 1;
          this.searchData = this.dates.substring(0, 8).toString() + this.num.toString();
          this.getItems();
          this.keyboard.close();
        })
        .catch(() => {
          this.searchData = "";
          this.getItems();
          this.keyboard.close();
        })

    }
  }
  filterData() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.Outcome = [];
    } else {
      if (this.selectedSearchtype == "ကားအမ်ိဳးအစား") {
        if (this.val && this.val.trim() != '') {
          this.Outcome = this.Outcome.filter((item) => {
            return (item.cartype.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.Outcome = [];
        }
      } else if (this.selectedSearchtype == "ရက္စြဲ") {
        if (this.val && this.val.trim() != '') {
          this.Outcome = this.Outcome.filter((item) => {
            return (item.date.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.Outcome = [];
        }
      }
      else {
        this.message("ရှာမည့်အမျိုးအစား မှားနေပါသည်။");
        this.Outcome = [];
        this.searchData = "";
      }
    }
  }
  selectData() {
    this.database.executeSql("Select id,cartype,carnum,date,remark from carnumber ", {})
      .then((data) => {
        this.listsOutcome = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsOutcome.push({
              iNcomeid: data.rows.item(i).id,
              cartype: data.rows.item(i).cartype,
              carnumber: data.rows.item(i).carnum,
              date: data.rows.item(i).date,
              remark: data.rows.item(i).remark
            })
          }
        }
      })
      .catch(e => alert(e.toISOString()));
  }
  edit(item) {
    let data = {
      id: item.iNcomeid,
      cartype: item.cartype,
      carnumber: item.carnumber,
      date: item.date,
      remark: item.remark
    };
    this.navCtrl.push(CartypePage, data);
  }
  delete(item) {
    let confirm = this.alertCtrl.create({
      subTitle: 'ဖျက်ရန်သေချာပြီလား။',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            let ids = item.iNcomeid;
            this.database.executeSql("delete from carnumber where id = " + ids + "", [])
              .then(() => {
                let confirm1 = this.alertCtrl.create({
                  subTitle: 'ဖျက်ပြီးပါပြီ။',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    }
                  ]
                });
                confirm1.present();

              }).catch(e => alert(e));

          }
        }
      ]
    });
    confirm.present();
  }
  searchType() {
    this.selectedSearchtype = "";
    this.SearchTypes = [];
    this.SearchTypes.push({ value: "ကားအမ်ိဳးအစား" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
  }
}
