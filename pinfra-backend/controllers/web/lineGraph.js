
const LineGraph = require('../../models/LineGraph')
const Response = require('../../libs/response')

module.exports = {
    createData,
    getList,
    getDetails,
}

async function createData(req, res) {

    try {

        const lineGraph = await LineGraph.find(
            {
                $and: [
                    {
                        date: {
                            $lte: new Date(req.body.date)
                        }
                    },
                    { projectId: req.body.projectId }
                ]
            }
        )
        if (!lineGraph) return res.send('no lineGraph exits')

        let recentActivity = new RecentActivity({
            description: `item information updated`
        });
        recentActivity = await recentActivity.save();
        res.send(lineGraph)

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
        const lineGraph = await LineGraph.find()
        res.send(lineGraph)

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
        const lineGraph = await LineGraph.find({ projectId: req.params.id })
        if (!lineGraph) return res.send('no lineGraph exits')
        res.send(lineGraph)

    } catch (error) {
        return res.status(error.statusCode || 422).json(
            await Response.errors({
                errors: error.errors,
                message: error.message
            }, error, req)
        );

    }
}





