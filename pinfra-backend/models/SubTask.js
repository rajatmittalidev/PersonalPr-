const mongoose = require('mongoose')


const subTaskSchema = new mongoose.Schema({

    subTaskName:{
        type:String,
        //required:true

    },

    projectId:{
        type:String,
       // required:true

    },

    taskName:{
        type:String,
       // required:true

    },
    r1EndDate:{
        type:Date,
    },
    r2EndDate:{
        type:Date,
    },
    r3EndDate:{
        type:Date,
    },
    addRevisesDates:{type : Array , "default" : []},

    actualRevisedStartDate:{
        type:Date,
        //required:true
    },
    
    
    workingDaysRevised:{
        type:String,
        //required:true
    },

    baseLineStartDate:{
        type:Date,
        //required:true
    },
    
    
    baseLineEndDate:{
        type:Date,
        //required:true
    },

    baseLineWorkingDays:{
        type:String,
        //required:true
    },
    
    
    uom:{
        type:String,
        //required:true
    },

    total:{
        type:Number,
        "default" : 0
        //required:true
    },
    cumulativeCompleted:{
        type:String,
        //required:true
    },

    targetStatus:{
        type:String,
        //required:true
    },

    noofDaysBalanceasperrevisedEnddate:{
        type:String,
        //required:true
    },

    dailyAskingRateasperRevisedEndDate:{
        type:String,
        //required:true
    },
    noofDaysBalanceasperbaseLine:{
        type:String,
        //required:true
    },
    dailyAskingRateasperbaseLine:{
        type:String,
        //required:true
    },

    currentDailyAskingRate:{
        type:String,
        //required:true
    },

    ActivityBalanceInPercentage:{
        type:String,
        //required:true
    },

    dailyCumulativeTotal:{
        type:Number,
        "default" : 0
        //required:true
    },

    previousValue:{
        type:Number,
        "default" : 0
        //required:true
    },
    totalDate:{
        type:Date,
    },
    dateStr:{
        type:String,
        //required:true
    },
    remarks : { type : Array , "default" : [] },







     



    


})

module.exports = mongoose.model('SubTask',subTaskSchema)