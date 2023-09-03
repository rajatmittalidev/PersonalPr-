const pdfObj = require('./index');
const GeneralSettingSchema = require('../models/generalSetting');

function generatePDF(requestedData) {
    return new Promise(async(resolve, reject) => {
        try {
            if (!requestedData.template) {
                reject({
                    message: "Please provide template name"
                })
                return false;
            }
            if (!pdfObj[requestedData.template]) {
                reject({
                    message: "Template not found"
                })
                return false;
            }

            let company_id = requestedData.login_company_id;
            let companyRecord = await GeneralSettingSchema.findOne({ company_id: company_id });



            let finalData = {
                requestedData: requestedData,
                companyData: companyRecord
            }

            let pdfBuffer = await pdfObj[requestedData.template].generatePdf(finalData);         
            resolve(pdfBuffer);

        } catch ($e) {     
            reject($e)
        }

    });

}

module.exports = generatePDF;