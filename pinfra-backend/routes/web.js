const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const middleware = require('../middleware');
const controllerObj = {};

fs.readdirSync(path.resolve('./controllers/web')).forEach(file => {
  let name = file.substr(0, file.indexOf('.'));
  controllerObj[name] = require(path.resolve(`./controllers/web/${name}`));
});

router.get('/aboutUs', middleware.jwtVerify, controllerObj.aboutUs.getList);
router.get('/aboutUs/:id', middleware.jwtVerify, controllerObj.aboutUs.getDetails);
router.put('/aboutUs/:id', middleware.jwtVerify, controllerObj.aboutUs.updateData);
router.post('/aboutUs', middleware.jwtVerify, controllerObj.aboutUs.createData);


// Line Graph Routes 

router.get('/lineGraph', middleware.jwtVerify, controllerObj.lineGraph.getList);
router.get('/lineGraph/:id', middleware.jwtVerify, controllerObj.lineGraph.getDetails);
router.post('/lineGraph/date-filter', middleware.jwtVerify, controllerObj.lineGraph.createData);

//  Master Sub Task Routes
router.get('/masterSubTasks', middleware.jwtVerify, controllerObj.masterSubTask.getList);
router.get('/masterSubTasks/:id', middleware.jwtVerify, controllerObj.masterSubTask.getDetails);
router.put('/masterSubTasks/:id', middleware.jwtVerify, controllerObj.masterSubTask.updateData);
router.post('/masterSubTasks', middleware.jwtVerify, controllerObj.masterSubTask.createData);
router.delete('/masterSubTasks/:id', middleware.jwtVerify, controllerObj.masterSubTask.deleteById);
router.delete('/masterSubTasks', middleware.jwtVerify, controllerObj.masterSubTask.deleteDetails);

//  Master Task Routes
router.get('/masterTasks/all-tasks', middleware.jwtVerify, controllerObj.masterTask.getList);
router.get('/masterTasks/:id', middleware.jwtVerify, controllerObj.masterTask.getDetails);
router.put('/masterTasks/:id', middleware.jwtVerify, controllerObj.masterTask.updateData);
router.post('/masterTasks', middleware.jwtVerify, controllerObj.masterTask.createData);
router.delete('/masterTasks/:id', middleware.jwtVerify, controllerObj.masterTask.deleteById);
router.delete('/masterTasks', middleware.jwtVerify, controllerObj.masterTask.deleteDetails);



// Permission Routes
router.get('/permissions', middleware.jwtVerify, controllerObj.permission.getList);
router.get('/permissions/:id', middleware.jwtVerify, controllerObj.permission.getDetails);
router.put('/permissions/:id', middleware.jwtVerify, controllerObj.permission.updateData);
router.post('/permissions', middleware.jwtVerify, controllerObj.permission.createData);
router.delete('/permissions/:id', middleware.jwtVerify, controllerObj.permission.deleteById);

// Project Routes
router.get('/projects', middleware.jwtVerify, controllerObj.project.getList);
router.get('/projects/:id', middleware.jwtVerify, controllerObj.project.getDetails);
router.post('/projects', middleware.jwtVerify, controllerObj.project.createData);
router.put('/projects/updateMoreActivities/:id', middleware.jwtVerify, controllerObj.project.updateMoreActivityData);
router.post('/projects/:id', middleware.jwtVerify, controllerObj.project.postDataById);
router.put('/projects/update-project/:id', middleware.jwtVerify, controllerObj.project.updateProject);
router.put('/projects', middleware.jwtVerify, controllerObj.project.updateData);
router.put('/projects/members/:id', middleware.jwtVerify, controllerObj.project.updateMenberById);
router.delete('/projects/:id', middleware.jwtVerify, controllerObj.project.deleteById);
router.delete('/projects/List/:id', middleware.jwtVerify, controllerObj.project.getListById);





// Recent Activity Routes
router.get('/recentActivity', middleware.jwtVerify, controllerObj.recentActivity.getList);

// Role Routes

router.get('/roles', middleware.jwtVerify, controllerObj.role.getList);
router.get('/roles/:id', middleware.jwtVerify, controllerObj.role.getDataByID);
router.get('/roles/role/:role', middleware.jwtVerify, controllerObj.role.getDataByRole);
router.put('/roles/:id', middleware.jwtVerify, controllerObj.role.updateData);
router.put('/roles/update-perm/:role', middleware.jwtVerify, controllerObj.role.updatePermData);
router.post('/roles', middleware.jwtVerify, controllerObj.role.createData);
router.delete('/roles/:id', middleware.jwtVerify, controllerObj.role.deleteData);
router.delete('/roles', middleware.jwtVerify, controllerObj.role.deleteList);


