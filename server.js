const bodyParser = require('body-parser')
// const fs = require('fs')
const baseUrl = 'http://localhost:8383/';
const mongoose = require('mongoose');
const path = require('path');
// // const ass = require('./mongo') 
main().catch(err => console.log(err));
let kittySchema, Kitten;
let questionSchema, questionmodel;
let loginSchema, loginmodel;
let answerSchema, answermodel;
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');

    kittySchema = new mongoose.Schema({
        name: String,
        arrayy: Array
    });
    Kitten = mongoose.model('Kitten', kittySchema);


    questionSchema = new mongoose.Schema({
        name: String,
        arrayy: Array
    });
    questionmodel = mongoose.model('questions', questionSchema);


    loginSchema = new mongoose.Schema({
        name: String,
        login_id: String,
        login_password: String,
        page: String,
        answer: Array
    });
    loginmodel = mongoose.model('loginns', loginSchema);


    answerSchema = new mongoose.Schema({
        name: String,
        answer: Array
    });
    answermodel = mongoose.model('real_answer', answerSchema);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
async function kittenupdate(parcel) {

    let newvalues = { $set: { arrayy: parcel } };
    let infoo = await Kitten.updateOne({ name: "info" }, newvalues);
    await infoo
}
async function kitteninfo() {
    let infoo = await Kitten.findOne({ name: "info" }).exec();
    return JSON.stringify(infoo.arrayy);
}


async function questionupdate(parcel) {
    let newvalues = { $set: { arrayy: parcel } };
    let infoo = await questionmodel.updateOne({ name: "question" }, newvalues);
    await infoo;
}
async function questioninfo() {
    let infoo = await questionmodel.findOne({ name: "question" }).exec();
    return JSON.stringify(infoo.arrayy);
}
async function answerupdateofstudent(parcel, parcel_id, parcel_password) {
    let newvalues = { $set: { answer: parcel } };
    let infoo = await loginmodel.updateOne({ name: "login", login_id: parcel_id, login_password: parcel_password }, newvalues)
    console.log(await infoo)
}

async function authenticate(parcel, parcel_password) {
    let infoo = await loginmodel.find({ name: "login" }).exec();
    for (let i = 0; i < infoo.length; i++) {
        if (infoo[i].login_id == parcel && infoo[i].login_password == parcel_password) {
            return infoo[i].page;

        }
    }
}
async function answerinfofstudent(parcel, parcel_password) {
    let infoo = await loginmodel.find({ name: "login", login_id: parcel, login_password: parcel_password }).exec();
    for (let i = 0; i < infoo.length; i++) {
        if (infoo[i].login_id == parcel && infoo[i].login_password == parcel_password) {
            return infoo[i].answer;

        }
    }
}
async function answerupdate(parcel) {
    let newvalues = { $set: { answer: parcel } };
    let infoo = await answermodel.updateOne({ name: "answer" }, newvalues)

    await infoo;
}
async function answerinfo(parcel) {
    let infoo = await answermodel.findOne({ name: "answer" }).exec()
    return infoo
}















const express = require('express');
const { CURSOR_FLAGS } = require('mongodb');
const app = express();
const port = 8383;
let count = [];
let ANSWERRR;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));



app.get('//index', (req, res) => {
    res.redirect(baseUrl + '/index.html')
})
app.get('//faculty_index.html', (req, res) => {
    res.redirect(baseUrl + '/index.html')
})
app.get('/index.html/:id/:password', async (req, res) => {
    console.log(req.params)
    console.log(req.params.id)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.redirect(baseUrl + '/faculty_index.html')
    }

})
app.get('/student_index.html/:id/:password', async (req, res) => {
    console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.redirect(baseUrl + '/faculty_index.html')
    }
    else if (v == 'student') {
        // console.log("object", __dirname)
        res.sendFile(path.join(__dirname, "public/student_index.html"));
        // res.sendFile(path.join(__dirname,"public/login_style.css"));    
        // res.status(200).send("no found")
    }
    else {
    }
})
app.get('/faculty_index.html/:id/:password', async (req, res) => {
    console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.sendFile(path.join(__dirname, "public/faculty_index.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})
app.get('/show_answer.html/:id/:password', async (req, res) => {
    console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'student') {
        res.sendFile(path.join(__dirname, "public/show_answer.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})
app.get('/question.html/:id/:password', async (req, res) => {
    console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.sendFile(path.join(__dirname, "public/question.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})
app.get('/faculty_index.html/:id/:password', async (req, res) => {
    console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.sendFile(path.join(__dirname, "public/faculty_index.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})

app.get('/faculty_index.html', (req, res) => {
    console.log("not you directly acces")
})




app.get('/info', async (req, res) => {
    res.status(200).json(await kitteninfo());
})
app.get('/questions/:id/:password', async (req, res) => {
    let auth = await authenticate(req.params.id, req.params.password);
    let writee = await questioninfo()
    if (auth == 'student') {
        res.status(200).json(`{"arrrr":${writee},"name":["${req.params.id}",${req.params.password}]}`);
    }
    else {
        res.status(400);
    }
})



app.get('/student_answer/:id/:password', async (req, res) => {
    console.log("object")
    let v=await answerinfofstudent(req.params.id, req.params.password)
    console.log(v)
    res.status(200).json(v);
})
// app.
app.post('/login', async (req, res) => {
    const { parcel, parcel_password } = req.body;
    let nexturl = await authenticate(parcel, parcel_password)

    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }

    if (nexturl == 'faculty') {
        console.log("faculty")
        res.status(200).send({ status: 'recieved' })
    }
    else if (nexturl == 'student') {
        // res.render('http://localhost:8383/student_index.html' )
        console.log("student")
        res.status(222).send({ status: 'recieved' })
    }
    else {
        console.log("no found")
        res.status(400).send({ status: 'recieved' })
    }

})
app.post('/indexxx', async (req, res) => {
    const { parcel } = req.body;
    await kittenupdate(parcel);
    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }
    res.status(200).send({ status: 'recieved' })
})
app.post('/answerrr', async (req, res) => {
    const { parcel, parcel_name } = req.body;
    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }
    let v = await authenticate(parcel_name[0], parcel_name[1])
    console.log(v)
    if (v == 'student') {
        ANSWERRR = await answerinfo();
        ANSWERRR = ANSWERRR.answer;
        for (let j = 0; j < ANSWERRR.length; j++) {
            count[j] = 0;
            for (let i = 0; i < ANSWERRR[j].length; i++) {
                if (ANSWERRR[j][i] == parcel[j][i]) {
                    count[j]++;
                }
            }
        }
    }
    await answerupdateofstudent(count, parcel_name[0], parcel_name[1]);

    res.status(200).send({ status: 'recieved' })
})
app.post('/questionsss', async (req, res) => {
    const { parcel, parcel_answer } = req.body;
    CO_QUESTION = parcel;
    CO_ANSWER = parcel_answer;


    await questionupdate(parcel);
    await answerupdate(parcel_answer);



    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }

    res.status(200).send({ status: 'recieved' })

})


app.listen(port, () => {


    console.log(`server started on port ${port}`)

})

