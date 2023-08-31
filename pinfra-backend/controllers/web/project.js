const Project = require('../../models/Project')
const Task = require('../../models/Task')
const SubTask = require('../../models/SubTask')

const mongoose = require('mongoose')
const Response = require('../../libs/response')
const ObjectId = mongoose.Types.ObjectId;
const { responseMessage } = require("../../libs/responseMessages");
const { updateActivityLog } = require("./utilityController");

module.exports = {
    getList,
    createData,
    updateData,
    getDetails,
    deleteById,
    updateMoreActivityData,
    postDataById,
    getListById,
    updateProject,
    updateProjectById,
    updateMenberById
}

async function getList(req, res) {

    try {
        const projects = await Project.find()
        res.send(projects)

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

        const project = await Project.findById(req.params.id);
        if (!project) return res.send('no project exits');
        res.send(project);

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

        let project = new Project({

            projectName: req.body.projectName,
            projectDate: req.body.projectDate,
            location: req.body.location,
            members: req.body.members,
            r0Date: req.body.r0Date,
            r1Date: req.body.r1Date,
            r2Date: req.body.r2Date,
            imageUrl: req.body.imageUrl,
            locations:req.body.locations
        });
        project = await project.save()

        await updateActivityLog(`${project.projectName} project created`);      

        res.send(project);

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function updateMoreActivityData(req, res) {

    try {
        let sections = req.body.sections
        let mapped = sections.map(ele => {
            return { taskName: ele.taskName, subTaskName: ele.subTaskName, projectId: req.params.id }
        })

        let subTasks = await SubTask.insertMany(mapped)

        res.send(subTasks);

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
        console.log('reqObj', reqObj)
        let loginUserId = reqObj.login_user_id;


        if (!reqObj._id) {
            throw {
                errors: [],
                message: responseMessage(reqObj.langCode, 'ID_MISSING'),
                statusCode: 412
            }
        }

        let requestedData = { ...reqObj, ...{ updated_by: loginUserId } };

        let updatedData = await Project.findOneAndUpdate({
            _id: ObjectId(reqObj._id)
        }, requestedData, {
            new: true
        });

        if (updatedData) {

            await updateActivityLog(`${updatedData.projectName} project updated`); 


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



// Still working here 

async function postDataById(req, res) {
    try {
        let sections = req.body
        let mapped = sections.map(ele => {
            return { taskId: ele.taskId, taskName: ele.taskName, projectId: req.params.id }
        })
        let gg = []
        allTasks = await Task.find()
        for (let single of allTasks) {
            for (let one of mapped) {
                if (single.taskId !== one.taskId) {
                    gg.push(one)
                }
            }
        }
        const uniqueIds = [];

        const unique = gg.filter(element => {
            const isDuplicate = uniqueIds.includes(element.taskId);

            if (!isDuplicate) {
                uniqueIds.push(element.taskId);

                return true;
            }

            return false;
        });
        let tasks = await Task.insertMany(unique)
        res.send(tasks);
        
    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function updateProject(req, res) {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, {

            projectName: req.body.projectName,
            projectDate: req.body.projectDate,
            location: req.body.location,
            members: req.body.members,
            r0Date: req.body.r0Date,
            r1Date: req.body.r1Date,
            r2Date: req.body.r2Date,
            imageUrl: req.body.imageUrl

        }, { new: true });

        if (!project) return res.send('project not updated')

        await updateActivityLog(`${req.body.projectName} project updated`); 

        res.send(project)
    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }

}


async function updateProjectById(req, res) {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, {

            projectName: req.body.projectName,
            location: req.body.location,
            startDate: req.body.startDate,
            endDate: req.body.endDate

        }, { new: true });

        if (!project) return res.send('project not updated')

        res.send(project)
    }
    catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function updateMenberById(req, res) {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, {

            members: req.body.members,


        }, { new: true });

        if (!project) return res.send('project not updated')

        let newMember = req.body.members.slice(-1)[0]

        await updateActivityLog(`new member ${newMember} added to ${project.projectName} project`);  

        res.send(project)
    }
    catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}

async function deleteById(req, res) {
    try {
        const project = await Project.findByIdAndRemove(req.params.id)

        if (!project) return res.send('project not deleted')

        res.send(project)
    }
    catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


async function getListById(req, res) {
    try {
        const task = await Project.aggregate([
            { $project: { projectName: 1 } },
            { "$addFields": { "projectId": { "$toString": "$_id" } } },
            {
                $lookup:
                {
                    from: "tasks",
                    localField: "projectId",
                    foreignField: "projectId",
                    as: "result"
                }
            },
            {
                $lookup:
                {
                    from: "subtasks",
                    localField: "result.taskName",
                    foreignField: "taskName",
                    as: "subtasksData"
                }
            },           
            {
                $match: { _id: ObjectId('63970d336ec0b89a7afcb987') }
            }
        ])

        if (!task) return res.send('no task exits')

        res.send(task)
    }
    catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


