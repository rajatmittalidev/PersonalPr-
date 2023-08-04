
const SubCategorySchema = require('../../models/SubCategory')
const Response = require('../../libs/response')
const { responseMessage } = require("../../libs/responseMessages");
const ObjectID = require('mongodb').ObjectID;



module.exports = {
    createData,
    updateData,
    deleteData,
    getDetails,
    getList
}

async function createData(req, res) {

    try {

        let reqObj = req.body;
        reqObj.created_by = reqObj.login_user_id;
        reqObj.updated_by = reqObj.login_user_id;

        let newData = await new SubCategorySchema(reqObj).save();

        if (newData) {
            res.status(200).json(await Response.success(newData, responseMessage(reqObj.langCode, 'RECORD_CREATED'), req));
        } else {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'SOMETHING_WRONG'),
                statusCode: 412
            }
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

        let updatedData = await SubCategorySchema.findOneAndUpdate({
            _id: ObjectID(reqObj._id)
        }, requestedData, {
            new: true
        });

        if (updatedData) {
            res.status(200).json(await Response.success(updatedData, responseMessage(reqObj.langCode, 'RECORD_UPDATED'), req));
        }
        else {
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

        let getData = await SubCategorySchema.findOne({ "_id": ObjectID(_id) });

        if (!getData) {
            throw {
                errors: [],
                message: responseMessage(loginData.langCode, 'NO_RECORD_FOUND'),
                statusCode: 412
            }
        }

        const dataRemoved = await SubCategorySchema.deleteOne({ "_id": ObjectID(_id) });

        res.status(200).json(await Response.success({}, responseMessage(reqObj.langCode, 'RECORD_DELETED'), req));

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

        let recordDetail = await SubCategorySchema.aggregate([
            { $match: { _id: ObjectID(_id) } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDetail',
                },
            },
            {
                "$project": {
                    "subcategory_name": 1,
                    "category": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "created_by": 1,
                    "updated_by": 1,
                    "categoryDetail": { "$arrayElemAt": ["$categoryDetail", 0] }
                }
            },
            {
                "$project": {
                    "subcategory_name": 1,
                    "category": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "created_by": 1,
                    "updated_by": 1,
                    "categoryDetail._id": 1,
                    "categoryDetail.name": 1,
                    "categoryDetail.code": 1
                }
            }

        ]);


        if (recordDetail && recordDetail.length > 0) {
            res.status(200).json(await Response.success(recordDetail[0], responseMessage(reqObj.langCode, 'SUCCESS')));
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


async function getList(req, res) {

    try {
        let reqObj = req.body;

        let { page, per_page, sort_by, sort_order } = req.query;
        let pageData = Response.validationPagination(page, per_page);

        if (page > 0) {

            let sort = {
                '_id': -1
            }
            if (sort_by) {
                let order = (sort_order == 'desc') ? -1 : 1;
                sort = {
                    [sort_by]: order
                }
            }

            let allRecords = await SubCategorySchema.aggregate([
                {
                    $facet: {
                        data: [
                            {
                                $lookup: {
                                    from: 'categories',
                                    localField: 'category',
                                    foreignField: '_id',
                                    as: 'categoryDetail',
                                },
                            },
                            {
                                "$project": {
                                    "subcategory_name": 1,
                                    "category": 1,
                                    "created_at": 1,
                                    "updated_at": 1,
                                    "created_by": 1,
                                    "updated_by": 1,
                                    "categoryDetail": { "$arrayElemAt": ["$categoryDetail", 0] }
                                }
                            },
                            {
                                "$project": {
                                    "subcategory_name": 1,
                                    "category": 1,
                                    "created_at": 1,
                                    "updated_at": 1,
                                    "created_by": 1,
                                    "updated_by": 1,
                                    "categoryDetail._id": 1,
                                    "categoryDetail.name": 1,
                                    "categoryDetail.code": 1
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
            let allRecords = await SubCategorySchema.aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryDetail',
                    },
                },
                {
                    "$project": {
                        "subcategory_name": 1,
                        "category": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "created_by": 1,
                        "updated_by": 1,
                        "categoryDetail": { "$arrayElemAt": ["$categoryDetail", 0] }
                    }
                },
                {
                    "$project": {
                        "subcategory_name": 1,
                        "category": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "created_by": 1,
                        "updated_by": 1,
                        "categoryDetail._id": 1,
                        "categoryDetail.name": 1,
                        "categoryDetail.code": 1
                    }
                },
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