import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Keyboard } from '@ionic-native/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { OwnincomeinsertPage } from '../ownincomeinsert/ownincomeinsert';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-ownincome',
  templateUrl: 'ownincome.html',
})
export class OwnincomePage {
  num: number;
  dates: string;
  searchData: any;
  val: any;
  IncomeReg: any = [];
  listsIncomeReg: any = [];
  selectedSearchtype: any;
  SearchTypes: any = [];
  private database: SQLiteObject;
  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SQLite,
    public alertCtrl: AlertController, public keyboard: Keyboard, public datePicker: DatePicker, public file:File) {
      this.SearchTypes.push({ value: "ကားအမ်ိဳးအစား" });
      this.SearchTypes.push({ value: "ကားနံပါတ္" });
      this.SearchTypes.push({ value: "ေနရာ" });
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
  insertPhonebill(){
    this.navCtrl.push(OwnincomeinsertPage);
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
      if (this.selectedSearchtype == "ကားအမ်ိဳးအစား") {
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
      } else if (this.selectedSearchtype == "ေနရာ") {
        if (this.val && this.val.trim() != '') {
          this.IncomeReg = this.IncomeReg.filter((item) => {
            return (item.place.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
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
    this.database.executeSql("Select id,cartype,carnumber,income,place,date,remark from ownIncome ", {})
      .then((data) => {
        this.listsIncomeReg = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsIncomeReg.push({
              id: data.rows.item(i).id,
              cartype: data.rows.item(i).cartype,
              carnumber: data.rows.item(i).carnumber,
              income: data.rows.item(i).income,
              place: data.rows.item(i).place,
              date: data.rows.item(i).date,
              remark: data.rows.item(i).remark
            })
          }
        }
      })
  }
  edit(item) {
    let data = {
      id: item.id,
      cartype: item.cartype,
      carnumber: item.carnumber,
      income: item.income,
      place: item.place,
      date: item.date,
      remark: item.remark
    };
    this.navCtrl.push(OwnincomeinsertPage, data);
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
            let ids = item.id;
            this.database.executeSql("delete from ownIncome where id = " + ids + "", [])
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
    this.SearchTypes.push({ value: "ကားအမ်ိဳးအစား" });
    this.SearchTypes.push({ value: "ကားနံပါတ္" });
    this.SearchTypes.push({ value: "ေနရာ" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
  }

}
