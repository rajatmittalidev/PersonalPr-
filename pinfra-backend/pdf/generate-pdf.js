const pdfObj = require('./index');

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


            let finalData = {
                requestedData: requestedData
            }

            let pdfBuffer = await pdfObj[requestedData.template].generatePdf(finalData);         
            resolve(pdfBuffer);

        } catch ($e) {     
            reject($e)
        }

    });

}

module.exports = generatePDF;