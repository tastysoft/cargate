import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InandoutcomeinsertPage } from '../inandoutcomeinsert/inandoutcomeinsert';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Keyboard } from '@ionic-native/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-inandoutcome',
  templateUrl: 'inandoutcome.html',
})
export class InandoutcomePage {
  dates: string;
  num: number;
  Inandout: any = [];
  listsInandout: any = [];
  selectedSearchtype: string;
  public database: SQLiteObject;
  val: string;
  searchData: any = [];
  SearchTypes: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private keyboard: Keyboard, public datePicker: DatePicker, public sqlite: SQLite,public file:File) {
    this.SearchTypes.push({ value: "ခရီးစဥ္အမ်ိဳးအစား" });
    this.SearchTypes.push({ value: "ကားအမ်ိဳးအစား" });
    this.SearchTypes.push({ value: "ကားနံပါတ္" });
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
  insertPhonebill(){
    this.navCtrl.push(InandoutcomeinsertPage);
  }
  showdata() {
    this.selectData();
    this.Inandout = this.listsInandout;
  }
  getItems() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.Inandout = [];
      this.searchData = "";
      this.message("ရှာမည့်အမျိုးအစားအမည် ရွေးပေးပါ။");
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
  searchTap() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.message("ရှာမည့်အမျိုးအစားအမည် ရွေးပေးပါ။");
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
      this.Inandout = [];
    } else {
      if (this.selectedSearchtype == "ခရီးစဥ္အမ်ိဳးအစား") {
        if (this.val && this.val.trim() != '') {
          this.Inandout = this.Inandout.filter((item) => {
            return (item.tracktype.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.Inandout = [];
        }
      } else if (this.selectedSearchtype == "ကားအမ်ိဳးအစား") {
        if (this.val && this.val.trim() != '') {
          this.Inandout = this.Inandout.filter((item) => {
            return (item.cartype.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.Inandout = [];
        }
      } else if (this.selectedSearchtype == "ကားနံပါတ္") {
        if (this.val && this.val.trim() != '') {
          this.Inandout = this.Inandout.filter((item) => {
            return (item.carnumber.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.Inandout = [];
        }
      } else if (this.selectedSearchtype == "ရက္စြဲ") {
        if (this.val && this.val.trim() != '') {
          this.Inandout = this.Inandout.filter((item) => {
            return (item.date.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.Inandout = [];
        }
      }
      else {
        this.message("ရှာမည့်အမျိုးအစား မှားနေပါသည်။");
        this.Inandout = [];
        this.searchData = "";
      }
    }
  }
  selectData() {
    this.database.executeSql("Select id,tracktype,cartype,carnumber,oil,road,times,gate,feed,carwash,air,income,remain,date,remark from inandoutCome ", {})
      .then((data) => {
        this.listsInandout = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsInandout.push({
              iNcomeid: data.rows.item(i).id,
              tracktype: data.rows.item(i).tracktype,
              cartype: data.rows.item(i).cartype,
              carnumber: data.rows.item(i).carnumber,
              oil: data.rows.item(i).oil,
              road: data.rows.item(i).road,
              times: data.rows.item(i).times,
              gate: data.rows.item(i).gate,
              feed: data.rows.item(i).feed,
              carwash: data.rows.item(i).carwash,
              air: data.rows.item(i).air,
              income: data.rows.item(i).income,
              remain: data.rows.item(i).remain,
              date: data.rows.item(i).date,
              remark: data.rows.item(i).remark
            })
          }
        }
      })
  }
  edit(item) {
    let data = {
      id: item.iNcomeid,
      tracktype: item.tracktype,
      cartype: item.cartype,
      carnumber: item.carnumber,
      oil:  item.oil,
      road:  item.road,
      times:  item.times,
      gate:  item.gate,
      feed:  item.feed,
      carwash:  item.carwash,
      air:  item.air,
      income:  item.income,
      remain:  item.remain,
      date: item.date,
      remark: item.remark
    };
    this.navCtrl.push(InandoutcomeinsertPage, data);
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
            this.database.executeSql("delete from inandoutCome where id = " + ids + "", [])
              .then(() => {
                let confirm1 = this.alertCtrl.create({
                  subTitle: 'ဖျက်ပြီးပါပြီ။',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.navCtrl.pop();
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
    this.SearchTypes.push({ value: "ခရီးစဥ္" });
    this.SearchTypes.push({ value: "ကားအမ်ိဴးအစား" });
    this.SearchTypes.push({ value: "ကားနံပါတ္" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
  }
}
