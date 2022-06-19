import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateManufacturerComponent } from './components/create-manufacturer/create-manufacturer/create-manufacturer.component';

const routes: Routes = [
  {path: 'manufacturers', component: CreateManufacturerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
