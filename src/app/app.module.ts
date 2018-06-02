import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SQLite } from '@ionic-native/sqlite';
import { CallNumber } from '@ionic-native/call-number';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';

import {RlTagInputModule} from 'angular2-tag-input';
import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { CartypePage } from '../pages/cartype/cartype';
import { UpdatecartypePage } from '../pages/updatecartype/updatecartype';
import { TraveltypePage } from '../pages/traveltype/traveltype';
import { ListtravelPage } from '../pages/listtravel/listtravel';
import { GatetypePage } from '../pages/gatetype/gatetype';
import { ListgatePage } from '../pages/listgate/listgate';
import { PositiontypePage } from '../pages/positiontype/positiontype';
import { ListpositionPage } from '../pages/listposition/listposition';
import { IncomeregisterinsertPage } from '../pages/incomeregisterinsert/incomeregisterinsert';
import { ListincomeregisterPage } from '../pages/listincomeregister/listincomeregister';
import { IncomeinsertPage } from '../pages/incomeinsert/incomeinsert';
import { ListincomePage } from '../pages/listincome/listincome';
import { OutcomesPage } from '../pages/outcomes/outcomes';
import { PhonebillPage } from '../pages/phonebill/phonebill';
import { PhonebillinsertPage } from '../pages/phonebillinsert/phonebillinsert';
import { EmployeesalaryPage } from '../pages/employeesalary/employeesalary';
import { EmployeesalaryinsertPage } from '../pages/employeesalaryinsert/employeesalaryinsert';
import { RentinsertPage } from '../pages/rentinsert/rentinsert';
import { RentPage } from '../pages/rent/rent';
import { StationaryPage } from '../pages/stationary/stationary';
import { StationaryinsertPage } from '../pages/stationaryinsert/stationaryinsert';
import { AutoresizeDirective } from './AutoresizeDirective';
import { ElectricityPage } from '../pages/electricity/electricity';
import { ElectricityinsertPage } from '../pages/electricityinsert/electricityinsert';
import { AdvertisingPage } from '../pages/advertising/advertising';
import { AdvertisinginsertPage } from '../pages/advertisinginsert/advertisinginsert';
import { GeneraluseinsertPage } from '../pages/generaluseinsert/generaluseinsert';
import { GeneralusePage } from '../pages/generaluse/generaluse';
import { AnnualpartyPage } from '../pages/annualparty/annualparty';
import { AnnualpartyinsertPage } from '../pages/annualpartyinsert/annualpartyinsert';
import { OwnincomePage } from '../pages/ownincome/ownincome';
import { OwnincomeinsertPage } from '../pages/ownincomeinsert/ownincomeinsert';
import { OwnupdatecarinsertPage } from '../pages/ownupdatecarinsert/ownupdatecarinsert';
import { OwnupdatecarPage } from '../pages/ownupdatecar/ownupdatecar';
import { InandoutcomePage } from '../pages/inandoutcome/inandoutcome';
import { InandoutcomeinsertPage } from '../pages/inandoutcomeinsert/inandoutcomeinsert';
import { HomesPage } from '../pages/homes/homes';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { File } from '@ionic-native/file';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { HttpClientModule} from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@NgModule({
  declarations: [
    AutoresizeDirective,
    MyApp,
    LoginPage,
    HomesPage,
    CartypePage,
    UpdatecartypePage,
    TraveltypePage,
    ListtravelPage,
    GatetypePage,
    ListgatePage,
    PositiontypePage,
    ListpositionPage,
    IncomeregisterinsertPage,
    ListincomeregisterPage,
    IncomeinsertPage,
    ListincomePage,
    OutcomesPage,
    PhonebillPage,
    PhonebillinsertPage,
    EmployeesalaryPage,
    EmployeesalaryinsertPage,
    RentinsertPage,
    RentPage,
    StationaryPage,
    StationaryinsertPage,
    ElectricityPage,
    ElectricityinsertPage,
    AdvertisingPage,
    AdvertisinginsertPage,
    GeneraluseinsertPage,
    GeneralusePage,
    AnnualpartyPage,
    AnnualpartyinsertPage,
    OwnincomePage,
    OwnincomeinsertPage,
    OwnupdatecarPage,
    OwnupdatecarinsertPage,
    InandoutcomePage,
    InandoutcomeinsertPage,
    AboutusPage,
  ],
  imports: [
    BrowserModule,
    RlTagInputModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomesPage,
    UpdatecartypePage,
    CartypePage,
    TraveltypePage,
    ListtravelPage,
    GatetypePage,
    ListgatePage,
    PositiontypePage,
    ListpositionPage,
    IncomeregisterinsertPage,
    ListincomeregisterPage,
    IncomeinsertPage,
    ListincomePage,
    OutcomesPage,
    PhonebillPage,
    PhonebillinsertPage,
    EmployeesalaryPage,
    EmployeesalaryinsertPage,
    RentinsertPage,
    RentPage,
    StationaryPage,
    StationaryinsertPage,
    ElectricityPage,
    ElectricityinsertPage,
    AdvertisingPage,
    AdvertisinginsertPage,
    GeneraluseinsertPage,
    GeneralusePage,
    AnnualpartyPage,
    AnnualpartyinsertPage,
    OwnincomePage,
    OwnincomeinsertPage,
    OwnupdatecarPage,
    OwnupdatecarinsertPage,
    InandoutcomePage,
    InandoutcomeinsertPage,
    AboutusPage,
  ],
  providers: [
    StatusBar,
    FingerprintAIO,
    ScreenOrientation,
    DatePicker,
    Keyboard,
    SQLite,
    CallNumber,
    File,
    SQLitePorter,
    HTTP,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
