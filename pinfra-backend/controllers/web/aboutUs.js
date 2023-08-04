const AboutUs = require('../../models/AboutUs');
const RecentActivity = require('../../models/recentActivity');
const Response = require('../../libs/response')

module.exports = {
    createData,
    updateData,
    getList,
    getDetails
}



async function createData(req, res) {

    try {

        let reqObj = req.body;

        let aboutUs = new AboutUs({
            description: reqObj.about
        });
        aboutUs = await aboutUs.save()
        if (!aboutUs) return res.send('aboutUs not created')

        let recentActivity = new RecentActivity({

            //activity:project.projectName,
            description: `about us information updated`

        });

        recentActivity = await recentActivity.save()

        res.send(aboutUs);

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

        let { id } = req.params;
        let reqObj = req.body;

        const about = await AboutUs.findByIdAndUpdate(id, {


            description: reqObj.about,


        }, { new: true });

        let recentActivity = new RecentActivity({

            //activity:project.projectName,
            description: `about us information updated`
        });
        recentActivity = await recentActivity.save()
        res.send(about)

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
        const aboutUs = await AboutUs.find({})
        res.send(aboutUs)

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

        let reqObj = req.params;

        const aboutUs = await AboutUs.findById(reqObj.id)

        if (!aboutUs) return res.send('no aboutUs exits')

        res.send(aboutUs)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}


