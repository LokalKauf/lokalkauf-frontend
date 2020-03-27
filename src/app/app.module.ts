import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

import { CustomerModule } from './customer/customer.module';
import { TraderModule } from './trader/trader.module';
import { TransportModule } from './transport/transport.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { StartComponent } from './start/start.component';
import { ImprintComponent } from './imprint/imprint.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { TransportMainComponent } from './transport/transport-main/transport-main.compontent';
import { TraderMainComponent } from './trader/trader-main/trader-main.component';
import { ShoppingcartService } from './services/shoppingcart.service';
import { UserService } from './services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReusablesModule } from './reusables/reusables.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackComponent } from './feedback/feedback.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { TraderMapComponent } from './customer/trader-map/trader-map.component';

import { from } from 'rxjs';
import { SafePipe } from './pipes/safe.pipe';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'transport', component: TransportMainComponent },
  { path: 'verkaeufer', component: TraderMainComponent },
  { path: 'feedback', component: FeedbackComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    ImprintComponent,
    RegistrationComponent,
    LoginComponent,
    FeedbackComponent,
    SafePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCardModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    CustomerModule,
    TraderModule,
    TransportModule,
    RouterModule.forRoot(routes),
    ReusablesModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    HttpClientModule,
  ],
  exports: [RouterModule],
  providers: [ShoppingcartService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
