import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturersComponent } from './components/manufacturers/manufacturers/manufacturers.component';

const routes: Routes = [
  {path: 'manufacturers', component: ManufacturersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
