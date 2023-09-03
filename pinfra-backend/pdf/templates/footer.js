const env = require("../../config/env");
var imageCodes = {};

async function footerData(companySettings){
    return `
    <div style="width:100% !important;font-size:8px !important; margin-left:0;">

<div style="display:block;margin:20px 0 0px 20px;">

<table cellspacing="0" cellpadding="10px" border="0" width="100%">
                            <tr >
                                <td colspan="2"></td>
                                </tr>
                            <tr >
                            <td align="left">                                                          
                            </td>
                            <td></td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                </tr>
                        </table>




</div> 
<div style="display:flex;align-items:center;justify-content:center;border-top:1px solid #ccc;padding-top:10px;">
</div>

</div>
    `;


}


module.exports = {
    footerData
}