import { Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { OutcomesPage } from '../outcomes/outcomes';
import { StationaryPage } from '../stationary/stationary';
import { HomesPage } from '../homes/homes';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-stationaryinsert',
  templateUrl: 'stationaryinsert.html',
})
export class StationaryinsertPage {
  dates: string;
  num: number;
  GateTypes: any = [];
  selectedGatetype: string;
  stationary: string;
  dateOfEvent: string;
  remark: string;
  myInput: any;
  public iD: any = [];
  public gAtetype: any = [];
  public sTationary: any = [];
  public dAte: any = [];
  public rEmark: any = [];
  private database: SQLiteObject;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public sqlite: SQLite,
    private datePicker: DatePicker, private keyboard: Keyboard,public file: File) {
      this.iD = this.navParams.get('incomeid');
      this.gAtetype = this.navParams.get('gatetype');
      this.sTationary = this.navParams.get('stationary');
      this.dAte = this.navParams.get('date');
      this.rEmark = this.navParams.get('remark');
  
      this.selectedGatetype = this.gAtetype;
      this.stationary = this.sTationary;
      this.dateOfEvent = this.dAte;
      this.remark = this.rEmark;
  
      
      this.sqlite.create({
        name:'cargate.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.Datagatetypeselect();
          this.database.executeSql('CREATE TABLE IF NOT EXISTS outCome ( id INTEGER PRIMARY KEY AUTOINCREMENT, subtype TEXT, outcometype TEXT, remark TEXT, date TEXT)', {})
            .catch(error => {
              alert("CT ER" + error);
            });
        })
  }
  gateTap(){
    this.selectedGatetype = "";
    let ty = "gate";
    this.database.executeSql("Select cartype from cartypes where types='" + ty + "'", {})
    .then((data) => {
      if (data.rows.length == 0) {
       this.message('ဂိတ်အမျိုးအစားများ ထည့်သွင်းထားခြင်းမရှိပါ။');
      }
      else{
        this.Datagatetypeselect();
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
  save() {
    if (((this.selectedGatetype == "" || this.selectedGatetype == undefined) || (this.stationary == "" || this.stationary == undefined)|| (this.dateOfEvent == "" || this.dateOfEvent == undefined))) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if(this.remark == "" || this.remark == undefined){
        this.remark = "";
      }
      this.database.executeSql('Insert into outCome (subtype,outcometype,date,remark) values (?,?,?,?)', [this.selectedGatetype, this.stationary, this.dateOfEvent, this.remark])
        .then((data) => {
          this.message('သွင်းပြီးပါပြီ။');
          this.clean();
        })
    }
  }
  clean() {
    this.selectedGatetype = "";
    this.stationary = "";
    this.remark = "";
    this.dateOfEvent = "";
  }
  edit(){
    if (((this.selectedGatetype == "" || this.selectedGatetype == undefined) || (this.stationary == "" || this.stationary == undefined)|| (this.dateOfEvent == "" || this.dateOfEvent == undefined))) {
      this.message('အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ။');
    } else {
      if(this.remark == "" || this.remark == undefined){
        this.remark = "";
      }
      this.database.executeSql("Update outCome set subtype='"+this.selectedGatetype+"', outcometype='"+this.stationary+"', date='"+this.dateOfEvent+"',remark='"+this.remark+"' where id='"+this.iD+"'", {})
      .then((result) => {
        let alert = this.alertCtrl.create({
          subTitle: 'ပြင်ပြီးပါပြီ။',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.clean();
              this.navCtrl.setRoot(HomesPage);
              this.navCtrl.push(OutcomesPage);
              this.navCtrl.push(StationaryPage);
            }
          }]
        });
        alert.present();
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
  Datagatetypeselect(){
    let ty = "gate";
    this.database.executeSql("Select cartype from cartypes where types='" + ty + "'", {})
    .then((data) => {
      this.GateTypes = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.GateTypes.push({ value: data.rows.item(i).cartype });
        }
      }
    })
    .catch(e => JSON.stringify(e));
  }

}
