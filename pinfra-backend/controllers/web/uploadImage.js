const Response = require('../../libs/response');
const mime = require('mime');
const fs = require('fs');
const path = require('path');
const { responseMessage } = require("../../libs/responseMessages");

module.exports = {
    upload
}

async function upload(req, res) {

    try {

        let reqObj = req.body;
        reqObj.created_by = reqObj.login_user_id;
        reqObj.updated_by = reqObj.login_user_id;

        let imgB64Data = reqObj.data;
        var decodedImg = decodeBase64Image(imgB64Data);
        var imageBuffer = decodedImg.data;
        var type = decodedImg.type;
        var extension = mime.getExtension(type);
        let randomString = Math.floor(Math.random() * 10) + new Date().getTime();
        var fileName =  `sign-${randomString}.${extension}`;
        fs.writeFileSync(path.resolve('./public')+'/uploads/' + fileName, imageBuffer, 'utf8');

        res.status(200).json(await Response.success({
            filename:fileName,
            fileNameWithPath:`uploads/${fileName}`,
            path:'uploads'
        }, responseMessage(reqObj.langCode, 'RECORD_CREATED'), req));

    } catch (error) {
        console.log('error', error)
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
  }