import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { GatetypePage } from '../gatetype/gatetype';
import { Keyboard } from '@ionic-native/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-listgate',
  templateUrl: 'listgate.html',
})
export class ListgatePage {

  public database: SQLiteObject;
  searchData: any;
  public itemsGate: any = [];
  public val: any;

  public listsGate: any = [];
  num: number;
  dates: string;
  SearchTypes: any = [];
  selectedSearchtype: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private alertCtrl: AlertController,
    public keyboard: Keyboard, public datePicker: DatePicker, public file: File) {
      this.SearchTypes.push({ value: "ဂိတ္အမ်ိဳးအစား" });
      this.SearchTypes.push({ value: "ရက္စြဲ" });
      this.selectedSearchtype = "";
    let ty = "gate";
    this.sqlite.create({
      name: 'cargate.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.database.executeSql('CREATE TABLE IF NOT EXISTS carnumber ( id INTEGER PRIMARY KEY AUTOINCREMENT, cartype TEXT, carnum TEXT, remark TEXT, date TEXT)', {})
        .catch(error => {
          alert("CT ER" + error);
        });
        this.showdata();
        this.val = this.searchData;
        this.filterData();
      })

  }
  insertPhonebill(){
    this.navCtrl.push(GatetypePage);
  }
  getItems() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.itemsGate = [];
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
      this.itemsGate = [];
    } else {
      if (this.selectedSearchtype == "ဂိတ္အမ်ိဳးအစား") {
        if (this.val && this.val.trim() != '') {
          this.itemsGate = this.itemsGate.filter((item) => {
            return (item.gatetype.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.itemsGate = [];
        }
      } else if (this.selectedSearchtype == "ရက္စြဲ") {
        if (this.val && this.val.trim() != '') {
          this.itemsGate = this.itemsGate.filter((item) => {
            return (item.gatedate.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.itemsGate = [];
        }
      }
      else {
        this.message("ရှာမည့်အမျိုးအစား မှားနေပါသည်။");
        this.itemsGate = [];
        this.searchData = "";
      }
    }
  }
  searchType() {
    this.selectedSearchtype = "";
    this.SearchTypes = [];
    this.SearchTypes.push({ value: "ဂိတ္အမ်ိဳးအစား" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
  } 

  selectData() {
    let ty = "gate";
    this.database.executeSql("SELECT id,cartype,remark, date, types FROM cartypes where types='" + ty + "'", {})
      .then((data) => {
        this.listsGate = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsGate.push({
              gateid: data.rows.item(i).id,
              gatetype: data.rows.item(i).cartype,
              gateremark: data.rows.item(i).remark,
              gatedate: data.rows.item(i).date
            });
          }
        }
      });
  }
  showdata() {
    this.selectData();
    this.itemsGate = this.listsGate;
  }
  editGate(listGate) {
    let data = {
      gateid: listGate.gateid,
      gatetype: listGate.gatetype,
      gateremark: listGate.gateremark,
      gatedate: listGate.gatedate,
    };
    this.navCtrl.push(GatetypePage, data);
  }
  deleteGate(listGate) {
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
            let id = listGate.gateid;
            this.database.executeSql("delete from cartypes where id = " + id + "", [])
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

              }).catch(e => console.log(e));

          }
        }
      ]
    });
    confirm.present();
  }

}
