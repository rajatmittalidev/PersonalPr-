import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { RequestService } from '@services/https/request.service';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import {isEmpty} from 'lodash';
import * as moment from 'moment';
import { VENDOR_API} from '@env/api_path';

@Component({
  selector: 'app-rate-comparative-vendors',
  templateUrl: './rate-comparative-vendors.component.html',
  styleUrls: ['./rate-comparative-vendors.component.scss']
})
export class RateComparativeVendorsComponent implements OnInit {
  
  form = new UntypedFormGroup({
    customer: new UntypedFormControl('', [ Validators.required ]),
    date: new UntypedFormControl(new Date()),
    numbering_group: new UntypedFormControl('', [ Validators.required ])
  });
  vendorAssociatedData:Array<any> = [];
  itemVendors:any;
  pageDetail:any;

  

  constructor(
 
    private snack: SnackbarService,
    private request: RequestService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RateComparativeVendorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {
      console.log('data', data)

      this.pageDetail = data.dataObj;
      this.itemVendors = data.dataObj.vendors;

     }

  
  onNoClick(): void {
    this.dialogRef.close({ option: 2, data: this.data });
  }

  onYesClick(): void {
    this.dialogRef.close({ option: 1, data: this.data });
  }

  getVendorList(){
    this.request.GET(VENDOR_API, {}).subscribe((res:any) => {
      if(res && res.data && res.data.length>0){
        res.data.map((o:any)=>{
          this.vendorAssociatedData[o._id] = o;
          return o;
        });

        
      }
    
    })
  }


  onChangeQuantity(event,itemObj){
    console.log('event',event.target.value)

  }
  
  onChangeItemRate(event,itemObj){

  }


  ngOnInit(): void {
    this.getVendorList();
  }

}
