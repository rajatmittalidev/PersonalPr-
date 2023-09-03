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
        
        .invoice-table td,
        .invoice-table th {
            border: 1px solid #DADADC;
            font-size: 10px;
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
            // let totalAmount = convertCurrency(getDataResp.total_amount, companyData);
            // let subTotal = convertCurrency(getDataResp.sub_total, companyData);
            // let invoicePaid = convertCurrency(getDataResp.invoice_paid, companyData);
            // let balance = convertCurrency(getDataResp.balance_amount, companyData);
            // let totalTax = convertCurrency(getDataResp.total_tax, companyData);
            // let adjustment = convertCurrency(getDataResp.adjustment.amount, companyData);
            // let shippingCharges = convertCurrency(getDataResp.shipping_charges, companyData);
            // let creditApplied = convertCurrency(getDataResp.credit_applied, companyData);
            // let invoiceRefund = convertCurrency(getDataResp.refund, companyData);
            // let writeOffamount = convertCurrency(getDataResp.write_off_amount, companyData);



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
                            <p style="font-size: 10px;color: #292F4C;"><strong>Company</strong> :
                            <span style="direction:ltr !important;unicode-bidi: embed;">${getDataResp.billing_address.company_name}</span></p>

                            <p style="font-size: 10px;color: #292F4C;"><strong>Address</strong> : ${getDataResp.billing_address.street_address} <br>
                            ${getDataResp.billing_address.street_address2}<br>
                            ${getDataResp.billing_address.city},${getDataResp.billing_address.state}, ${getDataResp.billing_address.country}, ${getDataResp.billing_address.zip_code}</p>

                            <p style="font-size: 10px;color: #292F4C;"><strong>GST</strong> : ${getDataResp.billing_address.gst_number}</p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>PAN</strong> : ${getDataResp.billing_address.pan_card}</p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>Contact Person</strong> : ${getDataResp.billing_address.contact_person}</p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>Email</strong> : ${getDataResp.billing_address.email}</p>
                        </td>
                        <td style="text-align: end; font-size: 16px;color: #292F4C;vertical-align: top;padding-top:25px;>
                            <div id="logo" >
                            Delivery Address
                            </div>
                            <p style="font-size: 10px;color: #292F4C;"><strong>DATE</strong> :
                            <span style="direction:ltr !important;unicode-bidi: embed;">${date}</span></p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>VALIDITY</strong> : <span style="direction:ltr !important;unicode-bidi: embed;">${dueDate}</span></p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>PO Number</strong> : <span style="direction:ltr !important;unicode-bidi: embed;">${getDataResp.po_number}</span></p>

                            <p style="font-size: 10px;color: #292F4C;"><strong>Address</strong> : ${getDataResp.delivery_address.street_address} <br>
                            ${getDataResp.delivery_address.street_address2}<br>
                            ${getDataResp.delivery_address.city},${getDataResp.delivery_address.state}, ${getDataResp.delivery_address.country}, ${getDataResp.delivery_address.zip_code}</p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>Contact Person</strong> : ${getDataResp.delivery_address.contact_person}</p>
                        </td>
                    </tr>
                </table>
                
                </td>
            </tr>  
        `;

            /* End:- Header */


        /* Start:- Mail content */




        /* End:- Mail content */


              /* start:- item table */

              templateContent += `
              <tr>  
                <td colspan="2">
                    <table cellspacing="0" cellpadding="10px" class="invoice-table" border="0" width="100%" >
                        <thead background="">
                            <tr align="center">
                                <th> Item No	 </th>
                                <th>Item Name</th>
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

                    getDataResp.items.map((o,i) => {
                        if (o) {
                            let itemRate = convertCurrency(o.vendors[0]['item_rate']);
                            let item_subtotal = convertCurrency(o.vendors[0]['item_subtotal']);
                            let item_total_amount = convertCurrency(o.vendors[0]['item_total_amount']);

                            let productDiscount = (o.discount && o.discount.name) ? `${o.discount.name}<span style="display:inline-block;direction:ltr;">(${o.discount.amount}%)</span>` : ``;
                            let productTax = (o.tax && o.tax.name) ? `${o.tax.name}<span style="display:inline-block;direction:ltr;">(${o.tax.amount}%)</span>` : ``;;

                            templateContent += `
                            <tr>
                                <td  style="">${i+1}</td>
                                <td  style="">${o.item_name}</td>
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

                
                templateContent += `</tbody>
                </table>   
          
          </td>
        </tr>  
  `;

 
              /* End:- item table */

          

      /* Start:- Terms & condition &  Vendor Total */

      let subtotal = convertCurrency(getDataResp.vendors_total[0]['subtotal']);
      let total_tax = convertCurrency(getDataResp.vendors_total[0]['total_tax']);
      let freight_charges = convertCurrency(getDataResp.vendors_total[0]['freight_charges']);
      let freight_tax = convertCurrency(getDataResp.vendors_total[0]['freight_tax']);
      let total_amount = convertCurrency(getDataResp.vendors_total[0]['total_amount']);


      templateContent += ` 
      <tr>  
      <td>`;

          templateContent += `            
            <table cellspacing="0" cellpadding="10px" class="invoice-table" border="0" width="100%" > 
            <thead> 
            <tr> 
                <th> 
                    <div class="section-heading" >
                    Vendor terms & other conditions
                    </div>
                </th> 
            
                <th> 
                    <div class="section-heading">
                        Vendor Total
                    </div>
                </th> 
            </tr>    
            </thead>                
                <tbody>

                    <tr>
                        <td> 
                            <div class="terms_content" >
                                ${getDataResp.vendor_detail.terms_condition}
                            </div>
                        </td> 
                        
                        <td>
                            
                            <div>
                                <table class="downtable">
                                    <tr>
                                        <td style="border: none;font-size: small;">Total amount</td>
                                        <td style="border: none;font-size: small;">${subtotal}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: none;font-size: small;">GST amount</td>
                                        <td style="border: none;font-size: small;">${total_tax}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: none;font-size: small;">Freight Charges</td>
                                        <td style="border: none;font-size: small;">${freight_charges}
                                        </td>

                                    </tr>
                                    <tr>
                                        <td style="border: none;font-size: small;">Freight GST</td>
                                        <td style="border: none;font-size: small;">${freight_tax}
                                        </td>

                                    </tr>
                                    <tr>
                                        <td style="border: none;font-size: small;">Grand total</td>
                                        <td style="border: none;color:#073B4C;font-weight: bold;font-size: small;">
                                            ${total_amount}</td>

                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table> 
            `;

    templateContent += ` 
    </td>
    </tr>    
    `;

        /* End:- erms & condition &  Vendor Total */






            templateContent += `                      
                     
            </table>     
        `;


            let isFile = requestedData.isFile;
            let footerContent = await footerData('');

            let options = {
                format: 'A4',
                date: false,
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate: '<div></div>',
                footerTemplate: footerContent,
                margin: {
                    top: "50px",
                    bottom: "230px",
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