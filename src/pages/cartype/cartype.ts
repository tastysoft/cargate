import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular';
import { UpdatecartypePage } from '../updatecartype/updatecartype';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-cartype',
  templateUrl: 'cartype.html',
})
export class CartypePage {

  cartype: string;
  remark: string;
  carnumber: string;

  dateOfEvent: string;
  private condition: string;
  private database: SQLiteObject;
  private realDate: string;
  item = [];

  public inid: any = [];
  public carType: any = [];
  public carTyperemark: any = [];
  public carTypedate: any = [];
  public carTypenumber: any = [];

  dates: string;
  num: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, public alertCtrl: AlertController
    ,public keyboard: Keyboard, public datePicker: DatePicker,public file:File) {

    this.inid = this.navParams.get('id');
    this.carType = this.navParams.get('cartype');
    this.carTyperemark = this.navParams.get('remark');
    this.carTypedate = this.navParams.get('date');
    this.carTypenumber = this.navParams.get('carnumber');


    this.cartype = this.carType;
    this.remark = this.carTyperemark;
    this.carnumber = this.carTypenumber
    this.dateOfEvent = this.carTypedate;

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

          this.database.executeSql('CREATE TABLE IF NOT EXISTS cartypes ( id INTEGER PRIMARY KEY AUTOINCREMENT, cartype TEXT, remark TEXT, date TEXT, types TEXT)', {})
          .catch(error => {
            alert("CT ER" + error);
          });

      });

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
  message(mes){
    let alert = this.alertCtrl.create({
      subTitle: mes,
      buttons: ['OK']
    });
    alert.present();
  }
  save() {
    if((this.cartype == "" || this.cartype == undefined) || (this.carnumber == "" || this.carnumber==undefined) || (this.dateOfEvent == "" || this.dateOfEvent==undefined)) {
     this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      this.database.executeSql("select * from carnumber", {}).then ((data) => {
        if(data.rows.length > 0){
          this.condition = "0";
          for(var i = 0; i < data.rows.length; i++){
            if((this.carnumber == data.rows.item(i).carnum) && (this.cartype == data.rows.item(i).cartype)){
              this.message('စာရင်းတွင်ရှိပြီးပါပြီ။');
              this.condition = "1";
              break;
            }
          }
          if(this.condition !== "1"){
            this.insertCarnumber();
          }
        }else{
          this.insertCarnumber();
        }
      })
    }
  }
  insertCarnumber(){
    if(this.remark == "" || this.remark == undefined){
      this.remark="";
    }
    this.database.executeSql('Insert into carnumber (cartype,carnum,remark,date) values (?,?,?,?)',[this.cartype,this.carnumber,this.remark,this.dateOfEvent])
      .then((result) => {
       this.message('သွင်းပြီးပါပြီ။');
        this.cartype = "";
        this.remark = "";
        this.carnumber = "";
        this.dateOfEvent = "";
      })
  }

  edit() {
    if((this.cartype == "" || this.cartype == undefined) || (this.carnumber == "" || this.carnumber==undefined) || (this.dateOfEvent == "" || this.dateOfEvent==undefined)) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
     } else {
       if(this.remark == "" || this.remark == undefined){
         this.remark="";
       }
      this.database.executeSql("UPDATE carnumber set cartype='" + this.cartype + "', remark='" + this.remark + "', date='" + this.dateOfEvent + "', carnum='"+this.carnumber+"' where id='" + this.inid + "'", {})
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
    this.cartype = "";
    this.remark = "";
    this.carnumber = "";
    this.navCtrl.setRoot(UpdatecartypePage);
  }
}
