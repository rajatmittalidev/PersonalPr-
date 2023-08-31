const ProjectActivityDataSchema = require('../../models/ProjectActivityData')
const Response = require('../../libs/response')
const { responseMessage } = require("../../libs/responseMessages");
const { updateTotalCumulativeQuantity,checkTotalQuantityValidation,updateActivityLog } = require("./utilityController");
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
module.exports = {
    createData,
    updateData,
    deleteData,
    getDetails,
    getList,
    getRemarks
}

async function createData(req, res) {

    try {

        let reqObj = req.body;
        reqObj.created_by = reqObj.login_user_id;
        reqObj.updated_by = reqObj.login_user_id;


        if (!(reqObj.project_id && reqObj.activity_id && reqObj.activity_ref_id && reqObj.structure_id && reqObj.structure_ref_id && reqObj.location_id && reqObj.location_ref_id && reqObj.date)) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'SOMETHING_WRONG'),
                statusCode: 412
            }
        }


      


        let startDateFormat = moment(`${reqObj.date} 00:00:00`, "YYYY-MM-DD HH:mm:ss").toDate();
        let endDateFormat = moment(`${reqObj.date} 23:59:59`, "YYYY-MM-DD HH:mm:ss").toDate();

        let detailRequestData = {
            project_id: ObjectID(reqObj.project_id),
            activity_id: ObjectID(reqObj.activity_id),
            activity_ref_id: ObjectID(reqObj.activity_ref_id),
            structure_id: ObjectID(reqObj.structure_id),
            structure_ref_id: ObjectID(reqObj.structure_ref_id),
            location_id: ObjectID(reqObj.location_id),
            location_ref_id: ObjectID(reqObj.location_ref_id),           
        }

        let getDetail = await ProjectActivityDataSchema.findOne({
            ...detailRequestData,
            date: {
                $gte: startDateFormat,
                $lt: endDateFormat
            }
        });






        if (getDetail) {
            let updatRequestData = { updated_by: reqObj.updated_by };

            if (reqObj.daily_quantity) {

                let checkQuantity = await checkTotalQuantityValidation(getDetail, reqObj.daily_quantity);

                updatRequestData['daily_quantity'] = reqObj.daily_quantity;
            }

            if (reqObj.remark) {
                updatRequestData['remark'] = reqObj.remark;
            }

            let updatedData = await ProjectActivityDataSchema.findOneAndUpdate({
                _id: ObjectID(getDetail._id)
            }, updatRequestData, {
                new: true
            });

            await updateTotalCumulativeQuantity(updatedData);

            res.status(200).json(await Response.success({type:'update', data:updatedData}, responseMessage(reqObj.langCode, 'RECORD_UPDATED'), req));

        } else {

            let checkQuantity = await checkTotalQuantityValidation(detailRequestData, reqObj.daily_quantity);

            let newData = await new ProjectActivityDataSchema(reqObj).save();       

            if (newData) {
                await updateTotalCumulativeQuantity(newData);
                res.status(200).json(await Response.success({type:'add', data:newData}, responseMessage(reqObj.langCode, 'RECORD_CREATED'), req));
            } else {
                throw {
                    errors: [],
                    message: responseMessage(reqObj.langCode, 'SOMETHING_WRONG'),
                    statusCode: 412
                }
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

        let updatedData = await ProjectActivityDataSchema.findOneAndUpdate({
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

        let getData = await ProjectActivityDataSchema.findOne({ "_id": ObjectID(_id) });

        if (!getData) {
            throw {
                errors: [],
                message: responseMessage(loginData.langCode, 'NO_RECORD_FOUND'),
                statusCode: 412
            }
        }

        const dataRemoved = await ProjectActivityDataSchema.deleteOne({ "_id": ObjectID(_id) });

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
        let { _id, project_id } = req.query;

        if (!_id || !project_id) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'ID_MISSING'),
                statusCode: 412
            }
        }

        let requestedData = {};
        if (project_id) {
            requestedData['project_id'] = ObjectID(project_id)
        }

        if (_id) {
            requestedData['_id'] = ObjectID(_id)
        }

        const recordDetail = await ProjectActivityDataSchema.findOne(requestedData);

        if (recordDetail) {
            res.status(200).json(await Response.success(recordDetail, responseMessage(reqObj.langCode, 'SUCCESS')));
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

        let { page, per_page, sort_by, sort_order, project_id } = req.query;
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

            let allRecords = await ProjectActivityDataSchema.aggregate([
                {
                    $facet: {
                        data: [

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
            let requestedData = {};
            if (project_id) {
                requestedData['project_id'] = ObjectID(project_id)
            }

            let allRecords = await ProjectActivityDataSchema.find(requestedData).lean();
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

async function getRemarks(req, res) {

    try {
        let { activity_id } = req.query;
        let allRecords = await ProjectActivityDataSchema.find({ activity_ref_id: activity_id });
        res.status(200).json(await Response.success(allRecords, responseMessage(req.body.langCode, 'SUCCESS'), req));




    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}