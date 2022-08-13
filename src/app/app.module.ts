import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule } from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';

import { CreateManufacturerComponent } from './components/create-manufacturer/create-manufacturer/create-manufacturer.component';
import { ManufacturersComponent } from './components/manufacturers/manufacturers/manufacturers.component';
import { DeleteManufacturerComponent } from './components/delete-manufacturer/delete-manufacturer/delete-manufacturer.component';
import { UpdateManufacturerComponent } from './components/update-manufacturer/update-manufacturer/update-manufacturer.component';
import { CreateProductComponent } from './components/create-product/create-product/create-product.component';
import { ProductsComponent } from './components/products/products/products.component';
import { DeleteProductComponent } from './components/delete-product/delete-product/delete-product.component';
import { UpdateProductComponent } from './components/update-product/update-product/update-product.component';
import { BranchesComponent } from './components/branches/branches/branches.component';
import { CreateBranchComponent } from './components/create-branch/create-branch/create-branch.component';
import { DeleteBranchComponent } from './components/delete-branch/delete-branch/delete-branch.component';
import { UpdateBranchComponent } from './components/update-branch/update-branch/update-branch.component';
import { CreateUserComponent } from './components/create-user/create-user/create-user.component';
import { LoginComponent } from './components/login/login/login.component';
import { CartComponent } from './components/cart/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success/order-success.component';
import { StatisticsComponent } from './components/statistics/statistics/statistics.component';
import { HomepageComponent } from './components/homepage/homepage/homepage.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CreateManufacturerComponent,
    ManufacturersComponent,
    DeleteManufacturerComponent,
    UpdateManufacturerComponent,
    CreateProductComponent,
    ProductsComponent,
    DeleteProductComponent,
    UpdateProductComponent,
    BranchesComponent,
    CreateBranchComponent,
    DeleteBranchComponent,
    UpdateBranchComponent,
    CreateUserComponent,
    LoginComponent,
    CartComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    StatisticsComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
    FlexLayoutModule,
    MatTableModule,
    MatIconModule,
    MatBadgeModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatCheckboxModule,
    MatSliderModule,
  ],
  providers: [
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
