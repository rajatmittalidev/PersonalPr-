const env = require("../../config/env");
var imageCodes = {};

async function footerData(companySettings){
    return `
    <div style="width:100% !important;font-size:8px !important; margin-left:0;">

<div style="display:block;margin:20px 0 0px 20px;">

<table cellspacing="0" cellpadding="10px" border="0" width="100%">
                       
                            <tr >
                                <td colspan="2">Authorised Signatory</td>
                                </tr>
                           
                        </table>




</div> 
</div>
    `;


}


module.exports = {
    footerData
}