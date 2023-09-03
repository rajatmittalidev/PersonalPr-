const env = require("../config/env");

const moment = require("moment");

function convertCurrency(item) {

    let amount = (item) ? Number(item) : 0;

        let decimalSeperator = '.';
        let thousandseperator = ',';
        let decimalPlaces = 2;
        let currency_symbol = "INR";

        let isMinus = false;
        if (Number(amount) < 0) {
            isMinus = true;
            amount = Number(Math.abs(amount));
        }

        amount = Number(amount);
        amount = (Math.round(amount * 100) / 100).toFixed(decimalPlaces);
        amount = thousandsSeparators(amount.toString(), thousandseperator);
        amount = amount.replace(/\./g, decimalSeperator);

       

            Math.abs(30);

            if (isMinus) {
                amount = `-${currency_symbol}${amount}`;
            } else {
                amount = `${currency_symbol}${amount}`;
            }

        

        return amount;
    

}

function thousandsSeparators(num, seperator) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
    return num_parts.join(".");
}


function formatDate(value, format = "DD-MM-YYYY") {
    let fortmatedTime = moment(value).format(format);
    return fortmatedTime;
}


module.exports = {
    convertCurrency: convertCurrency,
    formatDate: formatDate
}