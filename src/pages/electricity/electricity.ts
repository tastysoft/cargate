import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ElectricityinsertPage } from '../electricityinsert/electricityinsert';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';


@Component({
  selector: 'page-electricity',
  templateUrl: 'electricity.html',
})
export class ElectricityPage {
  num: number;
  dates: string;
  public database: SQLiteObject;
  searchData: any;
  public Electricity: any = [];
  public val: any;

  public listsElectricity: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SQLite, private alertCtrl: AlertController,
    public keyboard: Keyboard, public datePicker: DatePicker,public file: File) {
     
    this.sqlite.create({
      name: 'cargate.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.database = db;
      })
  }
  selectData() {
    let ty = "electricity";
    this.database.executeSql("SELECT id,cartype,remark,date FROM cartypes where types='" + ty + "'", {})
      .then((data) => {
        this.listsElectricity = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.listsElectricity.push({
              id: data.rows.item(i).id,
              electricity: data.rows.item(i).cartype,
              remark: data.rows.item(i).remark,
              date: data.rows.item(i).date,
            });
          }
        }
      });
  }
  showdata() {
    this.selectData();
    this.Electricity = this.listsElectricity;
  }

  getItems() {
    this.showdata();
    this.val = this.searchData;
    this.filterData();
  }

  filterData() {
    if (this.val && this.val.trim() != '') {
      this.Electricity = this.Electricity.filter((item) => {
        return (item.date.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
      })
    } else {
      this.Electricity = [];
    }
  }
  edit(item) {
    let data = {
      id: item.id,
      electricity: item.electricity,
      remark: item.remark,
      date: item.date,
    };
    this.navCtrl.push(ElectricityinsertPage, data);
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
            let id = item.id;
            this.database.executeSql("Delete from cartypes where id = " + id + "", [])
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

              }).catch(e => console.log(e));

          }
        }
      ]
    });
    confirm.present();

  }

  searchTap() {
    this.keyboard.close();
    this.selectData();
    this.searchData = "";
    this.val = this.searchData;
    this.filterData();
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

  insertRent(){
    this.navCtrl.push(ElectricityinsertPage);
  }

}
