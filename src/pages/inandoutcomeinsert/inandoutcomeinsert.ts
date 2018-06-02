import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { DatePicker } from '@ionic-native/date-picker';
import { InandoutcomePage } from '../inandoutcome/inandoutcome';
import { HomesPage } from '../homes/homes';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-inandoutcomeinsert',
  templateUrl: 'inandoutcomeinsert.html',
})
export class InandoutcomeinsertPage {
  OUTCOME: number;
  text: string;
  dates: string;
  num: number;
  selectedTracktype: string;
  selectedCartype: string;
  carnumber: string;
  oil: string;
  road: string;
  times: string;
  gate: string;
  feed: string;
  carwash: string;
  air: string;
  income: string;
  remain: string;
  dateOfEvent: string;
  remark: string;
  Tracktypes: any = [];
  Cartypes: any = [];
  Carnumbers: any = [];
  public iD: any = [];
  public tRacktype: any = [];
  public cArtype: any = [];
  public cArunmber: any = [];
  public oIl: any = [];
  public rOad: any = [];
  public tImes: any = [];
  public gAte: any = [];
  public fEed: any = [];
  public cArwash: any = [];
  public aIr: any = [];
  public iNcome: any = [];
  public rEmain: any = [];
  public dAte: any = [];
  public rEmark: any = [];
  private database: SQLiteObject;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public sqlite: SQLite, public keyboard: Keyboard, public datePicker: DatePicker,public file: File) {

    this.iD = this.navParams.get('id');
    if (this.iD == "" || this.iD == undefined) {
      this.oil = "0";
      this.road = "0";
      this.times = "0";
      this.gate = "0";
      this.feed = "0";
      this.carwash = "0";
      this.air = "0";
      this.remain = "0";
      this.income = "0";
    } else {
      this.tRacktype = this.navParams.get('tracktype');
      this.cArtype = this.navParams.get('cartype');
      this.cArunmber = this.navParams.get('carnumber');
      this.oIl = this.navParams.get('oil');
      this.rOad = this.navParams.get('road');
      this.tImes = this.navParams.get('times');
      this.gAte = this.navParams.get('gate');
      this.fEed = this.navParams.get('feed');
      this.cArwash = this.navParams.get('carwash');
      this.aIr = this.navParams.get('air');
      this.iNcome = this.navParams.get('income');
      this.rEmain = this.navParams.get('remain');
      this.dAte = this.navParams.get('date');
      this.rEmark = this.navParams.get('remark');

      this.selectedTracktype = this.tRacktype;
      this.selectedCartype = this.cArtype;
      this.carnumber = this.cArunmber;
      this.oil = this.oIl;
      this.road = this.rOad;
      this.times = this.tImes;
      this.gate = this.gAte;
      this.feed = this.fEed;
      this.carwash = this.cArwash;
      this.air = this.aIr;
      this.income = this.iNcome;
      this.remain = this.rEmain;
      this.dateOfEvent = this.dAte;
      this.remark = this.rEmark;
    }
    this.sqlite.create({
      name: 'cargate.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.database = db;

        this.database.executeSql("Select cartype from carnumber Group By cartype", {})
          .then((data) => {
            this.Cartypes = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                this.Cartypes.push({ value: data.rows.item(i).cartype });
              }
            }
          })
        this.database.executeSql('CREATE TABLE IF NOT EXISTS inandoutCome ( id INTEGER PRIMARY KEY AUTOINCREMENT, tracktype TEXT, cartype TEXT, carnumber TEXT, oil TEXT, road TEXT,times TEXT, gate TEXT, feed TEXT, carwash TEXT, air TEXT, income TEXT, remain TEXT, date TEXT, remark TEXT)', {})
          .catch(error => {
            alert("CT ER" + error);
          });
      })
    this.Tracktypes.push({ value: "အဆင္း" });
    this.Tracktypes.push({ value: "အတက္" });

  }

  cartypeTap() {
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
  Datacartypeselect() {
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
      this.message('ကားအမျိုးအစားရွေးပေးပါ။');
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
  save() {
    if (((this.selectedCartype == "" || this.selectedCartype == undefined) || (this.carnumber == "" || this.carnumber == undefined) || (this.income == "" || this.income == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined)) || (this.oil == "" || this.oil == undefined)
      || (this.road == "" || this.road == undefined) || (this.times == "" || this.times == undefined) || (this.gate == "" || this.gate == undefined) || (this.feed == "" || this.feed == undefined) || (this.carwash == "" || this.carwash == undefined) || (this.air == "" || this.air == undefined)
      || (this.remain == "" || this.remain == undefined)) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if (this.remark == "" || this.remark == undefined) {
        this.remark = "";
      }
      this.database.executeSql('Insert into inandoutCome (tracktype,cartype,carnumber,oil,road,times,gate,feed,carwash,air,income,remain,date,remark) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [this.selectedTracktype, this.selectedCartype, this.carnumber, this.oil, this.road, this.times, this.gate, this.feed, this.carwash, this.air, this.income, this.remain, this.dateOfEvent, this.remark])
        .then((data) => {
          this.message('သွင်းပြီးပါပြီ။');
          this.clean();
        })
    }
  }
  clean() {
    this.selectedTracktype = "";
    this.selectedCartype = "";
    this.carnumber = "";
    this.oil = "0";
    this.road = "0";
    this.times = "0";
    this.gate = "0";
    this.feed = "0";
    this.carwash = "0";
    this.air = "0";
    this.remain = "0";
    this.income = "0";
    this.remark = "";
    this.dateOfEvent = "";
  }
  edit() {
    if (((this.selectedCartype == "" || this.selectedCartype == undefined) || (this.carnumber == "" || this.carnumber == undefined) || (this.income == "" || this.income == undefined) || (this.dateOfEvent == "" || this.dateOfEvent == undefined)) || (this.oil == "" || this.oil == undefined)
      || (this.road == "" || this.road == undefined) || (this.times == "" || this.times == undefined) || (this.gate == "" || this.gate == undefined) || (this.feed == "" || this.feed == undefined) || (this.carwash == "" || this.carwash == undefined) || (this.air == "" || this.air == undefined)
      || (this.remain == "" || this.remain == undefined)) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if (this.remark == "" || this.remark == undefined) {
        this.remark = "";
      }
      this.database.executeSql("Update inandoutCome set tracktype='" + this.selectedTracktype + "', cartype='" + this.selectedCartype + "', carnumber='" + this.carnumber + "',income='" + this.income + "',date='" + this.dateOfEvent + "',remark='" + this.remark + "', oil='" + this.oil + "', road='" + this.road + "', times ='" + this.times + "', gate='" + this.gate + "', feed='" + this.feed + "', carwash='" + this.carwash + "', air='" + this.air + "', remain='" + this.remain + "' where id='" + this.iD + "'", {})
        .then((result) => {
          let alert = this.alertCtrl.create({
            subTitle: 'ပြင်ပြီးပါပြီ။',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.clean();
                this.navCtrl.setRoot(HomesPage);
                this.navCtrl.push(InandoutcomePage);
              }
            }]
          });
          alert.present();
        })
    }
  }
  oiL() {
    try {
      this.showValue();
      this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  roaD() {
    try {
      this.showValue();
      this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  timeS() {
    try {
      this.showValue();
      this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  gatE() {
    try {
      this.showValue();
      this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  feeD() {
    try {
      this.showValue();
      this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  carwasH() {
    try {
      this.showValue();
      this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  aiR() {
    try {
      this.showValue();
      this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  incomE() {
    try {
      this.showValue();
       this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  remaiN() {
    try {
      this.showValue();
      this.resultIncome();
    } catch (er) {
      this.message('ငွေပမာဏသာ ဖြည့်ပါ။')
    }
  }
  showValue() {
    if (this.road == "" || this.road == null) {
      this.road = "0";
    } else if (this.oil == "" || this.oil == null) {
      this.oil = "0";
    } else if (this.times == "" || this.times == null) {
      this.times = "0";
    } else if (this.gate == "" || this.gate == null) {
      this.gate = "0";
    } else if (this.feed == "" || this.feed == null) {
      this.feed = "0";
    } else if (this.carwash == "" || this.carwash == null) {
      this.carwash = "0";
    } else if (this.air == "" || this.air == null) {
      this.air = "0";
    } else if (this.income == "" || this.income == null){
      this.income = "0";
    } else {

    }
  }
  resultIncome(){
    this.OUTCOME = parseInt(this.oil) + parseInt(this.road) + parseInt(this.times) + parseInt(this.gate) + parseInt(this.feed) + parseInt(this.carwash) + parseInt(this.air);
    this.remain = (parseInt(this.income)-this.OUTCOME).toString();
  }

}
