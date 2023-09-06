
const { responseMessage } = require("../../libs/responseMessages");
const pdfObj = require('../../pdf/index');
const Response = require("../../libs/response");
const { sendMail } = require("../../libs/mailer");

module.exports = {
    sendTemplateFn
}

async function sendTemplateFn(req, res) {

    try {

        let requestedData = req.body;

        if (!requestedData.template) {
            throw {
                message: "Please provide template name"
            }
        }
        if (!pdfObj[requestedData.template]) {
            throw {
                message: "Template not found"
            }
        }
     

        let finalData = {
            requestedData: requestedData,
            isMailData: true
        }

      
            let getPdfData = await pdfObj[requestedData.template].generatePdf(finalData);
          
             sendMail({
                logo: getPdfData.companyLogo,
                to: getPdfData.to,
                subject: getPdfData.subject,
                template: requestedData.template,
                context: {
                    receiver_name: getPdfData.receiver_name,
                    sender_name: getPdfData.sender_name
                },
                attachments: [
                    {
                        filename: getPdfData.fileName,
                        content: Buffer.from(getPdfData.pdfBuffer, 'utf-8')
                    }]
            })

       

        setTimeout(async () => {
            res.status(200).json(await Response.success({}, responseMessage(requestedData.langCode,'EMAIL_SENT'),req));
        }, 1000)


    } catch (error) {
        console.log('error', error)

        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            },error,req)
        );
    }

}



