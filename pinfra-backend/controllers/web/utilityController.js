'use strict';

const ObjectID = require('mongodb').ObjectID;
const NumberingGroupSchema = require('../../models/NumberGroup');
const RateApprovalSchema = require('../../models/RateApproval');
const PurchaseOrderSchema = require('../../models/PurchaseOrder');
const SiteSchema = require('../../models/Site');
const ItemSchema = require('../../models/Item');
const VendorSchema = require('../../models/Vendor');
const ProjectActivityDataSchema = require('../../models/ProjectActivityData');
const ProjectSchema = require('../../models/Project');

module.exports = {
    getNextNumberGroupId,
    updateNextNumberGroupId,
    addRateApproval,
    checkVendorCount,
    getVendorListByLocation,
    updateTotalCumulativeQuantity,
    checkTotalQuantityValidation,
    addPurchaseOrder,
}

/* Generate Number group id */
function getNextNumberGroupId(groupId, moduleName = "") {

    return new Promise(async (resolve, reject) => {
        try {
            let getNumberGroup;

            if (moduleName) {
                getNumberGroup = await NumberingGroupSchema.findOne({ "module": moduleName });
            } else {
                getNumberGroup = await NumberingGroupSchema.findOne({ "_id": ObjectID(groupId) });
            }

            if (getNumberGroup) {
                let nextId = (getNumberGroup.next_id) ? getNumberGroup.next_id : 0;
                nextId = nextId + 1;
                resolve(nextId);
            } else {
                await new NumberingGroupSchema({ "module": moduleName,next_id: 1 }).save();                   
                resolve(1);
            }

        } catch (error) {
            console.log('error', error)
            reject(error);
        }
    });

}

/* Update invoice id for next result */
function updateNextNumberGroupId(groupId, moduleName = "") {

    return new Promise(async (resolve, reject) => {
        try {
            let getNumberGroup;

            if (moduleName) {
                getNumberGroup = await NumberingGroupSchema.findOneAndUpdate(
                    { "module": moduleName },
                    { $inc: { next_id: 1 } }
                )
            } else {
                getNumberGroup = await NumberingGroupSchema.findOneAndUpdate(
                    { "_id": ObjectID(groupId) },
                    { $inc: { next_id: 1 } }
                )
            }


            if (getNumberGroup) {
                resolve(true)
            } else {
                resolve(false)
            }

        } catch (error) {
            reject(error);
        }
    });

}

/* Rate approval */
function addRateApproval(dataObj, langCode, currentUserId) {
    return new Promise(async (resolve, reject) => {
        try {
            let cloneData = { ...dataObj };

            let getVendors = await VendorSchema.aggregate([
                {
                    "$project": {
                        "vendor_id": "$_id",
                        "vendor_name": 1
                    }
                },
                {
                    $addFields: {
                        item_rate: 0,
                        item_subtotal: 0,
                        item_total_amount: 0,
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                    }
                },
                { '$sort': { '_id': -1 } }
            ]);

            let vendorTotal = [];
            getVendors.map((o) => {
                vendorTotal.push({
                    vendor_id: o.vendor_id,
                    vendor_name: o.vendor_name,
                    brand: '',
                    subtotal: 0,
                    total_tax: 0,
                    freight_charges: 0,
                    freight_tax: 0,
                    total_amount: 0
                })
            });

            delete cloneData._id;
            delete cloneData.items;
            delete cloneData.purchase_request_number;
            delete cloneData.remark;
            cloneData.purchase_request_id = dataObj._id;
            cloneData.status = 'pending';
            cloneData.vendors_total = vendorTotal;
            cloneData.stage = 'rate_comparitive';

            console.log('cloneData', cloneData)

            let itemArray = [];

            if (dataObj.items && dataObj.items.length > 0) {
                let promises = dataObj.items.map(async (o) => {

                    let getItemDetail = await ItemSchema.aggregate([
                        { $match: { _id: ObjectID(o.item_id) } },
                        {
                            $lookup: {
                                from: 'gsts',
                                localField: 'gst',
                                foreignField: '_id',
                                as: 'gstDetail',
                            },
                        },
                        {
                            "$project": {
                                "item_name": 1,
                                "item_number": 1,
                                "category": 1,
                                "sub_category": 1,
                                "uom": 1,
                                "gst": 1,
                                "specification": 1,
                                "created_at": 1,
                                "updated_at": 1,
                                "created_by": 1,
                                "updated_by": 1,
                                "gstDetail": { "$arrayElemAt": ["$gstDetail", 0] },
                            }
                        },
                        {
                            "$project": {
                                "item_name": 1,
                                "item_number": 1,
                                "category": 1,
                                "sub_category": 1,
                                "uom": 1,
                                "gst": 1,
                                "specification": 1,
                                "created_at": 1,
                                "updated_at": 1,
                                "created_by": 1,
                                "updated_by": 1,
                                "gstDetail._id": 1,
                                "gstDetail.gst_name": 1,
                                "gstDetail.gst_percentage": 1
                            }
                        }
                    ]);
                    if (getItemDetail && getItemDetail.length > 0) {

                        itemArray.push({
                            item_id: o.item_id,
                            tax: {
                                amount: getItemDetail[0]['gstDetail']['gst_percentage'],
                                name: getItemDetail[0]['gstDetail']['gst_name'],
                            },
                            qty: o.qty,
                            attachment: o.attachment,
                            remark: o.remark,
                            vendors: getVendors
                        });

                    }
                });

                let newData = await Promise.all(promises);

                cloneData.items = itemArray;
            }

            let getNumber = await getNextNumberGroupId('', 'rate_approval');

            cloneData.rate_approval_number = getNumber;

            let savedData = await new RateApprovalSchema(cloneData).save();

            /* Update numbering group */
            updateNextNumberGroupId('', 'rate_approval');


            resolve(savedData)


        } catch (error) {
            console.log('error', error)
            reject(error);
        }
    });
}


