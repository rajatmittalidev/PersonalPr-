import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
@Component({
  selector: 'app-purchase-order-update',
  templateUrl: './purchase-order-update.component.html',
  styleUrls: ['./purchase-order-update.component.scss']
})
export class PurchaseOrderUpdateComponent implements OnInit, AfterViewInit {


  signaturePadOptions: any = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 866,
    'canvasHeight': 283,
  };
  @ViewChild(SignaturePad) signaturePad: SignaturePad | any;
  signatureImg: any;
  esignRequiredError: any;
  validationError: any;
  canvas: any;
  constructor() { }

  ngOnInit(): void {
  }



  ngAfterViewInit() {
    let ele: any = document.querySelector('.esign-container');
    var computed = getComputedStyle(ele),
      padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom),
      paddingSide = parseInt(computed.paddingLeft) + parseInt(computed.paddingRight);
    let height = ele.clientHeight - padding;
    let width = ele.clientWidth - paddingSide;
    this.signaturePad.set('canvasWidth', width);
    this.signaturePad.set('canvasHeight', height);

    // this.signaturePad is now available
    // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete(event: any) {

    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }


  clearSignature() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    if (this.signaturePad.isEmpty()) {
      this.esignRequiredError = true;
    } else {
      this.esignRequiredError = false;
      var images = [{
        "name": 'esignature.png',
        "image": this.signatureImg,
        "index": 1,
        "isExtracted": false
      }]

    }
  }
}
