import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { PURCHASE_ORDER_API } from '@env/api_path';
import { RequestService } from '@services/https/request.service';
import { SnackbarService } from '@services/snackbar/snackbar.service';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.css']
})
export class PurchaseOrderDetailsComponent implements OnInit {
  term_condition = new FormControl();
  mail_section = new FormControl();
  validityDate = new FormControl();
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
  poDetails: any;
  load: boolean;
  constructor(
    private route: ActivatedRoute,
    private httpService: RequestService
  ) {
    console.log("new Date().setMonth(new Date().getMonth() + 2)", new Date(new Date().setMonth(new Date().getMonth() + 2)));

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.httpService.GET(`${PURCHASE_ORDER_API}/detail`, { _id: params['id'] }).subscribe(res => {
          this.poDetails = res.data;
          this.validityDate.patchValue(this.poDetails.due_date);
          this.term_condition.patchValue(this.poDetails.vendor_detail.terms_condition);
          this.mail_section.patchValue(this.poDetails.vendor_message);
          this.mail_section.disable();
          this.term_condition.disable();
          this.validityDate.disable();
        })
      }
    });
  }

  ngOnInit(): void {

  }




}
