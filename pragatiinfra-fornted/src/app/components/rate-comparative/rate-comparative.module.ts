import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DirectiveModule } from 'app/shared/directives/directive.module';
import { RateComparativeListComponent } from './rate-comparative-list/rate-comparative-list.component';
import { RateComparativeDetailsComponent } from './rate-comparative-details/rate-comparative-details.component';
import { RateComparativeUpdateComponent } from './rate-comparative-update/rate-comparative-update.component';
import { RateComparativeStatusUpdateComponent } from './rate-comparative-status-update/rate-comparative-status-update.component';
import { CustomMaterialModule } from 'app/ang-material.module';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: "",
    component: RateComparativeListComponent
  },

  // {
  //   path: "prlist",
  //   component: PurchaseRequestListComponent
  // },
  // {
  //   path: "details/:id",
  //   component: PurchaseRequestDetailsComponent
  // },
  // {
  //   path: "update/:id",
  //   component: UpdatePrStatusComponent
  // },
  // {
  //   path: "revise/:id",
  //   component: RevisePurchaseRequestComponent
  // },

];

@NgModule({
  declarations: [
    RateComparativeListComponent,
    RateComparativeDetailsComponent,
    RateComparativeUpdateComponent,
    RateComparativeStatusUpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    DirectiveModule,
    [RouterModule.forChild(routes)],
  ]
})
export class RateComparativeModule { }
