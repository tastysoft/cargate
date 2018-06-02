import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { PositiontypePage } from '../positiontype/positiontype';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-listposition',
  templateUrl: 'listposition.html',
})
export class ListpositionPage {
  public database: SQLiteObject;
  searchData: any;
  public itemsPosition: any = [];
  public val: any;

  public listsPosition: any = [];

  num: number;
  dates: string;
  SearchTypes: any = [];
  selectedSearchtype: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private alertCtrl: AlertController,
    public keyboard: Keyboard, public datePicker: DatePicker,public file: File) {
      this.SearchTypes.push({ value: "ရာထူးအမ်ိဳးအစား" });
      this.SearchTypes.push({ value: "ရက္စြဲ" });
      this.selectedSearchtype = "";
    let ty = "position";
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

  selectData() {
    let ty = "position";
    this.database.executeSql("SELECT id,cartype,remark, date, types FROM cartypes where types='" + ty + "'", {})
      .then((data) => {
        this.listsPosition = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsPosition.push({
              positionid: data.rows.item(i).id,
              positiontype: data.rows.item(i).cartype,
              positionremark: data.rows.item(i).remark,
              positiondate: data.rows.item(i).date
            });
          }
        }
      });
  }
  insertPhonebill(){
    this.navCtrl.push(PositiontypePage);
  }
  showdata() {
    this.selectData();
    this.itemsPosition = this.listsPosition;
  } 
  getItems() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.itemsPosition = [];
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
      this.itemsPosition = [];
    } else {
      if (this.selectedSearchtype == "ရာထူးအမ်ိဳးအစား") {
        if (this.val && this.val.trim() != '') {
          this.itemsPosition = this.itemsPosition.filter((item) => {
            return (item.positiontype.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.itemsPosition = [];
        }
      } else if (this.selectedSearchtype == "ရက္စြဲ") {
        if (this.val && this.val.trim() != '') {
          this.itemsPosition = this.itemsPosition.filter((item) => {
            return (item.positiondate.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.itemsPosition = [];
        }
      }
      else {
        this.message("ရှာမည့်အမျိုးအစား မှားနေပါသည်။");
        this.itemsPosition = [];
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
  editPosition(listPosition) {
    let data = {
      positionid: listPosition.positionid,
      positiontype: listPosition.positiontype,
      positionremark: listPosition.positionremark,
      positiondate: listPosition.positiondate,
    };
    this.navCtrl.push(PositiontypePage, data);
  }
  deletePosition(listPosition) {
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
            let id = listPosition.positionid;
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
