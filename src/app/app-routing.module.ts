import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './components/branches/branches/branches.component';
import { ManufacturersComponent } from './components/manufacturers/manufacturers/manufacturers.component';
import { ProductsComponent } from './components/products/products/products.component';

const routes: Routes = [
  {path: 'manufacturers', component: ManufacturersComponent},
  {path: 'branches', component: BranchesComponent},
  {path: 'products', component: ProductsComponent},
  {path: '', component: ProductsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
