const env = require("../../config/env");
const imageToBase64 = require('image-to-base64');



async function footerData(companySettings) {
    let imageName = (companySettings && companySettings.sign)?companySettings.sign:'';
    var imageCodes = '';
    if(imageName){
        let signImg = `${env.signBasePath}/${imageName}`;
        let stampBase64 = await imageToBase64(signImg);
        stampBase64Code = "data:image\/png;base64," + stampBase64;
        imageCodes = stampBase64Code;
    }  


    return `
    <div style="width:100% !important;font-size:8px !important; margin-left:0;">

<div style="display:block;margin:20px 0 0px 20px;">

<table cellspacing="0" cellpadding="10px" border="0" width="100%">
                                ${
                                    imageCodes
                                    ? `<tr ><td align="left" style="text-align:left;padding: 0;">
                                            <div align="left">
                                             <img src="${imageCodes}" width="100px">  
                                            </div                             
                                        </td>
                                        <td></td>
                                        </tr>` 
                                    : ``                       
                                }  
                                <tr>
                                <td style="text-align:left;padding: 0;">Authorised Signatory</td>
                                <td></td>
                                </tr>
                        </table>




</div> 
</div>
    `;


}


module.exports = {
    footerData
}