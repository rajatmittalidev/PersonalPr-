var html_to_pdf = require('html-pdf-node');
const { convertCurrency, formatDate } = require('../../libs/map');
const env = require("../../config/env");
const PurchaseOrderSchema = require('../../models/PurchaseOrder');
const ObjectID = require('mongodb').ObjectID;
const { footerData } = require('./footer');
const path = require('path');
const fs = require('fs');
const { responseMessage } = require("../../libs/responseMessages");


module.exports.generatePdf = (dataObj) => {
    return new Promise(async (resolve, reject) => {

        try {

            let requestedData = dataObj.requestedData;

            let getDataResp = await getDetails(requestedData.id, 'en');

            let currentlang = "en";


            /* Start:- Style */
            let templateContent = `
        <style>
        html { -webkit-print-color-adjust: exact; }
        * {
            font-family: sans-serif;
        }

        body {
            margin-top: 0cm;
            margin-left: 1cm;
            margin-right: 1cm;
            font-size: 14px;
            font-family: sans-serif;
        }
            
        thead th {
            background: #EDF0F2;;
        }

        table {
            width: 100%;
        }
        
        .invoice-table td{
            border-bottom: 1px solid #DADADC;
            border-right: 1px solid #DADADC;
            font-size: 10px;
        }
        .invoice-table tr td:first-child{
            border-left: 1px solid #DADADC;
        }
        .invoice-table th {
            border-bottom: 1px solid #DADADC;
            border-top: 1px solid #DADADC;
            border-right: 1px solid #DADADC;
            font-size: 10px;
        }
        .invoice-table tr th:first-child {
            border-left: 1px solid #DADADC;
        }
        .terms-table td,
        .terms-table th {
            font-size: 10px;
        }

        .section-heading{
            font-weight:600;
            font-size:14px;
        }
    </style>        
        `;
            /* End:- Style */



            /* Start:- Header */

            let date = formatDate(getDataResp.date, "DD-MM-YYYY");
            let dueDate = formatDate(getDataResp.due_date, "DD-MM-YYYY");


            templateContent += `
        <table cellspacing="0" cellpadding="10px" border="0" width="100%" >
        <tr>
            <td>
                <table  cellspacing="0" cellpadding="10px" border="0" width="100%">
                    <tr>
                        <td colspan="2">                           
                            <p style="font-size: 16px;width:100%;text-align:center;font-weight:600">Purchase Order</p>                          
                        </td>                        
                    </tr>
                    
                    <tr>
                        <td>
                            <div id="logo" >
                                Billing Address
                            </div>
                            <p style="font-size: 10px;color: #292F4C;"><strong>${getDataResp.billing_address.company_name}</strong></p>

                            <p style="font-size: 10px;color: #292F4C;">${getDataResp.billing_address.street_address} ${getDataResp.billing_address.street_address2} ${getDataResp.billing_address.city} ${getDataResp.billing_address.state} ${getDataResp.billing_address.country} ${getDataResp.billing_address.zip_code}</p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>GSTIN</strong> : ${getDataResp.billing_address.gst_number}</p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>Contact Person</strong> : ${getDataResp.billing_address.contact_person}</p>
                        </td>
                        <td style="text-align: end; font-size: 16px;color: #292F4C;vertical-align: top;padding-top:25px;>
                            <div id="logo" >
                            Delivery Address
                            </div>
                            <p style="font-size: 10px;color: #292F4C;"><strong>DATE</strong> :
                            <span style="direction:ltr !important;unicode-bidi: embed;">${date}</span></p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>VALIDITY</strong> : <span style="direction:ltr !important;unicode-bidi: embed;">${dueDate}</span></p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>PO Number</strong> : <span style="direction:ltr !important;unicode-bidi: embed;">${getDataResp.po_number}</span></p>

                            <p style="font-size: 10px;color: #292F4C;"><strong>Site Address</strong> :  ${getDataResp.delivery_address.street_address} ${getDataResp.delivery_address.street_address2} ${getDataResp.delivery_address.city} ${getDataResp.delivery_address.state} ${getDataResp.delivery_address.country} ${getDataResp.delivery_address.zip_code}</p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>Contact Person</strong> : ${getDataResp.delivery_address.contact_person}</p>
                        </td>
                    </tr>
                </table>
                
                </td>
            </tr>  
        `;

            /* End:- Header */


            /* Start:- Mail content */


            templateContent += `
        <tr>
            <td>
                <table  cellspacing="0" cellpadding="10px" border="0" width="100%">  
                    <tr>
                        <td>
                            <div style="font-size: 10px;color: #292F4C;" >
                                To,
                            </div>
                            <div style="font-size: 10px;color: #292F4C;" >
                            M/s ${getDataResp.vendor_detail.vendor_name},
                            </div>
                            <div style="font-size: 10px;color: #292F4C;" >
                            ${getDataResp.vendor_detail.address.street_address}  ${getDataResp.vendor_detail.address.street_address2} ${getDataResp.vendor_detail.address.city} ${getDataResp.vendor_detail.address.state} ${getDataResp.vendor_detail.address.country} ${getDataResp.vendor_detail.address.zip_code},
                            </div>
                            <div style="font-size: 10px;color: #292F4C;" >
                            GSTIN: ${getDataResp.vendor_detail.gst_number}
                            </div>                            
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                </table>
                
                </td>
            </tr>  
        `;


            templateContent += `
        <tr>
            <td>
                <table  cellspacing="0" cellpadding="10px" border="0" width="100%">  
                    <tr>
                        <td colspan="2">
                            <div style="font-size: 10px;color: #292F4C;" >
                            Sir,
                            </div>
                            <div style="font-size: 10px;color: #292F4C;" >
                            With reference to your quotation and final negotiation, we are pleased to inform you that your final offer  (Description mentioned below) has been accepted and work is  awarded to you based on the terms & conditions mentioned below. No extra payment will be made on any account.
                            </div>                                                 
                        </td>
                    </tr>
                </table>
                
                </td>
            </tr>  
        `;


            /* End:- Mail content */


            /* start:- item table */


            let subtotal = convertCurrency(getDataResp.vendors_total[0]['subtotal']);
            let total_tax = convertCurrency(getDataResp.vendors_total[0]['total_tax']);
            let freight_charges = convertCurrency(getDataResp.vendors_total[0]['freight_charges']);
            let freight_tax = convertCurrency(getDataResp.vendors_total[0]['freight_tax']);
            let total_amount = convertCurrency(getDataResp.vendors_total[0]['total_amount']);


            templateContent += `
              <tr>  
                <td colspan="2">
                    <table cellspacing="0" cellpadding="10px" class="invoice-table" border="0" width="100%" >
                        <thead background="">
                            <tr align="center">
                                <th> Item No	 </th>
                                <th>Item Name</th>
                                <th>Item Description</th>
                                <th>Brand</th>
                                <th>Required Quantity</th>
                                <th>Purchased Quantity</th>
                                <th class="price">Rate</th>
                                <th class="price">Sub Total</th>
                                <th class="price">Tax</th>
                                <th class="price">Total</th>
                            </tr>
                        </thead>             
                        <tbody align="center">
                        `;

            if (getDataResp.items && getDataResp.items.length > 0) {

                getDataResp.items.map((o, i) => {
                    if (o) {
                        let itemRate = convertCurrency(o.vendors[0]['item_rate']);
                        let item_subtotal = convertCurrency(o.vendors[0]['item_subtotal']);
                        let item_total_amount = convertCurrency(o.vendors[0]['item_total_amount']);
                        let productTax = (o.tax && o.tax.name) ? `${o.tax.name}<span style="display:inline-block;direction:ltr;">(${o.tax.amount}%)</span>` : ``;;

                        templateContent += `
                            <tr>
                                    <td  style="">${i + 1}</td>
                                    <td  style="">${o.item_name}</td>
                                    <td  style="">${o.item_description}</td>
                                    <td style=" ">${(o.brand)}</td>
                                    <td  style=" ">${o.qty}</td>
                                    <td  style="">${o.vendors[0]['quantity']}</td>
                                    <td  style="">${itemRate}</td>
                                    <td  style="">${item_subtotal}</td>
                                    <td  style="">${productTax}</td>
                                    <td  style="">${item_total_amount}</td>
                                </tr>`;
                    }
                })
            }

            templateContent += `
                
                    <tr>
                        <td colspan="9"  style="font-weight:600;">Subtotal</td>                   
                        <td  style="">${subtotal}</td>
                    </tr>
                    <tr>
                        <td colspan="9"  style="font-weight:600;">Tax</td>                   
                        <td  style="">${total_tax}</td>
                    </tr>
                    <tr>
                        <td colspan="9"  style="font-weight:600;"> Freight charges </td>                   
                        <td  style="">${freight_charges}</td>
                    </tr>
                    <tr>
                        <td colspan="9"  style="font-weight:600;">Freight tax</td>                   
                        <td  style="">${freight_tax}</td>
                    </tr>
                    <tr>
                        <td colspan="9"  style="font-weight:600;">Total amount</td>                   
                        <td  style="">${total_amount}</td>
                    </tr>
                
                `;

            templateContent += `</tbody>

                </table>   
          
          </td>
        </tr>  
  `;


            /* End:- item table */



            /* Start:- Terms & condition &  Vendor Total */
            templateContent += `
      <tr>
          <td>
              <table  cellspacing="0" cellpadding="10px" border="0" width="100%">  
                  <tr>
                      <td colspan="2">
                          <div style="font-size: 12px;color: #292F4C; font-weight:600" >
                          Payment Terms & Other Conditions:
                          </div>
                          <div style="font-size: 10px;color: #292F4C;white-space: pre-line" >
                          ${getDataResp.terms_condition}
                          </div>                                                 
                      </td>
                  </tr>
              </table>



              <table  cellspacing="0" cellpadding="10px" border="0" width="100%">  
                  <tr>
                      <td colspan="2">
                          <div style="font-size: 13px;color: #292F4C; font-weight:600" >
                          For Pragati Infra Solutions Pvt. Ltd.
                          </div>                                               
                      </td>
                  </tr>
              </table>
              
              </td>
          </tr>  
      `;

            /* End:- erms & condition &  Vendor Total */






            templateContent += `                      
                     
            </table>     
        `;


            let isFile = requestedData.isFile;
            let footerContent = await footerData(getDataResp);

            let options = {
                format: 'A4',
                date: false,
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate: '<div></div>',
                footerTemplate: footerContent,
                margin: {
                    top: "50px",
                    bottom: "150px",
                    right: "0px",
                    left: "0px",
                }
            };
            let file = {
                content: templateContent
            };
            html_to_pdf.generatePdf(file, options).then(async (pdfBuffer) => {

                if (isFile && isFile == 1) {
                    let randomNumber = new Date().getTime() + Math.floor(Math.random() * 10000000);
                    let fileName = `${requestedData.template}-${randomNumber}.pdf`;
                    let pdfFilePath = path.resolve('public/pdf') + `/${fileName}`;

                    fs.writeFile(`${pdfFilePath}`, pdfBuffer, (err) => {
                        if (err) {
                            throw err;
                        }
                        resolve({
                            file: fileName
                        });
                    });

                    // let getUploadedFile  = await uploadToBucket({
                    //     fileName:fileName,
                    //     file:pdfBuffer,
                    //     companySlug:companyData.slug
                    // })
                    resolve(pdfFilePath);


                } else if (dataObj.isMailData) {

                    // let randomNumber = new Date().getTime()+Math.floor(Math.random() * 10000000);
                    // let fileName =   `${requestedData.template}-${randomNumber}.pdf`;  

                    // resolve({
                    //     companyData:companyData,
                    //     companyLogo:companyLogo,
                    //     dataObj:getDataResp,
                    //     fileName:fileName,
                    //     subject:`Invoice - #${getDataResp.invoice_number} from ${companyData.company_name}`,
                    //     to:getDataResp.customer.email,
                    //     sender_name:companyData.company_name,
                    //     receiver_name: getDataResp.customer.customer_name,
                    //     pdfBuffer:pdfBuffer
                    // });      

                } else {
                    resolve(pdfBuffer);
                }

            }).catch((err) => {
                console.log('err', err)
                reject(err)
            });
        } catch (e) {
            console.log('e', e)
            reject(e)
        }
    })
}






function getDetails(id, langCode) {

    return new Promise(async (resolve, reject) => {

        try {

            if (!id) {
                throw {
                    errors: [],
                    message: "Id missing",
                    statusCode: 412
                }
            }

            let recordDetail = await PurchaseOrderSchema.findOne({ _id: ObjectID(id) });

            if (recordDetail) {
                resolve(recordDetail);
            } else {
                throw {
                    errors: [],
                    message: "Something went wrong",
                    statusCode: 412
                }
            }

        } catch ($e) {
            return reject($e);
        }

    })

}