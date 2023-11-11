//require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');
const app = express()
const awsUrl = "http://ec2-44-210-159-216.compute-1.amazonaws.com/"

app.use(express.json())

const uri = "mongodb+srv://sjalani:gSIeyS6tQWs0iUWR@xecaas-cluster0.hjct28v.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
connect();
///"proxy": "http://localhost:5000"
app.listen(5000, '0.0.0.0', () => {
  console.log("Server started on port 5000");
});

//routes
//`${awsUrl}
app.get('/filemapping', (req, res) => {
    var collection
    if(req.query.id) {
        collection = FileMappingModel.findById(req.query.id)
    } else {
        collection = FileMappingModel.find()
    }
    collection.exec().then((data) => {
        res.send(data)
    }).catch((err) => {
        res.status(400).send("not found the document")
        console.log("failed", err)
    })
})

app.get('/filemapping/:id', (req, res) => {
    var collection = FileMappingModel.findById(req.params.id)
    collection.exec().then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        res.status(500).send("Not found")
        console.log("failed", err)
    })
})

app.get('/audit', (req, res) => {
    var collection = Audit_Model.findById(req.params.id)
    collection.exec().then((data) => {
        res.status(200).send(data)
        console.log("successful get audit api")
    }).catch((err) => {
        res.status(500).send("Not found")
        console.log("failed", err)
    })
})

const FileMappingModel = require('./models/fileMappingModel')
app.post('/filemapping',(req,res)=>{
    console.log("body", req.body);
    var newFileMap = new FileMappingModel(
        {
            file_mapping_name: req.body.file_mapping_name, 
            attr_list: req.body.attribute_list,
            createdBy: req.body.createdBy,
            createdOn: req.body.createdOn,
            creationTime: req.body.creationTime,
            changedBy: req.body.changedBy,
            changedOn: req.body.changedOn,
            changedTime: req.body.changedTime
        })
    newFileMap.save().then((result) => {
        res.status(201).send(result)
    }).catch((err) => {
        res.status(500).send("Insertions failed!")
    })
})

const Audit_Model = require('./models/auditModel')
app.post('/audit',(req,res)=>{
    console.log("body", req.body);
    var newAudit = new Audit_Model(
        {
            type: req.body.type,
            filePath: req.body.filePath,
            fileName: req.body.fileName,
            file_mapping_name: req.body.file_mapping_name,
            createdBy: req.body.createdBy,
            createdOn: req.body.createdOn,
            creationTime: req.body.creationTime
        })

        newAudit.save().then((result) => {
        res.status(201).send(result.json({type}))
    }).catch((err) => {
        res.status(500).send("Insertions failed!")
    })
})

app.put('/filemapping/:id',(req,res)=>{
    console.log("body", req.body);
    const query = FileMappingModel.findByIdAndUpdate(req.params.id, 
        {
            file_mapping_name: req.body.file_mapping_name, 
            attr_list: req.body.attribute_list,
            created_by: req.body.createdBy,
            created_on: req.body.createdOn,
            creation_time: req.body.creationTime,
            changed_by: req.body.changedBy,
            changed_on: req.body.changedon,
            changed_time: req.body.changedTime
        })
    query.exec().then((result) => {
        res.send("update")
    }).catch((err) => {
        res.send(err)
    })
})
app.delete('/filemapping',(req,res)=>{
    console.log("body", req.body);
    const query = FileMappingModel.findByIdAndDelete(req.body.id)
    query.exec().then((result) => {
        res.send("deleted")
    }).catch((err) => {
        res.send("failed")
    })
})
/* app.get('/users', (req, res) => {
    var collection
    if(req.query.id) {
        collection = FileMappingModel.findById(req.query.id)
    } else {
        collection = FileMappingModel.find()
    }
    collection.exec().then((data) => {
        res.send(data)
    }).catch((err) => {
        res.status(400).send("not found the document")
        console.log("failed", err)
    })
}) */