function checkVendorCount() {
    return new Promise(async (resolve, reject) => {
        try {
            let getVendors = await VendorSchema.find().lean()

            if (getVendors && getVendors.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        }
    });
}

function getVendorListByLocation() {
    return new Promise(async (resolve, reject) => {
        try {
            let getVendors = await VendorSchema.find().sort({ _id: 1 }).lean()

            if (getVendors && getVendors.length > 0) {
                resolve(getVendors)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        }
    });
}


async function updateTotalCumulativeQuantity(activityData) {


    let getTotalQuantity = await ProjectActivityDataSchema.aggregate([
        {
            $match: { activity_ref_id: activityData.activity_ref_id }
        },
        {
            $group: { _id: null, totalQuantity: { $sum: "$daily_quantity" } }
        }
    ]);

    let totalUsedQuantity = 0;
    if (getTotalQuantity && getTotalQuantity.length > 0) {
        totalUsedQuantity = getTotalQuantity[0]['totalQuantity'];
    }


    let updatedData = await ProjectSchema.updateOne(
        { _id: ObjectID(activityData.project_id), "locations.structures.activities._id": ObjectID(activityData.activity_ref_id) },
        {
            $set: {
                'locations.$[].structures.$[].activities.$[xxx].dailyCumulativeTotal': totalUsedQuantity
            }
        },
        {
            arrayFilters: [
                { "xxx._id": ObjectID(activityData.activity_ref_id) }
            ]
        }
    )
    return updatedData;
}



async function checkTotalQuantityValidation(activityData, updatedQuantity) {

    try {
        let getprojectData = await ProjectSchema.findOne({
            _id: ObjectID(activityData.project_id),
            "locations._id": ObjectID(activityData.location_ref_id)
        }, { "locations.$": 1 }).lean()

        let totalQuantity = 0;
        if (getprojectData && getprojectData.locations && getprojectData.locations[0] && getprojectData.locations[0]['structures'] && getprojectData.locations[0]['structures'].length > 0) {
            getprojectData.locations[0]['structures'].map((o) => {
                if (o._id.toString() == activityData.structure_ref_id.toString() && o.activities && o.activities.length > 0) {
                    o.activities.map((o1) => {
                        if (o1._id.toString() == activityData.activity_ref_id.toString()) {
                            totalQuantity = o1.quantity;
                        }
                        return o1;
                    })
                }
                return o;
            })
        }

        if (totalQuantity <= 0) {
            throw {
                status: 422,
                message: "Please add total quantity in activity"
            }
        }





        let getTotalQuantity = await ProjectActivityDataSchema.aggregate([
            {
                $match: {
                    activity_ref_id: activityData.activity_ref_id,
                    _id: { $ne: ObjectID(activityData._id) },
                }
            },
            {
                $group: { _id: null, totalQuantity: { $sum: "$daily_quantity" } }
            }
        ]);

        let totalUsedQuantity = 0;
        if (getTotalQuantity && getTotalQuantity.length > 0) {
            totalUsedQuantity = getTotalQuantity[0]['totalQuantity'];
        }

        totalUsedQuantity = totalUsedQuantity + updatedQuantity;

        if (totalUsedQuantity > totalQuantity) {
            throw {
                status: 422,
                message: "Used quantity cannot be greater than total quantity."
            }
        }

        return { totalQuantity: totalQuantity, totalUsedQuantity: totalUsedQuantity };
    } catch (error) {
        throw error
    }

}



/* Rate approval */
function addPurchaseOrder(dataObj, langCode, currentUserId) {
    return new Promise(async (resolve, reject) => {
        try {

            let getSiteData = await SiteSchema.findOne({_id:ObjectID(dataObj.site)}).lean();

            let address = {};
            if(getSiteData){
                address = {
                    company_name:getSiteData.site_name,
                    gst_number:'',
                    pan_card:'',
                    contact_person:getSiteData.store_manager,
                    email:getSiteData.site_manager_email,
                    ...getSiteData.address
                }
            }
            
            let getPONumber = await getNextNumberGroupId('', 'purchase_order');
            console.log('getPONumber', getPONumber)

            let requestedData = {
                po_number:getPONumber,
                rate_approval_id:dataObj._id,
                date:dataObj.date,
                items:dataObj.items,
                status:'pending',
                remarks:'',
                vendors_total:dataObj.vendors_total,
                created_by:dataObj.updated_by,
                updated_by:dataObj.updated_by,
                billing_address:address,
                delivery_address:address,
            } 

            let savedData = await new PurchaseOrderSchema(requestedData).save();

            /* Update numbering group */
            updateNextNumberGroupId('', 'purchase_order');


            resolve(savedData)


        } catch (error) {
            reject(error);
        }
    });
}