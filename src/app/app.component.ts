import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { File } from '@ionic-native/file';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
declare var cordova:any

import { UpdatecartypePage } from '../pages/updatecartype/updatecartype';
import { LoginPage } from '../pages/login/login';
import { OutcomesPage } from '../pages/outcomes/outcomes';
import { OwnincomePage } from '../pages/ownincome/ownincome';
import { OwnupdatecarPage } from '../pages/ownupdatecar/ownupdatecar';
import { InandoutcomePage } from '../pages/inandoutcome/inandoutcome';
import { ListtravelPage } from '../pages/listtravel/listtravel';
import { ListgatePage } from '../pages/listgate/listgate';
import { ListpositionPage } from '../pages/listposition/listposition';
import { HomesPage } from '../pages/homes/homes';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;


  rootPage: any = LoginPage;
  database: any;
  filepath = this.file.externalRootDirectory + "tsCarhg_9772/";
  

  pages: Array<{ title: string, icon: any, component: any }>;
  // Data: any = {"cartype": "","remark": "","date": "","types": ""};
  cartypesSave: any = [];

  constructor(public platform: Platform, public statusBar: StatusBar, public screenOrientation: ScreenOrientation, public file: File, public sqlite: SQLite,
    public sqlitePorter: SQLitePorter, public http: Http, public androidPermission: AndroidPermissions) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'ပင်မစာမျက်နှာ', icon: 'home', component: HomesPage },
      { title: 'ခရီးစဉ်', icon: 'md-list-box', component: ListtravelPage },
      { title: 'ကားအမျိုးအစား', icon: 'md-car', component: UpdatecartypePage },
      { title: 'ဂိတ်အမျိုးအစား', icon: 'appname-cargate', component: ListgatePage },
      { title: 'ရာထူးအမျိုးအစား', icon: 'md-person', component: ListpositionPage },
      // { title: 'ဝင်ငွေမှတ်တမ်း', component: ListincomeregisterPage},
      // { title: 'ဝင်ငွေများ', component: ListincomePage },
      // { title: 'ထွက်ငွေ', component: OutcomesPage},
      // { title: 'ကိုယ်ပိုင်ကားဝင်ငွေမှတ်တမ်း', component: OwnincomePage },
      // { title: 'ကိုယ်ပိုင်ကားပြင်မှတ်တမ်း', component: OwnupdatecarPage},
      // { title: 'ကိုယ်ပိုင်ကားဝင်ငွေ/ထွက်ငွေ', component: InandoutcomePage},
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      this.sqlite.create({
        name: 'cargate.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;

          this.database.executeSql('CREATE TABLE IF NOT EXISTS cartypes ( id INTEGER PRIMARY KEY AUTOINCREMENT, cartype TEXT, remark TEXT, date TEXT, types TEXT)', {})
            .catch(error => {
              alert("CT ER" + error);
            });
        })
      // this.androidPermission.checkPermission(this.androidPermission.READ_EXTERNAL_STORAGE).then(
      //   result => console.log('Has permission?', result.hasPermission),
      //   err => this.androidPermission.requestPermission(this.androidPermission.PERMISSION.CAMERA)
      // );

      this.androidPermission.requestPermissions([
        this.androidPermission.PERMISSION.CAMERA,
        this.androidPermission.PERMISSION.GET_ACCOUNTS,
        this.androidPermission.PERMISSION.READ_EXTERNAL_STORAGE, 
        this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]);
      const permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
      function checkPermissionCallback(status) {
        console.log('no read external permission', JSON.stringify(status));
        if (!status.hasPermission) {
          console.log('read external=', JSON.stringify(status.hasPermission));
          var errorCallback = function () {
            console.log('no read external permisions');
          }
          permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
            console.log('request read external permisions=', JSON.stringify(status));
          }, errorCallback);
        }
      }
      let targetPath1;
      if (this.platform.is('ios')) {
        console.log("running on iOS device!");
        targetPath1 = this.file.documentsDirectory;
        console.log("this.file.documentsDirectory>>" + this.file.documentsDirectory);
      } else {
        targetPath1 = this.file.externalRootDirectory;
        console.log("this.file.externalRootDirectory>>" + this.file.externalRootDirectory);
      }

      this.file.checkDir(targetPath1, 'tsCarhg_9772').then(() => {
        console.log('Directory exists')
        this.getJSONFile();
      }, (error) => {
        console.log('Directory does not exists')
        this.file.createDir(targetPath1, "tsCarhg_9772", true).then(() => {
          console.log("Directory created");
          this.getJSONFile();
        }, (error) => {
          console.log(error)
        });
      });
    });

  }
  inputJSONFile() {

    this.file.checkFile(this.file.externalRootDirectory + "tsCarhg_9772/", 'tsCarTy_9772.json').then((res => {
      this.http.get(this.file.externalRootDirectory + "tsCarhg_9772/" + 'tsCarTy_9772.json').map(res => res.json()).subscribe(result => {
        for(var i = 0; i < result.length; i++){
          this.database.executeSql('Insert into cartypes (cartype,remark,date,types) values (?,?,?,?)',[result[i].cartype,result[i].remark,result[i].date,result[i].types]);
        }
      });
    }))
      .catch(error => {
        console.log("Error ===>" + error);
        console.log("Root Directory ==>" + this.file.externalRootDirectory);
      });
  }
  getJSONFile() {
    this.database.executeSql("SELECT * from cartypes", {})
      .then((data) => {
        if (data.rows.length == 0) {
          console.log("<No Data>");
          this.inputJSONFile();
        } else {
          console.log("Data Rows ==>" + data.rows.length);
          for (var i = 0; i < data.rows.length; i++) {
            this.cartypesSave.push({
              "cartype": data.rows.item(i).cartype,
              "remark": data.rows.item(i).remark,
              "date": data.rows.item(i).date,
              "types": data.rows.item(i).types
            });
          }
          this.file.writeFile(this.filepath, 'tsCarTy_9772.json', JSON.stringify(this.cartypesSave), { replace: true });
          console.log("Data JSON ==>" + JSON.stringify(this.cartypesSave));
        }
      });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
