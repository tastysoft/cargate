import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { StationaryinsertPage } from '../stationaryinsert/stationaryinsert';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-stationary',
  templateUrl: 'stationary.html',
})
export class StationaryPage {
  num: number;
  dates: string;
  searchData: any;
  val: any;
  database: SQLiteObject;
  Outcome: any = [];
  listsOutcome: any = [];
  selectedSearchtype: any;
  SearchTypes: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, 
    private alertCtrl: AlertController, private datePicker: DatePicker, private keyboard: Keyboard,public file: File) {
      this.SearchTypes.push({ value: "ဂိတ္အမ်ိဳးအစား" });
      this.SearchTypes.push({ value: "ရက္စြဲ" });
      this.selectedSearchtype = "";
      this.sqlite.create({
        name: 'cargate.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.showdata();
          this.val = this.searchData;
          this.filterData();
        })
  }
  insertStationary(){
    this.navCtrl.push(StationaryinsertPage);
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
      if (this.selectedSearchtype == "ဂိတ္အမ်ိဳးအစား") {
        if (this.val && this.val.trim() != '') {
          this.Outcome = this.Outcome.filter((item) => {
            return (item.gatetype.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
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
    this.database.executeSql("Select id,subtype,outcometype,date,remark from outCome ", {})
      .then((data) => {
        this.listsOutcome = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsOutcome.push({
              iNcomeid: data.rows.item(i).id,
              gatetype: data.rows.item(i).subtype,
              stationary: data.rows.item(i).outcometype,
              date: data.rows.item(i).date,
              remark: data.rows.item(i).remark
            })
          }
        }
      })
  }
  edit(item) {
    let data = {
      incomeid: item.iNcomeid,
      gatetype: item.gatetype,
      stationary: item.stationary,
      date: item.date,
      remark: item.remark
    };
    this.navCtrl.push(StationaryinsertPage, data);
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
            this.database.executeSql("delete from outCome where id = " + ids + "", [])
              .then(() => {
                let confirm1 = this.alertCtrl.create({
                  subTitle: 'ဖျက်ပြီးပါပြီ။',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.navCtrl.pop();
                        this.navCtrl.push(this.navCtrl.getActive().component);
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
    this.SearchTypes.push({ value: "ရာထူးအမ်ိဳးအစား" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
  }

}
