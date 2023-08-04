
const SubTask = require('../../models/SubTask')
const RecentActivity = require('../../models/recentActivity')
const LineGraph = require('../../models/LineGraph')
const Response = require('../../libs/response')

module.exports = {
    getList,
    getDataByID,
    getActivitesDataByID,
    createData,
    updateData,
    deleteData,
    deleteManyData,
    updatedailyTotalUpdateData,
    TotalUpdateData,
    remarkUpdateData,
    updateRemarkData
}

async function getList(req, res) {

    try {
        const subTasks = await SubTask.find()
        res.send(subTasks)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function getDataByID(req, res) {
    try {

        const subTask = await SubTask.findById(req.params.id)

        if (!subTask) return res.send('no subTask exits')

        res.send(subTask)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function getActivitesDataByID(req, res) {
    try {

        const subTasks = await SubTask.find({ projectId: req.params.id })
        res.send(subTasks)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}



async function createData(req, res) {

    try {
        let subTask = new SubTask({

            // projectName:req.body.projectName,
            // location:req.body.location,
            // startDate:req.body.startDate,
            // endDate:req.body.endDate

        });

        subTask = await subTask.save()

        if (!subTask) return res.send('project not created')

        res.send(subTask);

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
        const subTask = await SubTask.findByIdAndUpdate(req.params.id, {
            addRevisesDates: req.body.addRevisesDates,
            actualRevisedStartDate: req.body.actualRevisedStartDate,
            workingDaysRevised: req.body.workingDaysRevised,
            baseLineStartDate: req.body.baseLineStartDate,
            baseLineEndDate: req.body.baseLineEndDate,
            baseLineWorkingDays: req.body.baseLineWorkingDays,
            uom: req.body.uom,
            total: req.body.total,
            r1EndDate: req.body.r1EndDate,
            r2EndDate: req.body.r2EndDate,
            r3EndDate: req.body.r3EndDate,
            noofDaysBalanceasperrevisedEnddate: req.body.noofDaysBalanceasperrevisedEnddate,
            dailyAskingRateasperRevisedEndDate: req.body.dailyAskingRateasperRevisedEndDate,
            noofDaysBalanceasperbaseLine: req.body.noofDaysBalanceasperbaseLine,
            dailyAskingRateasperbaseLine: req.body.dailyAskingRateasperbaseLine

        }, { new: true });

        if (!subTask) return res.send('subtask not updated')

        let recentActivity = new RecentActivity({
            description: `${subTask.subTaskName} sub activity progress sheet updated`
        });

        recentActivity = await recentActivity.save()

        res.send(subTask)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );
    }
}

async function updatedailyTotalUpdateData(req, res) {

    try {
        const record = await SubTask.findById(req.params.id)

        //console.log(record)

        if (!record) return res.send('no subTask exits')

        let totalUpdate = Number(record.dailyCumulativeTotal) + Number(req.body.cumTotal)

        //console.log(totalUpdate)

        const subTask = await SubTask.findByIdAndUpdate(req.params.id, {


            dailyCumulativeTotal: totalUpdate,
            previousValue: Number(req.body.cumTotal),
            totalDate: req.body.addedDate,
            dateStr: req.body.dateStr


        }, { new: true });


        let lineGraph = new LineGraph({

            //activity:project.projectName,
            value: Number(req.body.cumTotal),
            date: req.body.addedDate,
            projectId: req.body.projectId,
            subTaskId: req.body._id

        });

        lineGraph = await lineGraph.save()

        let recentActivity = new RecentActivity({

            //activity:project.projectName,
            description: `${subTask.subTaskName} sub activity cumulative total value updated`

        });

        recentActivity = await recentActivity.save()

        res.send(subTask)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );
    }
}


async function TotalUpdateData(req, res) {

    try {
        const record = await SubTask.findById(req.params.id)

        if (!record) return res.send('no subTask exits')

        let totalUpdate = (Number(record.dailyCumulativeTotal) - Number(record.previousValue)) + Number(req.body.cumTotal)

        const subTask = await SubTask.findByIdAndUpdate(req.params.id, {
            dailyCumulativeTotal: totalUpdate,
            previousValue: Number(req.body.cumTotal),
            totalDate: req.body.addedDate,
            dateStr: req.body.dateStr
        }, { new: true });
        let lineRecord = await LineGraph.findOneAndUpdate({ subTaskId: req.body._id, "date": new Date(req.body.addedDate) }, {
            value: Number(req.body.cumTotal),
        }, { new: true })


        res.send(subTask)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );
    }
}


async function remarkUpdateData(req, res) {

    try {
        const subTask = await SubTask.findByIdAndUpdate(req.params.id, {
            remarks: req.body.remarks,
        }, { new: true });

        if (!subTask) return res.send('subtask not updated')

        res.send(subTask)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );
    }
}

async function updateRemarkData(req, res) {

    try {
        const record = await SubTask.findById(req.params.id)
        if (!record) return res.send('no subTask exits')
        const subTask = await SubTask.findByIdAndUpdate(req.params.id, {
            remarks: req.body.remarks
        }, { new: true });
        res.send(subTask)

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
        const subTask = await SubTask.findByIdAndRemove(req.params.id)

        if (!subTask) return res.send('subTask not deleted')

        const lineDelete = await LineGraph.deleteMany({ "subTaskId": req.params.id })

        res.send(subTask)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function deleteManyData(req, res) {

    try {
        const subTask = await SubTask.deleteMany({ "taskName": req.body.name })

        if (!subTask) return res.send('subTask not deleted')

        res.send(subTask)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}



