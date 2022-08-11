import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './components/branches/branches/branches.component';
import { CartComponent } from './components/cart/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout/checkout.component';
import { CreateUserComponent } from './components/create-user/create-user/create-user.component';
import { LoginComponent } from './components/login/login/login.component';
import { ManufacturersComponent } from './components/manufacturers/manufacturers/manufacturers.component';
import { ProductsComponent } from './components/products/products/products.component';

const routes: Routes = [
  {path: '', component: ProductsComponent},
  {path: 'manufacturers', component: ManufacturersComponent},
  {path: 'branches', component: BranchesComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'register', component: CreateUserComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cart', component: CartComponent},
  {path: 'checkout', component: CheckoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
