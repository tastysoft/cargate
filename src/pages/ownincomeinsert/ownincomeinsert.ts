import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Keyboard } from '@ionic-native/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { OutcomesPage } from '../outcomes/outcomes';
import { OwnincomePage } from '../ownincome/ownincome';
import { HomesPage } from '../homes/homes';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-ownincomeinsert',
  templateUrl: 'ownincomeinsert.html',
})
export class OwnincomeinsertPage {
  income: string;
  place: string;
  dateOfEvent: string;
  Cartypes: any = [];
  carnumber: string;
  Carnumbers: any = [];
  selectedCartype: string;
  num: number;
  dates: string;
  remark: string;
  public iD: any = [];
  public cArtype: any = [];
  public cNumber: any = [];
  public iNcome: any = [];
  public pLace: any = [];
  public dAte: any = [];
  public rEmark: any = [];
  private database: SQLiteObject;
  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlite: SQLite, public alertCtrl: AlertController,
    public keyboard: Keyboard, public datePicker: DatePicker, public file: File) {
      this.iD = this.navParams.get('id');
      this.cArtype = this.navParams.get('cartype');
      this.cNumber = this.navParams.get('carnumber');
      this.iNcome = this.navParams.get('income');
      this.pLace = this.navParams.get('place');
      this.dAte = this.navParams.get('date');
      this.rEmark = this.navParams.get('remark');
  
      this.selectedCartype = this.cArtype;
      this.carnumber = this.cNumber;
      this.income = this.iNcome;
      this.place = this.pLace;
      this.dateOfEvent = this.dAte;
      this.remark = this.rEmark;
  
      
      this.sqlite.create({
        name:'cargate.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.Datacartypeselect();
          this.database.executeSql('CREATE TABLE IF NOT EXISTS ownIncome ( id INTEGER PRIMARY KEY AUTOINCREMENT, cartype TEXT, carnumber TEXT,income TEXT,place TEXT, remark TEXT, date TEXT)', {})
            .catch(error => {
              alert("CT ER" + error);
            });
        })
  }
  cartypeTap(){
    this.selectedCartype = "";
    this.database.executeSql("Select cartype from carnumber Group By cartype", {})
    .then((data) => {
      if (data.rows.length == 0) {
        this.message('ကားအမျိုးအစားများ ထည့်ထားခြင်းမရှိသေးပါ။');
      } else {
        this.Datacartypeselect();
      }
    })
  }
  Datacartypeselect(){
    this.database.executeSql("Select cartype from carnumber Group By cartype", {})
    .then((data) => {
      this.Cartypes = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.Cartypes.push({ value: data.rows.item(i).cartype });
        }
      }
    })
  }
  message(mes) {
    let alert = this.alertCtrl.create({
      subTitle: mes,
      buttons: ['Ok']
    });
    alert.present();
  }

  Carnumber() {
    if (this.selectedCartype == "" || this.selectedCartype == undefined) {
      this.message('ကားအမျိုးအစားရွေးပါ။');
    } else {
      this.carnumber = "";
      this.database.executeSql("Select carnum from carnumber where cartype='" + this.selectedCartype + "'", {})
        .then((data) => {
          this.Carnumbers = [];
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              this.Carnumbers.push({ value: data.rows.item(i).carnum });
            }
          }
        })
    }
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
  save() {
    if (((this.selectedCartype == "" || this.selectedCartype == undefined) || (this.carnumber == "" || this.carnumber == undefined)||(this.income == "" || this.income == undefined)||(this.place == "" || this.place == undefined)|| (this.dateOfEvent == "" || this.dateOfEvent == undefined))) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if(this.remark == "" || this.remark == undefined){
        this.remark = "";
      }
      this.database.executeSql('Insert into ownIncome (cartype,carnumber,income,place,date,remark) values (?,?,?,?,?,?)', [this.selectedCartype, this.carnumber,this.income,this.place, this.dateOfEvent, this.remark])
        .then((data) => {
          this.message('မှတ်တမ်းတင်ပြီးပါပြီ။');
          this.clean();
        })
    }
  }
  clean() {
    this.selectedCartype = "";
    this.carnumber = "";
    this.place = "";
    this.income = "";
    this.remark = "";
    this.dateOfEvent = "";
  }
  edit(){
    if (((this.selectedCartype == "" || this.selectedCartype == undefined) || (this.carnumber == "" || this.carnumber == undefined)||(this.income == "" || this.income == undefined)||(this.place == "" || this.place == undefined)|| (this.dateOfEvent == "" || this.dateOfEvent == undefined))) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if(this.remark == "" || this.remark == undefined){
        this.remark = "";
      }
      this.database.executeSql("Update ownIncome set cartype='"+this.selectedCartype+"', carnumber='"+this.carnumber+"',income='"+this.income+"',place='"+this.place+"', date='"+this.dateOfEvent+"',remark='"+this.remark+"' where id='"+this.iD+"'", {})
      .then((result) => {
        let alert = this.alertCtrl.create({
          subTitle: 'ပြင်ပြီးပါပြီ။',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.clean();
              this.navCtrl.setRoot(HomesPage);
              this.navCtrl.push(OwnincomePage);
            }
          }]
        });
        alert.present();
      })
    }
  }

}
