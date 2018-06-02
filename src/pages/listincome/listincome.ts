import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { IncomeinsertPage } from '../incomeinsert/incomeinsert';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-listincome',
  templateUrl: 'listincome.html',
})
export class ListincomePage {
  num: number;
  dates: string;
  searchData: any;
  val: any;
  database: SQLiteObject;
  IncomeReg: any = [];
  listsIncomeReg: any = [];
  selectedSearchtype: any;
  SearchTypes: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, 
    private alertCtrl: AlertController, private datePicker: DatePicker, private keyboard: Keyboard,public file: File) {
    this.SearchTypes.push({ value: "ခရီးစဥ္" });
    this.SearchTypes.push({ value: "ကားအမ်ိဴးအစား" });
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
  showdata() {
    this.selectData();
    this.IncomeReg = this.listsIncomeReg;
  }
  getItems() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.IncomeReg = [];
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
      this.IncomeReg = [];
    } else {
      if (this.selectedSearchtype == "ခရီးစဥ္") {
        if (this.val && this.val.trim() != '') {
          this.IncomeReg = this.IncomeReg.filter((item) => {
            return (item.track.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.IncomeReg = [];
        }
      } else if (this.selectedSearchtype == "ကားအမ်ိဴးအစား") {
        if (this.val && this.val.trim() != '') {
          this.IncomeReg = this.IncomeReg.filter((item) => {
            return (item.cartype.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.IncomeReg = [];
        }
      } else if (this.selectedSearchtype == "ကားနံပါတ္") {
        if (this.val && this.val.trim() != '') {
          this.IncomeReg = this.IncomeReg.filter((item) => {
            return (item.carnumber.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.IncomeReg = [];
        }
      } else if (this.selectedSearchtype == "ရက္စြဲ") {
        if (this.val && this.val.trim() != '') {
          this.IncomeReg = this.IncomeReg.filter((item) => {
            return (item.date.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.IncomeReg = [];
        }
      }
      else {
        this.message("ရှာမည့်အမျိုးအစား မှားနေပါသည်။");
        this.IncomeReg = [];
        this.searchData = "";
      }
    }
  }
  selectData() {
    this.database.executeSql("Select id,track,cartype,carnum,gateIncome,thingsIncome,date,remark from income ", {})
      .then((data) => {
        this.listsIncomeReg = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsIncomeReg.push({
              iNcomeid: data.rows.item(i).id,
              track: data.rows.item(i).track,
              cartype: data.rows.item(i).cartype,
              carnumber: data.rows.item(i).carnum,
              gateIncome: data.rows.item(i).gateIncome,
              thingsIncome: data.rows.item(i).thingsIncome,
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
      track: item.track,
      cartype: item.cartype,
      carnum: item.carnumber,
      gateIncome: item.gateIncome,
      thingsIncome: item.thingsIncome,
      date: item.date,
      remark: item.remark
    };
    this.navCtrl.push(IncomeinsertPage, data);
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
            this.database.executeSql("delete from income where id = " + ids + "", [])
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
    this.SearchTypes.push({ value: "ခရီးစဥ္" });
    this.SearchTypes.push({ value: "ကားအမ်ိဴးအစား" });
    this.SearchTypes.push({ value: "ကားနံပါတ္" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
  }
  insertPhonebill(){
    this.navCtrl.push(IncomeinsertPage);
  }

}
