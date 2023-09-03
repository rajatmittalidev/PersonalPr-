var html_to_pdf = require('html-pdf-node');
const { convertCurrency, formatDate } = require('../../libs/map');
const env = require("../../config/env");
const {countryList}  = require('../../libs/country');
const InvoiceSchema = require('../../models/invoice');
const ObjectID = require('mongodb').ObjectID;
const {footerData} = require('./footer');
const path = require('path');
const fs = require('fs');
const { responseMessage } = require("../../libs/responseMessages");


module.exports.generatePdf = (dataObj) => {
    return new Promise(async(resolve, reject) => {
    
        try {

        let requestedData = dataObj.requestedData;
        let companyData = dataObj.companyData;
  
        let fileBase = `${env.fileBasePath}${companyData.slug}/`;
        let companyLogo = (companyData.company_logo)?`${fileBase}${companyData.company_logo}`:env.companyDefaultLogo;
        
        let countryName = companyData.address && companyData.address.country?countryList[companyData.address.country].name:"";
        let companyName = companyData.company_name?companyData.company_name:"Your company name";        
        let companyAddressLine1 = companyData.address && companyData.address.street_address?`${companyData.address.street_address}, ${companyData.address.street_address2}`:"Street address here";
        let companyAddressLine2 = companyData.address && companyData.address.state && companyData.address.city && companyData.address.zip_code?`${companyData.address.state}, ${companyData.address.city}, ${companyData.address.zip_code}, ${countryName}`:`State, city, zipcode, country`;


        let mobileNumber = (companyData.contact_m_dialcode && companyData.contact_mobile_number)?`+${companyData.contact_m_dialcode}-${companyData.contact_mobile_number}`:'N/A';
        let tinNumber = `${companyData.tin_or_vat}`;
        let crnCompany = `${companyData.crn}`;

        let getDataResp = await getDetails(requestedData.id, requestedData.langCode);

        let currentlang = requestedData.langCode;  
   

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
    </style>        
        `;

        if(currentlang == 'ar'){
            templateContent += `
            <style>
               table{
                direction: rtl;
               }
            </style>
            `
        }

        /* End:- Style */



        /* Start:- Header */

        let invoiceDate = formatDate(getDataResp.date, companyData);
        let qrCodeData = formatDate(getDataResp.date, {date_format:"YYYY-MM-DD HH:mm"})
        let invoiceDueDate = formatDate(getDataResp.due_date, companyData);
        let totalAmount = convertCurrency(getDataResp.total_amount, companyData);
        let subTotal = convertCurrency(getDataResp.sub_total, companyData);
        let invoicePaid = convertCurrency(getDataResp.invoice_paid, companyData);
        let balance = convertCurrency(getDataResp.balance_amount, companyData);
        let totalTax = convertCurrency(getDataResp.total_tax, companyData);
        let adjustment = convertCurrency(getDataResp.adjustment.amount, companyData);
        let shippingCharges = convertCurrency(getDataResp.shipping_charges, companyData);
        let creditApplied = convertCurrency(getDataResp.credit_applied, companyData);
        let invoiceRefund = convertCurrency(getDataResp.refund, companyData);
        let writeOffamount = convertCurrency(getDataResp.write_off_amount, companyData);

                           

       

        templateContent += `
        <table cellspacing="0" cellpadding="10px" border="0" width="100%" >
        <tr>
            <td>
                <table  cellspacing="0" cellpadding="10px" border="0" width="100%">
                    <tr>
                        <td colspan="2">                           
                            <p style="font-size: 16px;width:100%;text-align:center;font-weight:600">${responseMessage(currentlang, 'TAX_INVOICE')}</p>                          
                        </td>                        
                    </tr>
                    
                    <tr>
                        <td>
                            <div id="logo" >
                                <img src="${companyLogo}" style="  max-height: 100px;  min-height: 50px; padding: 10px; ">
                            </div>
                            <p style="font-size: 10px;">${companyName}</p>
                            <p style="font-size: 10px;color: #292F4C;">${companyAddressLine1} <br>
                            ${companyAddressLine2}
                            </p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>${responseMessage(currentlang, 'PHONE')}</strong> :
                            <span style="direction:ltr !important;unicode-bidi: embed;">${mobileNumber}</span></p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>${responseMessage(currentlang, 'TIN_VAT')}</strong> : ${tinNumber}</p>
                            <p style="font-size: 10px;color: #292F4C;"><strong>${responseMessage(currentlang, 'CRN')}</strong> : ${crnCompany}</p>
                        </td>
                        <td style="text-align: end; font-size: 16px;color: #292F4C;vertical-align: top;padding-top:25px; "><b>${responseMessage(currentlang, 'INVOICE_NUMBER_STR')}</b>: 
                        <span style="direction:ltr !important;unicode-bidi: embed;"> #${getDataResp.invoice_number} </span>
                        </td>
                    </tr>
                </table>                 
        `;


        let customerBilingcountryName = getDataResp.customer && getDataResp.customer.billing_address && getDataResp.customer.billing_address.country ? countryList[getDataResp.customer.billing_address.country].name : "";
        let customerPhone = (getDataResp.customer && getDataResp.customer.contact_phone_number)?`+${getDataResp.customer.contact_p_dialcode}-${getDataResp.customer.contact_phone_number}`:'';
        let customerMobile = (getDataResp.customer && getDataResp.customer.contact_mobile_number)?`+${getDataResp.customer.contact_m_dialcode}-${getDataResp.customer.contact_mobile_number}`:'';
        templateContent += `
            <table cellspacing="0" cellpadding="10px"  width="100%" style="background: #EDF0F2; border: 1px solid #DADADC; border-radius: 3.81625px; padding: 10px; margin-bottom:20px; " >
                    <tr>                        
                        <td align="center">
                            <div style="text-align: start; font-size: 10px;color: #292F4C; dir:auto">
                                <pT>${responseMessage(currentlang, 'BILL_TO')}: <br> <span style=" font-size: 12px; font-weight: 600;">${getDataResp.customer.customer_name}</span> </pT>
                                <p>
                                ${getDataResp.customer.billing_address.street_address} <br>
                                ${getDataResp.customer.billing_address.street_address2}<br>
                                ${getDataResp.customer.billing_address.state}, ${getDataResp.customer.billing_address.city}, ${customerBilingcountryName}, ${getDataResp.customer.billing_address.zip_code} <br>
                                </p>
                                <p>${responseMessage(currentlang, 'PHONE_NUMBER')}: <span style="direction:ltr !important;unicode-bidi: embed;">${customerPhone}</span></p>
                                <p>${responseMessage(currentlang, 'MOBILE_NUMBER')}: <span style="direction:ltr !important;unicode-bidi: embed;">${customerMobile}</span></p>
                                <p>${responseMessage(currentlang, 'VAT_NO')}: ${(getDataResp.customer.tin_or_vat_id)?getDataResp.customer.tin_or_vat_id:""}</p>
                                <p>${responseMessage(currentlang, 'CRN')}: ${(getDataResp.customer.crn)?getDataResp.customer.crn:""}</p>
        
                            </div>
                        </td>
                        <td align="center">
                            <div style="text-align: end; font-size: 12px;color: #292F4C;">               
                            
                                <p>${responseMessage(currentlang, 'DATE')}: <span style="font-weight: 600;direction:ltr !important;unicode-bidi: embed;">${invoiceDate}</span></p>

                                <p>${responseMessage(currentlang, 'DUE_DATE')}: <span style="font-weight: 600;direction:ltr !important;unicode-bidi: embed;">${invoiceDueDate}</span></p>
                                
                                <p>${responseMessage(currentlang, 'AMOUNT')}: <span style="font-weight: 600;direction:ltr !important;unicode-bidi: embed;">${totalAmount}</span></p>
                            </div>
                        </td>
                    </tr>
            </table>                 
        `;

         /* End:- Header */

        templateContent += `
                <table cellspacing="0" cellpadding="10px" class="invoice-table" border="0" width="100%" >
                    <thead background="">
                        <tr align="center">
                            <th > ${responseMessage(currentlang, 'PRODUCT')} </th>
                            <th >${responseMessage(currentlang, 'DESCRIPTION')}</th>
                            <th >${responseMessage(currentlang, 'QTY') }</th>
                            <th  class="price">${responseMessage(currentlang, 'PRICE')}</th>
                            <th  class="price">${responseMessage(currentlang, 'DISCOUNT')}</th>
                            <th  class="price">${responseMessage(currentlang, 'TAX_VAT')}</th>
                            <th >${responseMessage(currentlang, 'TOTAL_AMOUNT_')} </th>
                        </tr>
                    </thead>             
                    <tbody align="center">
                    `;

            if(getDataResp.products && getDataResp.products.length>0){

                getDataResp.products.map((o)=>{
                    if(o){
                        let productPrice = convertCurrency(o.price, companyData);
                        let productTotal = convertCurrency(o.total, companyData);
    
                        let productDiscount = (o.discount && o.discount.name) ? `${o.discount.name}<span style="display:inline-block;direction:ltr;">(${o.discount.amount}%)</span>` : ``;
                    let productTax = (o.tax && o.tax.name) ? `${o.tax.name}<span style="display:inline-block;direction:ltr;">(${o.tax.amount}%)</span>` : ``;;
                        
                        templateContent += `
                        <tr>
                            <td  style="">${o.product_name}</td>
                            <td style=" ">${(o.product_description)?o.product_description:""}</td>
                              <td  style=" ">${o.quantity}</td>
                              <td  style="">${productPrice}</td>
                              <td  style="">${productDiscount}</td>
                              <td  style="">${productTax}</td>
                              <td  style="">${productTotal}</td>
                          </tr>`;
                    }
                   

                })                
            }
        

            let shippingChargeHTML = '';
            if (getDataResp && getDataResp.shipping_charges && getDataResp.shipping_charges > 0) {
                shippingChargeHTML = `<tr>
                                        <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;">${responseMessage(currentlang, 'SHIPPING_CHARGES')}:</td>
                                        <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;"> ${shippingCharges}</td>
                                    </tr>`;
            }


            let adjustmentHTML = '';
            if (getDataResp && getDataResp.adjustment && getDataResp.adjustment.amount && getDataResp.adjustment.amount > 0) {
                adjustmentHTML = `<tr>
                                    <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;">${responseMessage(currentlang, 'ADJUSTMENT')}:</td>
                                    <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;"> ${adjustment}</td>
                                </tr>`;
            }


        templateContent += `</tbody>
                </table>
                <table cellspacing="0" cellpadding="10px" width="100%"  border="0" >
                    <tr>
                        <td width="60%" > </td>
                        <td width="40%">
                            <table cellspacing="0" cellpadding="10px" width="100%" class="invoice-total" border="0" >

                                <tr>
                                    <td  align="end" style="font-size: 10px; color: #292F4C;">${responseMessage(currentlang, 'SUB_TOTAL')}:</td>
                                    <td  align="end" style="font-size: 10px; color: #292F4C;"> ${subTotal}</td>
                                </tr>

                                 ${shippingChargeHTML}

                               ${adjustmentHTML}
                                
                                
                                <tr>
                                    <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;">${responseMessage(currentlang, 'TAX_VAT')}:</td>
                                    <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;"> ${totalTax}</td>
                                </tr>
                            `;

            if(getDataResp.invoice_tax && getDataResp.invoice_tax.length>0){


                getDataResp.invoice_tax.map((o)=>{
                    let tAmount = convertCurrency(o.total, companyData);
                    let taxType = (o.tax_type=="discount")?"-":"";
                    let colorData = (o.tax_type=="discount")?"#ff3333":"#292F4C";
                    templateContent += `

                        <tr>
                            <td  align="end" style="font-size: 10px; color: #292F4C;">${o.name}(${o.amount}%):</td>
                            <td  align="end" style="font-size: 10px; color: ${colorData};">${taxType}${tAmount}</td>
                        </tr>                 
                    `;
                })

            }
                
                        
        templateContent += `
                        <tr>
                            <td  align="end" style="font-size: 10px; color: #292F4C; font-weight:700;  border-top: 1px solid #979797;"> ${responseMessage(currentlang, 'TOTAL_AMOUNT_')}
                            <td  align="end" style="font-size: 10px; color: #292F4C; font-weight:700;  border-top: 1px solid #979797;"> ${totalAmount}</td>
                        </tr>


                        

                        ${
                            (getDataResp.credit_applied && getDataResp.credit_applied>0)
                            ?
                            `<tr>
                                <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;">${responseMessage(currentlang, 'CREDIT_APPLIED')}:</td>
                                <td  align="end" style="font-size: 10px; color: #ff3333;  border-top: 1px solid #979797;"> -${creditApplied}</td>
                            </tr>`
                            :""
                        } 
                        

                        ${
                            (getDataResp.refund && getDataResp.refund>0)
                            ?
                            `<tr>
                                <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;">${responseMessage(currentlang, 'REFUND')}:</td>
                                <td  align="end" style="font-size: 10px; color: #ff3333;  border-top: 1px solid #979797;"> -${invoiceRefund}</td>
                            </tr>`
                            :""
                        }  


                        <tr>
                            <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;">${responseMessage(currentlang, 'INVOICE_PAID')}:</td>
                            <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;"> ${invoicePaid}</td>
                        </tr>

                        

                        ${
                            (getDataResp.write_off)
                            ?
                            `<tr>
                                <td  align="end" style="font-size: 10px; color: #292F4C;  border-top: 1px solid #979797;">${responseMessage(currentlang, 'WRITE_OFF') }:</td>
                                <td  align="end" style="font-size: 10px; color: #ff3333;  border-top: 1px solid #979797;"> ${writeOffamount}</td>
                            </tr>`
                            :""
                        }                        
                                        
                        <tr>
                            <td  align="end" style="font-size: 10px; color: #292F4C;  font-weight:700; border-top: 1px solid #979797;">${responseMessage(currentlang, 'BALANCE_DUE')}:</td>
                            <td  align="end" style="font-size: 10px; color: #292F4C; font-weight:700;  border-top: 1px solid #979797;"> ${balance}</td>
                        </tr>
                    </table>
                </td> 
            </tr>
        </table>
        `;


        templateContent += `                      
                      
                  </td>
                </tr>
            </table>     
        `;


        let isFile = requestedData.isFile;    
        let footerContent = await footerData(companyData);  

            let options = { 
                format: 'A4',
                date:false,
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate:'<div></div>',                               
                footerTemplate:footerContent,                               
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

                if(isFile && isFile == 1){
                    let randomNumber = new Date().getTime()+Math.floor(Math.random() * 10000000);
                    let fileName =   `${requestedData.template}-${randomNumber}.pdf`;  
                    let pdfFilePath =  path.resolve('public/pdf')+`/${fileName}`;                 

                    fs.writeFile(`${pdfFilePath}`, pdfBuffer, (err) => {
                        if(err) {
                            throw err;
                        } 
                        resolve({
                            file:fileName
                        });
                      });

                    // let getUploadedFile  = await uploadToBucket({
                    //     fileName:fileName,
                    //     file:pdfBuffer,
                    //     companySlug:companyData.slug
                    // })
                    resolve(pdfFilePath);


                } else if(dataObj.isMailData){

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
                
            }).catch((err)=>{               
                reject(err)
            });
        } catch (e) {          
            reject(e)
        }
    })
}






function getDetails(invoiceId, langCode) {

    return new Promise(async(resolve,reject)=>{

        try{

            if (!invoiceId) {
                throw {
                    errors: [],
                    message: responseMessage(langCode, 'ID_MISSING'),
                    statusCode: 412
                }
            }

            let recordDetail = await InvoiceSchema.aggregate([
                { $match: { _id: ObjectID(invoiceId) } },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customer',
                        foreignField: '_id',
                        as: 'customer',
                    },
                },
                {
                    "$project": {
                        "description": 1,
                        "invoice_number": 1,
                        "date": 1,
                        "due_date": 1,
                        "status": 1,
                        "currency": 1,
                        "shipping_charges": 1,
                        "file_attachment": 1,
                        "requested_deposite": 1,
                        "credit_applied": 1,
                        "adjustment": 1,
                        "write_off": 1,
                        "write_off_amount": 1,
                        "products": 1,
                        "sub_total": 1,
                        "total_tax": 1,
                        "total_discount": 1,
                        "invoice_tax": 1,
                        "refund": 1,
                        "total_amount": 1,
                        "invoice_paid": 1,
                        "balance_amount": 1,
                        "customer_notes": 1,
                        "invoice_terms": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "customer": { "$arrayElemAt": ["$customer", 0] }
                    }
                },
                {
                    "$project": {
                        "description": 1,
                        "invoice_number": 1,
                        "date": 1,
                        "due_date": 1,
                        "status": 1,
                        "currency": 1,
                        "shipping_charges": 1,
                        "file_attachment": 1,
                        "requested_deposite": 1,
                        "credit_applied": 1,
                        "adjustment": 1,
                        "write_off": 1,
                        "write_off_amount": 1,
                        "products": 1,
                        "sub_total": 1,
                        "total_tax": 1,
                        "total_discount": 1,
                        "customer_notes": 1,
                        "invoice_terms": 1,
                        "invoice_tax": 1,
                        "refund": 1,
                        "total_amount": 1,
                        "invoice_paid": 1,
                        "balance_amount": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "customer._id": 1,
                        "customer.customer_name": 1,
                        "customer.crn": 1,
                        "customer.tin_or_vat_id": 1,
                        "customer.contact_phone_number": 1,
                        "customer.contact_p_dialcode": 1,
                        "customer.contact_mobile_number": 1,
                        "customer.contact_m_dialcode": 1,
                        "customer.email": 1,
                        "customer.billing_address": 1
                    }
                }
    
            ]);

            if(recordDetail && recordDetail.length>0){
                resolve(recordDetail[0]);
            } else {
                throw {
                    errors: [],
                    message: responseMessage(langCode, 'SOMETHING_WRONG'),
                    statusCode: 412
                }
            }

          

        } catch($e){
            return reject($e);
        }

    })  
    
}