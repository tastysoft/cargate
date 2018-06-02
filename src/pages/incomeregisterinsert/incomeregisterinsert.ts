import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ListincomeregisterPage } from '../listincomeregister/listincomeregister';
import { Keyboard } from '@ionic-native/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { HomesPage } from '../homes/homes';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-incomeregisterinsert',
  templateUrl: 'incomeregisterinsert.html',
})
export class IncomeregisterinsertPage {
  Tracks: any = [];
  TRACKTYPE: any;
  Cartypes: Array<{ value: string}> = [];
  Tracktypes: any = [];
  selectedTrack: string;
  selectedCartype: string;
  selectedTracktype: string;
  income: string;
  carnumber: string;
  Carnumbers: any = [];
  remark: string;
  dateOfEvent: string;
  trTrack: any;
  num: number;
  dates: string;
  public iD: any = [];
  public tRack: any = [];
  public cArtype: any = [];
  public cArnum: any = [];
  public iNcome: any = [];
  public tRacktype: any =[];
  public dAte: any = [];
  public rEmark: any = [];
  private database: SQLiteObject;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private alertCtrl: AlertController,
    public keyboard: Keyboard, public datePicker: DatePicker, public file: File) {

    this.iD = this.navParams.get('incomeid');
    this.tRack = this.navParams.get('track');
    this.cArtype = this.navParams.get('cartype');
    this.cArnum = this.navParams.get('carnum');
    this.iNcome = this.navParams.get('income');
    this.tRacktype = this.navParams.get('tracktype');
    this.dAte = this.navParams.get('date');
    this.rEmark = this.navParams.get('remark');

    this.selectedTrack = this.tRack;
    this.selectedCartype = this.cArtype;
    this.carnumber = this.cArnum;
    this.income = this.iNcome;
    this.selectedTracktype = this.tRacktype;
    this.dateOfEvent = this.dAte;
    this.remark = this.rEmark;

    let track = "travel";
    this.sqlite.create({
      name: 'cargate.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.database = db; 
        this.database.executeSql("Select cartype from cartypes where types='" + track + "'", {})
        .then((data) => {
          this.Tracks = [];
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              this.Tracks.push({ value: data.rows.item(i).cartype });
            }
          }
        })
        .catch(e => JSON.stringify(e));

        this.database.executeSql("Select cartype from carnumber Group By cartype", {})
        .then((data) => {
          this.Cartypes = [];
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              this.Cartypes.push({ value: data.rows.item(i).cartype});
            }
          }
        })

        this.database.executeSql('CREATE TABLE IF NOT EXISTS incomeReg ( id INTEGER PRIMARY KEY AUTOINCREMENT, track TEXT, cartype TEXT, carnum TEXT, owner TEXT, tracktype TEXT, date TEXT, remark TEXT)', {})
          .catch(error => {
            alert("CT ER" + error);
          });
      })
    this.Tracktypes.push({ value: "အဆင္း"});
    this.Tracktypes.push({ value: "အတက္"});
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

  save() {
    if (((this.selectedTrack == "" || this.selectedTrack == undefined) || (this.selectedCartype == "" || this.selectedCartype == undefined) || (this.carnumber == "" || this.carnumber == undefined) || (this.income == "" || this.income == undefined) || (this.selectedTracktype == "" || this.selectedTracktype == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined))) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if(this.remark == "" || this.remark == undefined){
        this.remark = "";
      }
      this.database.executeSql('Insert into incomeReg (track,cartype,carnum,owner,tracktype,date,remark) values (?,?,?,?,?,?,?)', [this.selectedTrack, this.selectedCartype, this.carnumber, this.income, this.selectedTracktype, this.dateOfEvent, this.remark])
        .then((data) => {
          this.message('မှတ်တမ်းတင်ပြီးပါပြီ။');
          this.clean();
        })
    }
  }
  Datatrackselect(){
    let track = "travel";
    this.database.executeSql("Select cartype from cartypes where types='" + track + "'", {})
    .then((data) => {
      this.Tracks = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.Tracks.push({ value: data.rows.item(i).cartype });
        }
      }
    })
    .catch(e => JSON.stringify(e));
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
  trackTap(){
    this.selectedTrack = "";
    let track="travel";
    this.database.executeSql("Select cartype from cartypes where types='" + track + "'", {})
    .then((data) => {
      if (data.rows.length == 0) {
        this.message('ခရီးစဉ်များ ထည့်ထားခြင်းမရှိသေးပါ။');
      }
      else{
        this.Datatrackselect();
      }
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

  clean() {
    this.selectedCartype = "";
    this.selectedTracktype = "";
    this.selectedTrack = "";
    this.carnumber = "";
    this.income = "";
    this.remark = "";
    this.dateOfEvent = "";
  }

  edit(){
    if (((this.selectedTrack == "" || this.selectedTrack == undefined) || (this.selectedCartype == "" || this.selectedCartype == undefined) || (this.carnumber == "" || this.carnumber == undefined) || (this.income == "" || this.income == undefined) || (this.selectedTracktype == "" || this.selectedTracktype == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined))) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if(this.remark == "" || this.remark == undefined){
        this.remark = "";
      }
      this.database.executeSql("Update incomeReg set track='"+this.selectedTrack+"', cartype='"+this.selectedCartype+"', carnum='"+this.carnumber+"', owner='"+this.income+"', tracktype='"+this.selectedTracktype+"', date='"+this.dateOfEvent+"',remark='"+this.remark+"' where id='"+this.iD+"'", {})
      .then((result) => {
        let alert = this.alertCtrl.create({
          subTitle: 'ပြင်ပြီးပါပြီ။',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.clean();
              this.navCtrl.setRoot(HomesPage);
              this.navCtrl.push(ListincomeregisterPage);
            }
          }]
        });
        alert.present();
      })
    }
  }
  dateTap() {
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
}
