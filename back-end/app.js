const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

let app = express();
let groupController = require("./controllers/GroupController");
let userController = require("./controllers/UserController");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");

    if (req.headers.origin) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    }

    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// lấy tất cả thông tin của nhóm theo format option dropdown
app.get("/groups", (req, res) => {
    groupController
        .getAllGroups()
        .then(groups => res.send(groups))
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

// lấy tất cả thành viên trong DB
app.get("/users", (req, res) => {
    userController
        .getAllUsers()
        .then(groups => res.send(groups))
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

// lấy thông tin của nhóm và thành viên trong nhóm đó (đã merge data với graph API)
app.get("/:groupId/:page/:access_token", (req, res) => {
    groupController
        .mergeDataGroup(req.params.groupId, req.params.page, req.params.access_token)
        .then(group => res.send(group))
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

// lấy tất cả member id trong group
app.get("/:groupId/members", (req, res) => {
    groupController
        .getMembers(req.params.groupId)
        .then(members => res.send(members))
        .catch(err => res.status(500).send(err));
});

// tạo 1 nhóm mới trong DB
app.post("/newGroup", (req, res) => {
    groupController
        .createGroup(req.body.name, req.body.description, req.body.status)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(false));
});

// tạo user mới trong DB
app.post("/newUser", (req, res) => {
    userController
        .createUser(req.body.id)
        .then(result => res.send(result))
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

// thêm thành viên vào 1 nhóm
app.post("/:groupId/addMember", (req, res) => {
    let createPromise = []
    let arr = JSON.parse(req.body.members);
    console.log(arr)
    arr.map((memberId) => {
        userController
            .isExistsUser(memberId)
            .then(id => {
                createPromise.push(groupController.addMember(req.params.groupId, id))
            })
            .catch(err => res.status(500).send(err));
    })
    Promise.all(createPromise)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err))
});

// xóa 1 thành viên trong nhóm
app.delete("/:groupId/:memberId", (req, res) => {
    groupController
        .deleteMember(req.params.groupId, req.params.memberId)
        .then(res.send(true))
        .catch((err) => res.status(500).send(false));
})

// cập nhật thông tin của 1 nhóm trong DB
app.put("/:id/group", (req, res) => {
    groupController
        .updateGroup(req.params.id, req.body.name, req.body.description, req.body.status)
        .then(res.send(true))
        .catch((err) => res.status(500).send(false));
});

// xóa 1 nhóm trong DB
app.delete("/:id/group", (req, res) => {
    console.log(req.params.id)
    groupController.deleteGroup(req.params.id)
        .then(res.send(true))
        .catch((err) => res.status(500).send(false));
})

mongoose.connect('mongodb://admin:Anhthuong1@ds131621.mlab.com:31621/color-app', {
    useNewUrlParser: true
}, (err) => {
    if (err) console.log(err);
    console.log("Database connect success !");
});

const port = process.env.PORT || 6969;

app.listen(port, (err) => {
    if (err) {
        console.log(err)
    };
    console.log("App is start at port " + port);
});