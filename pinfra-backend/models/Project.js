const mongoose = require('mongoose')
const schema = mongoose.Schema;

const projectSchema = new mongoose.Schema({

    projectName: {
        type: String,
        required: true

    },
    projectDate: {
        type: Date,
        //default:Date.now
    },
    location: {
        type: String,
        required: true

    },
    imageUrl: {
        type: String,
        //required:true

    },
    members: { type: Array, "default": [] },

    r0Date: {
        type: Date
    },
    r1Date: {
        type: Date
    },
    r2Date: {
        type: Date
    },
    locations: [
        {
            location_name: {
                type: String,
                default: ""
            },
            location_id: {
                type: schema.Types.ObjectId
            },
            structures: [
                {
                    structure_name: {
                        type: String,
                        default: ""
                    },
                    structure_id: {
                        type: schema.Types.ObjectId,
                    },
                    activities: [
                        {
                            activity_name: {
                                type: String,
                                default: ""
                            },
                            activity_id: {
                                type: schema.Types.ObjectId
                            },
                            actual_revised_start_date: {
                                type: Date,
                                default: null
                            },
                            base_line_start_date: {
                                type: Date,
                                default: null
                            },
                            base_line_end_date: {
                                type: Date,
                                default: null
                            },
                            uom: {
                                type: String,
                                default: null
                            },
                            quantity: {
                                type: Number,
                                default: 0
                            },
                            workingDaysRevised:{
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
                            },
                            baseLineWorkingDays:{
                                type:String,
                                //required:true
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
                        }
                    ],
                }
            ],
        }
    ],
    created_by: String,
    updated_by: String

},
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    })

module.exports = mongoose.model('Project', projectSchema)