// Task Routes
router.get('/tasks', middleware.jwtVerify, controllerObj.task.getList);
router.get('/tasks/:id', middleware.jwtVerify, controllerObj.task.getDataByID);
router.put('/tasks/:id', middleware.jwtVerify, controllerObj.task.updateData);
router.post('/tasks', middleware.jwtVerify, controllerObj.task.createData);
router.delete('/tasks/:id', middleware.jwtVerify, controllerObj.task.deleteData);
router.get('/tasks/tasksList/:id', middleware.jwtVerify, controllerObj.task.getTasksListData);


// User Routes
router.get('/users', middleware.jwtVerify, controllerObj.user.getList);
router.get('/users/:id', middleware.jwtVerify, controllerObj.user.getDataByID);
router.put('/users/:id', middleware.jwtVerify, controllerObj.user.updateData);
router.post('/users', middleware.jwtVerify, controllerObj.user.createData);
router.delete('/users/:id', middleware.jwtVerify, controllerObj.user.deleteData);
router.delete('/users', middleware.jwtVerify, controllerObj.user.deleteAllData);
router.post('/users/register', controllerObj.user.createUser);
router.post('/users/login', controllerObj.user.loginUser);

// Subtask Routes
router.get('/subTasks', middleware.jwtVerify, controllerObj.subTask.getList);
router.get('/subTasks/activities/:id', middleware.jwtVerify, controllerObj.subTask.getActivitesDataByID);
router.get('/subTasks/:id', middleware.jwtVerify, controllerObj.subTask.getDataByID);
router.post('/subTasks', middleware.jwtVerify, controllerObj.subTask.createData);
router.put('/subTasks/:id', middleware.jwtVerify, controllerObj.subTask.updateData);
router.put('/subTasks/dailyTotalUpdate/:id', middleware.jwtVerify, controllerObj.subTask.updatedailyTotalUpdateData);
router.put('/subTasks/dailyTotalUpdate/update/:id', middleware.jwtVerify, controllerObj.subTask.TotalUpdateData);
router.put('/subTasks/remarkUpdate/:id', middleware.jwtVerify, controllerObj.subTask.remarkUpdateData);
router.put('/subTasks/remarks/:id', middleware.jwtVerify, controllerObj.subTask.updateRemarkData);
router.delete('/subTasks/:id', middleware.jwtVerify, controllerObj.subTask.deleteData);
router.delete('/subTasks/deleteMany', middleware.jwtVerify, controllerObj.subTask.deleteManyData);




// Category Routes
router.get('/category', middleware.jwtVerify, controllerObj.category.getList);
router.get('/category/detail', middleware.jwtVerify, controllerObj.category.getDetails);
router.put('/category', middleware.jwtVerify, controllerObj.category.updateData);
router.post('/category', middleware.jwtVerify, controllerObj.category.createData);
router.delete('/category', middleware.jwtVerify, controllerObj.category.deleteData);

// Sub Category Routes
router.get('/subcategory', middleware.jwtVerify, controllerObj.subCategory.getList);
router.get('/subcategory/detail', middleware.jwtVerify, controllerObj.subCategory.getDetails);
router.put('/subcategory', middleware.jwtVerify, controllerObj.subCategory.updateData);
router.post('/subcategory', middleware.jwtVerify, controllerObj.subCategory.createData);
router.delete('/subcategory', middleware.jwtVerify, controllerObj.subCategory.deleteData);


// Site Routes
router.get('/site', middleware.jwtVerify, controllerObj.site.getList);
router.get('/site/detail', middleware.jwtVerify, controllerObj.site.getDetails);
router.put('/site', middleware.jwtVerify, controllerObj.site.updateData);
router.post('/site', middleware.jwtVerify, controllerObj.site.createData);
router.delete('/site', middleware.jwtVerify, controllerObj.site.deleteData);


// Organisation Routes
router.get('/organisation', middleware.jwtVerify, controllerObj.organisation.getList);
router.get('/organisation/detail', middleware.jwtVerify, controllerObj.organisation.getDetails);
router.put('/organisation', middleware.jwtVerify, controllerObj.organisation.updateData);
router.post('/organisation', middleware.jwtVerify, controllerObj.organisation.createData);
router.delete('/organisation', middleware.jwtVerify, controllerObj.organisation.deleteData);

// GST Routes
router.get('/gst', middleware.jwtVerify, controllerObj.gst.getList);
router.get('/gst/detail', middleware.jwtVerify, controllerObj.gst.getDetails);
router.put('/gst', middleware.jwtVerify, controllerObj.gst.updateData);
router.post('/gst', middleware.jwtVerify, controllerObj.gst.createData);
router.delete('/gst', middleware.jwtVerify, controllerObj.gst.deleteData);


