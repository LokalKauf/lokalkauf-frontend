import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ReusablesModule } from '../reusables/reusables.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'trader/profile', component: ProfileComponent },
  { path: 'trader/register', component: RegistrationComponent },
  { path: 'trader/login', component: LoginComponent },
];

@NgModule({
  declarations: [
    OrdersComponent,
    CreateProductComponent,
    RegistrationComponent,
    ProfileComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReusablesModule,
  ],
})
export class TraderModule {}
