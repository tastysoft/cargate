import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite';
import { TraveltypePage } from '../traveltype/traveltype';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-listtravel',
  templateUrl: 'listtravel.html',
})
export class ListtravelPage {

  public database: SQLiteObject;
  searchData: any;
  public itemsTravel: any = [];
  public val: any;
  SearchTypes: any=[];

  public listsTravel: any = [];
  selectedSearchtype: string;
  dates: string;
  num: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private alertCtrl: AlertController
    ,public keyboard: Keyboard, public datePicker: DatePicker, public file: File) {
    this.SearchTypes.push({ value: "ခရီးစဥ္" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
    this.selectedSearchtype = "";
    let ty="travel";
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
    this.navCtrl.push(TraveltypePage);
  }
  showdata() {
    this.selectData();
    this.itemsTravel = this.listsTravel;
  }
  getItems() {
    if (this.selectedSearchtype == "" || this.selectedSearchtype == undefined) {
      this.itemsTravel = [];
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
      this.itemsTravel = [];
    } else {
      if (this.selectedSearchtype == "ခရီးစဥ္") {
        if (this.val && this.val.trim() != '') {
          this.itemsTravel = this.itemsTravel.filter((item) => {
            return (item.traveltype.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.itemsTravel = [];
        }
      } else if (this.selectedSearchtype == "ရက္စြဲ") {
        if (this.val && this.val.trim() != '') {
          this.itemsTravel = this.itemsTravel.filter((item) => {
            return (item.traveldate.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
          })
        }
        else {
          this.itemsTravel = [];
        }
      }
      else {
        this.message("ရှာမည့်အမျိုးအစား မှားနေပါသည်။");
        this.itemsTravel = [];
        this.searchData = "";
      }
    }
  }
  searchType() {
    this.selectedSearchtype = "";
    this.SearchTypes = [];
    this.SearchTypes.push({ value: "ခရီးစဥ္" });
    this.SearchTypes.push({ value: "ရက္စြဲ" });
  } 
  selectData() {
    let ty = "travel";
    this.database.executeSql("SELECT id,cartype,remark, date, types FROM cartypes where types='"+ty+"'", {})
      .then((data) => {
        this.listsTravel = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsTravel.push({
              travelid: data.rows.item(i).id,
              traveltype: data.rows.item(i).cartype,
              travelremark: data.rows.item(i).remark,
              traveldate: data.rows.item(i).date
            });
          }
        }
      });
  }
  

  editTravel(listTravel) {
    let data = {
      travelid: listTravel.travelid,
      traveltype: listTravel.traveltype,
      travelremark: listTravel.travelremark,
      traveldate: listTravel.traveldate,
    };
    this.navCtrl.push(TraveltypePage, data);
  }
  deleteTravel(listTravel){
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
            let id = listTravel.travelid;
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