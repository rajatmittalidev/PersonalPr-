import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { RATE_COMPARATIVE_DETAIL_API, GET_SITE_API, ITEM_API, UOM_API, RATE_COMPARATIVE_API } from '@env/api_path';
import { RequestService } from '@services/https/request.service';
import { SnackbarService } from '@services/snackbar/snackbar.service';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { RateComparativeVendorsComponent } from '../rate-comparative-vendors/rate-comparative-vendors.component';
import {isEmpty} from 'lodash';

@Component({
  selector: 'app-rate-comparative-details',
  templateUrl: './rate-comparative-details.component.html',
  styleUrls: ['./rate-comparative-details.component.scss']
})
export class RateComparativeDetailsComponent implements OnInit {


  id: any;
  siteList: any;
  load = false;
  items: FormArray;
  purchaseRequestForm = new FormGroup({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    expected_delivery_date: new FormControl('', Validators.required),
    handle_by: new FormControl('', Validators.required),
    rate_approval_number: new FormControl(''),
    site: new FormControl('', Validators.required),
    local_purchase: new FormControl('', Validators.required),
    remarks: new FormControl('', []),
    items: this.formBuilder.array([]),
    _id: new FormControl()
  });

  details: any = {};

  constructor(
    private router: Router,
    private httpService: RequestService,
    private snack: SnackbarService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.getList();


  }


  vendorData(dataObj:any) {

    const dialogPopup = this.dialog.open(RateComparativeVendorsComponent, {
      data: {
        dataObj:dataObj
      }
    });
    dialogPopup.afterClosed().subscribe((result:any) => {
      console.log('result', result)

      if (result && result['option'] === 1) {

        this.details.items = this.details.items.map((o:any)=>{
          if(o._id == dataObj._id){
            o.vendors = result.data.itemVendors;
          }
          return o;
        });
        
      }
    });
  }



  getList() {

    const site = this.http.get<any>(`${environment.api_path}${GET_SITE_API}`);
    this.httpService.multipleRequests([site], {}).subscribe(res => {
      if (res) {
        this.siteList = res[0].data;
      }
    })
  }

  patchData(data) {
    this.purchaseRequestForm.patchValue({
      title: data.title,
      date: data.date,
      expected_delivery_date: data.expected_delivery_date,
      rate_approval_number: data.rate_approval_number,
      handle_by: data.handle_by,
      site: data.site,
      local_purchase: data.local_purchase,
      remarks: data.remarks,
    });

    this.purchaseRequestForm.controls['remarks'].disable();
  }


  createItemArrayForm() {
    return new FormGroup({
      item_id: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required),
      category: new FormControl(''),
      subCategory: new FormControl(''),
      attachment: new FormControl(''),
      remark: new FormControl('', Validators.required),
      uom: new FormControl('', Validators.required),

    })

  }


  addItems(item: any): void {

    this.items = this.purchaseRequestForm.get('items') as FormArray;
    if (item) {
      this.items.push(this.createItem(item));
    }
  }

  createItem(item?: any): any {
    if (item) {
      return new FormGroup({
        item_id: new FormControl(item.item_id, Validators.required),
        qty: new FormControl(item.qty, Validators.required),
        category: new FormControl(item.categoryDetail.name),
        subCategory: new FormControl(item.subCategoryDetail.subcategory_name),
        attachment: new FormControl(item.attachment),
        remark: new FormControl(item.remark, Validators.required),
        uom: new FormControl(item.uomDetail._id, Validators.required),

      })
    }
  }


  getSiteList() {
    this.httpService.GET(GET_SITE_API, {}).subscribe(res => {
      this.siteList = res;
    })
  }



  updateRequest() {

    if(!this.purchaseRequestForm.valid){
      return;
    }

    let requestedData:any = this.purchaseRequestForm.value; 
    requestedData['_id'] = this.details._id;
    requestedData['items'] = this.details.items;
    this.load = true;
    this.httpService.PUT(RATE_COMPARATIVE_API, requestedData).subscribe(res => {
      // this.router.navigate(['/procurement/prlist'])
      this.load = false;
    },(err:any)=>{
      this.load = false;
      if (err.errors && !isEmpty(err.errors)) {
        let errMessage = '<ul>';
        for (let e in err.errors) {
          let objData = err.errors[e];
          errMessage += `<li>${objData[0]}</li>`;
        }
        errMessage += '</ul>';
        this.snack.notifyHtml(errMessage, 2);
      } else {
        this.snack.notify(err.message, 2);
      }
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.httpService.GET(`${RATE_COMPARATIVE_DETAIL_API}`, { _id: params['id'] }).subscribe({
          next: res => {
            this.details = res.data.details;
            this.patchData(res.data.details);
          }, error: (error) => {
            // this.router.navigate(['/procurement/prlist'])
          }
        })
      }
    });
  }

}