// Vendor Routes
router.get('/vendor', middleware.jwtVerify, controllerObj.vendor.getList);
router.get('/vendor/detail', middleware.jwtVerify, controllerObj.vendor.getDetails);
router.put('/vendor', middleware.jwtVerify, controllerObj.vendor.updateData);
router.post('/vendor', middleware.jwtVerify, controllerObj.vendor.createData);
router.delete('/vendor', middleware.jwtVerify, controllerObj.vendor.deleteData);

// Uom Routes
router.get('/uom', middleware.jwtVerify, controllerObj.uom.getList);
router.get('/uom/detail', middleware.jwtVerify, controllerObj.uom.getDetails);
router.put('/uom', middleware.jwtVerify, controllerObj.uom.updateData);
router.post('/uom', middleware.jwtVerify, controllerObj.uom.createData);
router.delete('/uom', middleware.jwtVerify, controllerObj.uom.deleteData);


// Item Routes
router.get('/item', middleware.jwtVerify, controllerObj.item.getList);
router.get('/item/detail', middleware.jwtVerify, controllerObj.item.getDetails);
router.put('/item', middleware.jwtVerify, controllerObj.item.updateData);
router.post('/item', middleware.jwtVerify, controllerObj.item.createData);
router.delete('/item', middleware.jwtVerify, controllerObj.item.deleteData);

// Location Routes
router.get('/location', middleware.jwtVerify, controllerObj.location.getList);
router.get('/location/detail', middleware.jwtVerify, controllerObj.location.getDetails);
router.put('/location', middleware.jwtVerify, controllerObj.location.updateData);
router.post('/location', middleware.jwtVerify, controllerObj.location.createData);
router.delete('/location', middleware.jwtVerify, controllerObj.location.deleteData);

// Structure Routes
router.get('/structure', middleware.jwtVerify, controllerObj.structure.getList);
router.get('/structure/detail', middleware.jwtVerify, controllerObj.structure.getDetails);
router.put('/structure', middleware.jwtVerify, controllerObj.structure.updateData);
router.post('/structure', middleware.jwtVerify, controllerObj.structure.createData);

router.delete('/structure', middleware.jwtVerify, controllerObj.structure.deleteData);

// Activity Routes
router.get('/activity', middleware.jwtVerify, controllerObj.activity.getList);
router.get('/activity/detail', middleware.jwtVerify, controllerObj.activity.getDetails);
router.put('/activity', middleware.jwtVerify, controllerObj.activity.updateData);
router.post('/activity', middleware.jwtVerify, controllerObj.activity.createData);

router.delete('/activity', middleware.jwtVerify, controllerObj.activity.deleteData);



// PR Routes
router.get('/purchase-request', middleware.jwtVerify, controllerObj.purchaseRequest.getList);
router.get('/purchase-request/detail', middleware.jwtVerify, controllerObj.purchaseRequest.getDetails);
router.put('/purchase-request', middleware.jwtVerify, controllerObj.purchaseRequest.updateData);
router.post('/purchase-request', middleware.jwtVerify, controllerObj.purchaseRequest.createData);
router.delete('/purchase-request', middleware.jwtVerify, controllerObj.purchaseRequest.deleteData);

// Rate Approval Routes
router.get('/rate-approval', middleware.jwtVerify, controllerObj.rateApproval.getList);
router.get('/rate-approval/detail', middleware.jwtVerify, controllerObj.rateApproval.getDetails);
router.put('/rate-approval', middleware.jwtVerify, controllerObj.rateApproval.updateData);
router.delete('/rate-approval', middleware.jwtVerify, controllerObj.rateApproval.deleteData);



// Organisation Routes
router.get('/project/activity_data', middleware.jwtVerify, controllerObj.projectActivityData.getList);
router.get('/project/activity_data/remarks', middleware.jwtVerify, controllerObj.projectActivityData.getRemarks);
router.get('/project/activity_data/detail', middleware.jwtVerify, controllerObj.projectActivityData.getDetails);
router.put('/project/activity_data', middleware.jwtVerify, controllerObj.projectActivityData.updateData);
router.post('/project/activity_data', middleware.jwtVerify, controllerObj.projectActivityData.createData);
router.delete('/project/activity_data', middleware.jwtVerify, controllerObj.projectActivityData.deleteData);


// PO Routes
router.get('/purchase_order', middleware.jwtVerify, controllerObj.purchaseOrder.getList);

router.get('/purchase_order/detail', middleware.jwtVerify, controllerObj.purchaseOrder.getDetails);
router.put('/purchase_order', middleware.jwtVerify, controllerObj.purchaseOrder.updateData);
router.delete('/purchase_order', middleware.jwtVerify, controllerObj.purchaseOrder.deleteData);

// Upload file
router.post('/upload_file', middleware.jwtVerify, controllerObj.uploadImage.upload);

// inventory
router.get('/inventory', middleware.jwtVerify, controllerObj.purchaseOrder.getInvetoryList);




module.exports = router;