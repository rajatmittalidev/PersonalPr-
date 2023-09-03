const PurchaseOrderSchema = require('../../models/PurchaseOrder')
const Response = require('../../libs/response')
const { responseMessage } = require("../../libs/responseMessages");
const ObjectID = require('mongodb').ObjectID;
const { getVendorListByLocation } = require('./utilityController')

module.exports = {
    getList,
    getDetails,
    updateData,
    deleteData,
    getInvetoryList
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

        let updatedData = await PurchaseOrderSchema.findOneAndUpdate({
            _id: ObjectID(reqObj._id)
        }, requestedData, {
            new: true
        });

        if (updatedData) {
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
            let allRecords = await PurchaseOrderSchema.aggregate([
                { $match: filterRequest },
                {
                    $facet: {
                        data: [

                            {
                                "$project": {
                                    "po_number": 1,
                                    "date": 1,
                                    "due_date": 1,
                                    "title": 1,
                                    "site": 1,
                                    "local_purchase": 1,
                                    "items": 1,
                                    "status": 1,
                                    "remarks": 1,
                                    "billing_address": 1,
                                    "delivery_address": 1,
                                    "vendors_total": 1,
                                    "status": 1,
                                    "updated_by": 1,
                                    "created_by": 1,
                                    "created_at": 1,
                                    "updated_at": 1
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
            let allRecords = await PurchaseOrderSchema.aggregate([
                { $match: filterRequest },
                {
                    "$project": {
                        "po_number": 1,
                        "date": 1,
                        "due_date": 1,
                        "title": 1,
                        "site": 1,
                        "local_purchase": 1,
                        "items": 1,
                        "status": 1,
                        "remarks": 1,
                        "billing_address": 1,
                        "delivery_address": 1,
                        "vendors_total": 1,
                        "status": 1,
                        "updated_by": 1,
                        "created_by": 1,
                        "created_at": 1,
                        "updated_at": 1
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



        // let recordDetail = await PurchaseOrderSchema.aggregate([
        //     {
        //         $match: {
        //             _id: ObjectID(_id),
        //         }
        //     },
        //     {
        //         $unwind: "$items"
        //     },

        //     {
        //         $lookup: {
        //             from: 'items',
        //             localField: 'items.item_id',
        //             foreignField: '_id',
        //             as: 'items.itemDetail',
        //         },
        //     },

        //     {
        //         "$project": {
        //             "po_number": 1,
        //             "date": 1,
        //             "due_date": 1,
        //             "vendor_detail": 1,
        //             "title": 1,
        //             "site": 1,
        //             "local_purchase": 1,
        //             "items": 1,
        //             "status": 1,
        //             "remarks": 1,
        //             "billing_address": 1,
        //             "delivery_address": 1,
        //             "vendors_total": 1,
        //             "status": 1,
        //             "updated_by": 1,
        //             "created_by": 1,
        //             "created_at": 1,
        //             "updated_at": 1
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'categories',
        //             localField: 'itemDetail.category',
        //             foreignField: '_id',
        //             as: 'items.categoryDetail',
        //         },
        //     },
        //     {
        //         $lookup: {
        //             from: 'sub_categories',
        //             localField: 'itemDetail.sub_category',
        //             foreignField: '_id',
        //             as: 'items.subCategoryDetail',
        //         },
        //     },
        //     {
        //         $lookup: {
        //             from: 'uoms',
        //             localField: 'itemDetail.uom',
        //             foreignField: '_id',
        //             as: 'items.uomDetail',
        //         },
        //     },

        //     {
        //         "$project": {
        //             "po_number": 1,
        //             "date": 1,
        //             "due_date": 1,
        //             "vendor_detail": 1,
        //             "title": 1,
        //             "site": 1,
        //             "local_purchase": 1,
        //             "status": 1,
        //             "remarks": 1,
        //             "billing_address": 1,
        //             "delivery_address": 1,
        //             "vendors_total": 1,
        //             "status": 1,
        //             "updated_by": 1,
        //             "created_by": 1,
        //             "created_at": 1,
        //             "updated_at": 1,
        //             "items.qty": "$items.qty",
        //             "items.item_name": "$items.item_name",
        //             "items.brand": "$items.brand",
        //             "items.tax": "$items.tax",
        //             "items.vendors": "$items.vendors",
        //             "items.attachment": "$items.attachment",
        //             "items.remark": "$items.remark",
        //             "items._id": "$items._id",
        //             "items.item_id": "$items.item_id",
        //             "items.item_name": "$itemDetail.item_name",
        //             "items.categoryDetail": { "$arrayElemAt": ["$items.categoryDetail", 0] },
        //             "items.subCategoryDetail": { "$arrayElemAt": ["$items.subCategoryDetail", 0] },
        //             "items.uomDetail": { "$arrayElemAt": ["$items.uomDetail", 0] }
        //         }
        //     },
        //     {
        //         "$project": {
        //             "po_number": 1,
        //             "date": 1,
        //             "due_date": 1,
        //             "vendor_detail": 1,
        //             "title": 1,
        //             "site": 1,
        //             "local_purchase": 1,
        //             "status": 1,
        //             "remarks": 1,
        //             "billing_address": 1,
        //             "delivery_address": 1,
        //             "vendors_total": 1,
        //             "status": 1,
        //             "updated_by": 1,
        //             "created_by": 1,
        //             "created_at": 1,
        //             "updated_at": 1,
        //             "items.qty": "$items.qty",
        //             "items.tax": "$items.tax",
        //             "items.item_name": "$items.item_name",
        //             "items.brand": "$items.brand",
        //             "items.vendors": "$items.vendors",
        //             "items.attachment": "$items.attachment",
        //             "items.remark": "$items.remark",
        //             "items._id": "$items._id",
        //             "items.item_id": "$items.item_id",
        //             "items.item_name": "$items.item_name",
        //             "items.categoryDetail._id": 1,
        //             "items.categoryDetail.name": 1,
        //             "items.categoryDetail.code": 1,
        //             "items.subCategoryDetail._id": 1,
        //             "items.subCategoryDetail.subcategory_name": 1,
        //             "items.uomDetail._id": 1,
        //             "items.uomDetail.uom_name": 1,
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: '$_id',
        //             po_number: { $first: '$po_number' },
        //             date: { $first: '$date' },
        //             due_date: { $first: '$due_date' },
        //             site: { $first: '$site' },
        //             local_purchase: { $first: '$local_purchase' },
        //             title: { $first: '$title' },
        //             vendors_total: { $first: '$vendors_total' },
        //             vendor_detail: { $first: '$vendor_detail' },
        //             billing_address: { $first: '$billing_address' },
        //             delivery_address: { $first: '$delivery_address' },
        //             status: { $first: '$status' },
        //             remarks: { $first: '$remarks' },
        //             updated_by: { $first: '$updated_by' },
        //             created_by: { $first: '$created_by' },
        //             created_at: { $first: '$created_at' },
        //             updated_at: { $first: '$updated_at' },
        //             items: { $push: '$items' },
        //         }
        //     }
        // ]);

        let recordDetail = await PurchaseOrderSchema.find( {_id: ObjectID(_id)});
        if (recordDetail && recordDetail.length > 0) {
            res.status(200).json(await Response.success(recordDetail[0], responseMessage(reqObj.langCode, 'SUCCESS')));
        } else {
            res.status(422).json(await Response.success({}, responseMessage(reqObj.langCode, 'NO_RECORD_FOUND'), req));
        }

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
        let record = await PurchaseOrderSchema.findOneAndDelete({ company_id: company_id, _id: ObjectID(_id) });

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




async function getInvetoryList(req, res) {

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

        if (page > 0) {
            let allRecords = await PurchaseOrderSchema.aggregate([
                {
                    $facet: {
                        data: [

                            { $unwind: "$items" },
                            {
                                $group: {
                                    _id: "$items.item_id",
                                    item_name: { "$first": "$items.item_name" },
                                    item_count: { "$sum": 1 },
                                    uom: { "$first": "$items.uom" },
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
            let allRecords = await PurchaseOrderSchema.aggregate([
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.item_id",
                        item_name: { "$first": "$items.item_name" },
                        item_count: { "$sum": 1 },
                        uom: { "$first": "$items.uom" },
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