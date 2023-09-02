const RateApprovalSchema = require('../../models/RateApproval')
const Response = require('../../libs/response')
const { responseMessage } = require("../../libs/responseMessages");
const ObjectID = require('mongodb').ObjectID;
const { getVendorListByLocation,addPurchaseOrder } = require('./utilityController')

module.exports = {
    getList,
    getDetails,
    updateData,
    deleteData
}



async function updateData(req, res) {

    try {

        let reqObj = req.body;
        let loginUserId = reqObj.login_user_id;

        if (!reqObj._id) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'ID_MISSING'),
                statusCode: 412
            }
        }

        let requestedData = { ...reqObj, ...{ updated_by: loginUserId } };


        let updatedData = await RateApprovalSchema.findOneAndUpdate({
            _id: ObjectID(reqObj._id)
        }, requestedData, {
            new: true
        });

        if (updatedData) {
            // await addPurchaseOrder(updatedData.toObject(), reqObj.langCode, loginUserId);
            if (updatedData.status && updatedData.status == 'approved') {
               await addPurchaseOrder(updatedData.toObject(), reqObj.langCode, loginUserId);
            }

            res.status(200).json(await Response.success(updatedData, responseMessage(reqObj.langCode, 'RECORD_UPDATED'), req));
        } else {
            res.status(400).json(await Response.success({}, responseMessage(reqObj.langCode, 'NO_RECORD_FOUND'), req));
        }

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function getList(req, res) {
    // stage
    try {

        let reqObj = req.body;

        let { page, per_page, sort_by, sort_order, list_type, filter_by, filter_value, stage } = req.query;
        let requestedParam = req.query;

        let pageData = Response.validationPagination(page, per_page);

        let sort = {
            '_id': -1
        }
        if (sort_by) {
            let order = (sort_order == 'desc') ? -1 : 1;
            sort = {
                [sort_by]: order
            }
        }

        let filterRequest = {};
        if (filter_by && filter_value) {
            filterRequest[filter_by] = filter_value
        }
        if (stage) {
            filterRequest.stage = stage
        }

        if (page > 0) {
            let allRecords = await RateApprovalSchema.aggregate([
                { $match: filterRequest },
                {
                    $facet: {
                        data: [
                            {
                                $lookup: {
                                    from: 'sites',
                                    localField: 'site',
                                    foreignField: '_id',
                                    as: 'sitesData',
                                },
                            },
                            {
                                "$project": {
                                    "rate_approval_number": 1,
                                    "title": 1,
                                    "handle_by": 1,
                                    "date": 1,
                                    "expected_delivery_date": 1,
                                    "site": 1,
                                    "local_purchase": 1,
                                    "stage": 1,
                                    "items": 1,
                                    "status": 1,
                                    "remarks": 1,
                                    "updated_by": 1,
                                    "created_by": 1,
                                    "created_at": 1,
                                    "updated_at": 1,
                                    "siteData": { "$arrayElemAt": ["$sitesData", 0] }
                                }
                            },
                            {
                                "$project": {
                                    "title": 1,
                                    "handle_by": 1,
                                    "date": 1,
                                    "expected_delivery_date": 1,
                                    "rate_approval_number": 1,
                                    "site": 1,
                                    "local_purchase": 1,
                                    "stage": 1,
                                    "items": 1,
                                    "status": 1,
                                    "remarks": 1,
                                    "updated_by": 1,
                                    "created_by": 1,
                                    "created_at": 1,
                                    "updated_at": 1,
                                    "siteData.site_name": 1,
                                    "siteData.code": 1,
                                    "siteData._id": 1
                                }
                            },
                            { '$sort': sort },
                            { "$skip": pageData.offset },
                            { "$limit": pageData.limit }

                        ],
                        total: [{ $count: 'total' }]
                    }
                }
            ]);
            res.status(200).json(await Response.pagination(allRecords, responseMessage(reqObj.langCode, 'SUCCESS'), pageData, req));
        } else {
            let allRecords = await RateApprovalSchema.aggregate([
                { $match: filterRequest },
                {
                    $lookup: {
                        from: 'sites',
                        localField: 'site',
                        foreignField: '_id',
                        as: 'sitesData',
                    },
                },
                {
                    "$project": {
                        "title": 1,
                        "handle_by": 1,
                        "date": 1,
                        "expected_delivery_date": 1,
                        "rate_approval_number": 1,
                        "site": 1,
                        "local_purchase": 1,
                        "stage": 1,
                        "items": 1,
                        "status": 1,
                        "remarks": 1,
                        "updated_by": 1,
                        "created_by": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "siteData": { "$arrayElemAt": ["$sitesData", 0] }
                    }
                },
                {
                    "$project": {
                        "title": 1,
                        "handle_by": 1,
                        "date": 1,
                        "expected_delivery_date": 1,
                        "rate_approval_number": 1,
                        "site": 1,
                        "local_purchase": 1,
                        "stage": 1,
                        "items": 1,
                        "status": 1,
                        "remarks": 1,
                        "updated_by": 1,
                        "created_by": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "siteData.site_name": 1,
                        "siteData.code": 1,
                        "siteData._id": 1
                    }
                },
                { '$sort': sort }
            ]);
            res.status(200).json(await Response.success(allRecords, responseMessage(reqObj.langCode, 'SUCCESS'), req));
        }



    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function getDetails(req, res) {

    try {
        let reqObj = req.body;
        let { _id } = req.query;

        if (!_id) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'ID_MISSING'),
                statusCode: 412
            }
        }

        let getVendorList = await getVendorListByLocation();


        let recordDetail = await RateApprovalSchema.aggregate([
            {
                $match: {
                    _id: ObjectID(_id),
                }
            },
            {
                $unwind: "$items"
            },

            {
                $lookup: {
                    from: 'items',
                    localField: 'items.item_id',
                    foreignField: '_id',
                    as: 'items.itemDetail',
                },
            },
            {
                "$project": {
                    "title": 1,
                    "handle_by": 1,
                    "date": 1,
                    "expected_delivery_date": 1,
                    "rate_approval_number": 1,
                    "site": 1,
                    "local_purchase": 1,
                    "stage": 1,
                    "items": 1,
                    "vendors_total": 1,
                    "status": 1,
                    "remarks": 1,
                    "updated_by": 1,
                    "created_by": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "itemDetail": { "$arrayElemAt": ["$items.itemDetail", 0] }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'itemDetail.category',
                    foreignField: '_id',
                    as: 'items.categoryDetail',
                },
            },
            {
                $lookup: {
                    from: 'sub_categories',
                    localField: 'itemDetail.sub_category',
                    foreignField: '_id',
                    as: 'items.subCategoryDetail',
                },
            },
            {
                $lookup: {
                    from: 'uoms',
                    localField: 'itemDetail.uom',
                    foreignField: '_id',
                    as: 'items.uomDetail',
                },
            },

            {
                "$project": {
                    "title": 1,
                    "handle_by": 1,
                    "date": 1,
                    "expected_delivery_date": 1,
                    "rate_approval_number": 1,
                    "site": 1,
                    "local_purchase": 1,
                    "stage": 1,
                    "status": 1,
                    "remarks": 1,
                    "updated_by": 1,
                    "created_by": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "vendors_total": 1,
                    "items.qty": "$items.qty",
                    "items.brand": "$items.brand",
                    "items.tax": "$items.tax",
                    "items.vendors": "$items.vendors",
                    "items.attachment": "$items.attachment",
                    "items.remark": "$items.remark",
                    "items._id": "$items._id",
                    "items.item_id": "$items.item_id",
                    "items.item_name": "$itemDetail.item_name",
                    "items.categoryDetail": { "$arrayElemAt": ["$items.categoryDetail", 0] },
                    "items.subCategoryDetail": { "$arrayElemAt": ["$items.subCategoryDetail", 0] },
                    "items.uomDetail": { "$arrayElemAt": ["$items.uomDetail", 0] }
                }
            },
            {
                "$project": {
                    "title": 1,
                    "handle_by": 1,
                    "date": 1,
                    "expected_delivery_date": 1,
                    "rate_approval_number": 1,
                    "site": 1,
                    "local_purchase": 1,
                    "stage": 1,
                    "status": 1,
                    "remarks": 1,
                    "updated_by": 1,
                    "created_by": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "vendors_total": 1,
                    "items.qty": "$items.qty",
                    "items.tax": "$items.tax",
                    "items.brand": "$items.brand",
                    "items.vendors": "$items.vendors",
                    "items.attachment": "$items.attachment",
                    "items.remark": "$items.remark",
                    "items._id": "$items._id",
                    "items.item_id": "$items.item_id",
                    "items.item_name": "$items.item_name",
                    "items.categoryDetail._id": 1,
                    "items.categoryDetail.name": 1,
                    "items.categoryDetail.code": 1,
                    "items.subCategoryDetail._id": 1,
                    "items.subCategoryDetail.subcategory_name": 1,
                    "items.uomDetail._id": 1,
                    "items.uomDetail.uom_name": 1,
                }
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    handle_by: { $first: '$handle_by' },
                    date: { $first: '$date' },
                    vendors_total: { $first: '$vendors_total' },
                    expected_delivery_date: { $first: '$expected_delivery_date' },
                    rate_approval_number: { $first: '$rate_approval_number' },
                    site: { $first: '$site' },
                    local_purchase: { $first: '$local_purchase' },
                    stage: { $first: '$stage' },
                    status: { $first: '$status' },
                    remarks: { $first: '$remarks' },
                    updated_by: { $first: '$updated_by' },
                    created_by: { $first: '$created_by' },
                    created_at: { $first: '$created_at' },
                    updated_at: { $first: '$updated_at' },
                    items: { $push: '$items' },
                }
            }
        ]);

        if (recordDetail && recordDetail.length > 0) {
            res.status(200).json(await Response.success({ details: recordDetail[0], vendorsList: getVendorList }, responseMessage(reqObj.langCode, 'SUCCESS')));
        } else {
            res.status(422).json(await Response.success({}, responseMessage(reqObj.langCode, 'NO_RECORD_FOUND'), req));
        }

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}



async function deleteData(req, res) {

    try {

        let reqObj = req.body;
        let { _id } = req.query;

        if (!_id) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'ID_MISSING'),
                statusCode: 412
            }
        }
        let record = await RateApprovalSchema.findOneAndDelete({ company_id: company_id, _id: ObjectID(_id) });

        res.status(200).json(await Response.success('', responseMessage(reqObj.langCode, 'RECORD_DELETED'), req));

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}
