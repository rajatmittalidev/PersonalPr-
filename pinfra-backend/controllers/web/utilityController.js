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
const _ = require('lodash');
const RecentActivity = require('../../models/recentActivity');
const {  billingAddress, mailContentHeader,  mailContent,  termsConsition} = require('../../libs/constant');

module.exports = {
    getNextNumberGroupId,
    updateNextNumberGroupId,
    addRateApproval,
    checkVendorCount,
    getVendorListByLocation,
    updateTotalCumulativeQuantity,
    checkTotalQuantityValidation,
    addPurchaseOrder,
    updateActivityLog
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
                await new NumberingGroupSchema({ "module": moduleName, next_id: 1 }).save();
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


/* Filter VendorByCategory */
function filterVendorByCategory(vendorList,categoryId) {
    return new Promise(async (resolve, reject) => {
        if(vendorList && vendorList.length>0){

            let vendorListData = vendorList.filter((o)=>{
                if(o.category.includes(String(categoryId))){
                    return o;
                }
            });
            resolve(vendorListData);
        } else {
            resolve([]);
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
                        "vendor_name": 1,
                        "category": 1
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
           

            

            delete cloneData._id;
            delete cloneData.items;
            delete cloneData.purchase_request_number;
            delete cloneData.remark;
            cloneData.purchase_request_id = dataObj._id;
            cloneData.status = 'pending';
            
            cloneData.stage = 'rate_comparitive';

            let itemArray = [];

            if (dataObj.items && dataObj.items.length > 0) {

                let selectedVendorArray = [];

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

                        let filteredVendor = await filterVendorByCategory(getVendors,getItemDetail[0]['category']);
                        selectedVendorArray = selectedVendorArray.concat(filteredVendor);
                    
                        itemArray.push({
                            item_id: o.item_id,
                            tax: {
                                amount: getItemDetail[0]['gstDetail']['gst_percentage'],
                                name: getItemDetail[0]['gstDetail']['gst_name'],
                            },
                            qty: o.qty,
                            attachment: o.attachment,
                            remark: o.remark,
                            vendors: filteredVendor
                        });

                    }
                });

             


                let newData = await Promise.all(promises);

                   selectedVendorArray = _.uniqBy(selectedVendorArray, function (e) {
                    return e.vendor_id;
                });              

                if(selectedVendorArray && selectedVendorArray.length>0){
                    selectedVendorArray.map((o) => {
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
                }
                cloneData.vendors_total = vendorTotal;

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

            let getItemList = await ItemSchema.aggregate([
                       
                            {
                                $lookup: {
                                    from: 'categories',
                                    localField: 'category',
                                    foreignField: '_id',
                                    as: 'categoryDetail',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'sub_categories',
                                    localField: 'sub_category',
                                    foreignField: '_id',
                                    as: 'subCategoryDetail',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'uoms',
                                    localField: 'uom',
                                    foreignField: '_id',
                                    as: 'uomDetail',
                                },
                            },
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
                                    "categoryDetail": { "$arrayElemAt": ["$categoryDetail", 0] },
                                    "subCategoryDetail": { "$arrayElemAt": ["$subCategoryDetail", 0] },
                                    "uomDetail": { "$arrayElemAt": ["$uomDetail", 0] },
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
                                    "categoryDetail._id": 1,
                                    "categoryDetail.name": 1,
                                    "categoryDetail.code": 1,
                                    "subCategoryDetail._id": 1,
                                    "subCategoryDetail.subcategory_name": 1,
                                    "uomDetail._id": 1,
                                    "uomDetail.uom_name": 1,
                                    "gstDetail._id": 1,
                                    "gstDetail.gst_name": 1,
                                    "gstDetail.gst_percentage": 1
                                }
                            }                 
                
            ]);


            let itemAssociatedArray = {};
            if(getItemList && getItemList.length>0){

                let allItemsPromise = getItemList.map(async (itemObj) => {
                    itemAssociatedArray[itemObj._id] = itemObj;
                    return itemObj;
                });
                let allItemsPromiseResp = await Promise.all(allItemsPromise);
            }



            let vendorsList = await VendorSchema.find({}).lean();

            let vendorsAssociatedArray = {};
            if(vendorsList && vendorsList.length>0){

                let allVendorsPromise = vendorsList.map(async (obj) => {
                    vendorsAssociatedArray[obj._id] = obj;
                    return obj;
                });
                let allVendorsPromiseResp = await Promise.all(allVendorsPromise);
            }



            let getSiteData = await SiteSchema.findOne({ _id: ObjectID(dataObj.site) }).lean();

            let address = {};
            if (getSiteData) {
                address = {
                    company_name: getSiteData.site_name,
                    gst_number: '',
                    pan_card: '',
                    contact_person: getSiteData.store_manager,
                    email: getSiteData.site_manager_email,
                    ...getSiteData.address
                }
            }





            let itemsbyVendor = {};
            if (dataObj.items && dataObj.items.length > 0) {

                let allPromise = dataObj.items.map(async (itemObj) => {



                    if (itemObj.vendors && itemObj.vendors.length > 0) {
                        itemObj.vendors.map((vendorObj) => {

                            let itemData = { ...itemObj };


                            if(itemAssociatedArray[itemData.item_id] && itemAssociatedArray[itemData.item_id]['item_name']){
                                itemData.item_name = itemAssociatedArray[itemData.item_id]['item_name'];
                            }
                            if(itemAssociatedArray[itemData.item_id] && itemAssociatedArray[itemData.item_id]['specification']){
                                itemData.item_description = itemAssociatedArray[itemData.item_id]['specification'];
                            }

                            if(itemAssociatedArray[itemData.item_id] && itemAssociatedArray[itemData.item_id]['uomDetail']){
                                itemData.uom = {
                                    uom_name: itemAssociatedArray[itemData.item_id]['uomDetail']['uom_name'],
                                    uom_id:itemAssociatedArray[itemData.item_id]['uomDetail']['_id']
                                } 
                            }

                            if (vendorObj.item_total_amount > 0) {
                                itemData.vendors = [vendorObj];

                                let vid = String(vendorObj.vendor_id);

                                if (!(itemsbyVendor[vid] && itemsbyVendor[vid].length > 0)) {
                                    itemsbyVendor[vid] = [];
                                }
                                itemsbyVendor[vid].push(itemData)
                            }

                            return vendorObj;
                        })
                    }
                    return itemObj;
                })


                let newData = await Promise.all(allPromise);

            }

            let allorders = [];

            if (dataObj.vendors_total && dataObj.vendors_total.length > 0) {

                for (let i = 0; i < dataObj.vendors_total.length; i++) {
                    let vendor = dataObj.vendors_total[i];

                    if (vendor.total_amount && vendor.total_amount > 0) {

                        let getPONumber = await getNextNumberGroupId('', 'purchase_order');
                        let updatedNUmber = await updateNextNumberGroupId('', 'purchase_order');                        

                        let order = {
                            po_number: getPONumber,
                            rate_approval_id: dataObj._id,
                            date: dataObj.date,
                            due_date: dataObj.date,
                            title: dataObj.title,
                            site: dataObj.site,
                            local_purchase: dataObj.local_purchase,
                            status: 'pending',
                            remarks: '',
                            created_by: dataObj.updated_by,
                            updated_by: dataObj.updated_by,
                            billing_address: billingAddress,
                            delivery_address: address,
                            vendor_message_header:mailContentHeader,
                            vendor_message:mailContent,
                            terms_condition:termsConsition
                        }
                        order.vendors_total = [vendor];
                        order.items = itemsbyVendor[vendor.vendor_id];

                        if(vendorsAssociatedArray && vendorsAssociatedArray[vendor.vendor_id]){
                            order['vendor_detail'] = vendorsAssociatedArray[vendor.vendor_id]
                        }

                        allorders.push(order)
                    }
                }
            }

            if (allorders && allorders.length > 0) {

                let savedData = await PurchaseOrderSchema.insertMany(allorders);
            }

            resolve(allorders);

        } catch (error) {
            reject(error);
        }
    });
}


function updateActivityLog(description) {

    return new Promise(async (resolve, reject) => {
        try {

            let recentActivity = new RecentActivity({
                description: description
            });
            recentActivity = await recentActivity.save()

            resolve(recentActivity);

        } catch (error) {
            reject(error);
        }
    });
}