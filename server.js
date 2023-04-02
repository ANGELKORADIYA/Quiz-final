const bodyParser = require('body-parser')
const baseUrl = 'http://localhost:8383/';
const mongoose = require('mongoose');
const path = require('path');
main().catch(err => console.log(err));
let kittySchema, Kitten;
let questionSchema, questionmodel;
let loginSchema, loginmodel;
let answerSchema, answermodel;
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');

    kittySchema = new mongoose.Schema({
        name: String,
        id:String, 
        arrayy: Array
    });
    Kitten = mongoose.model('Kitten', kittySchema);


    questionSchema = new mongoose.Schema({
        name: String,
        id:String,
        arrayy: Array
    });
    questionmodel = mongoose.model('questions', questionSchema);


    loginSchema = new mongoose.Schema({
        name: String,
        login_id: String,
        login_password: String,
        page: String,
        id:String,
        answer: Array
    });
    loginmodel = mongoose.model('loginns', loginSchema);


    answerSchema = new mongoose.Schema({
        name: String,
        id:String,
        answer: Array
    });
    answermodel = mongoose.model('real_answer', answerSchema);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
async function kittenupdate(parcel,parcel_id,parcel_password) {
    let auth = await authenticate(parcel_id,parcel_password)

    if(auth=='faculty'){
    let newvalues = { $set: { arrayy: parcel } };
    let infoo = await Kitten.updateOne({ name: "info",id:parcel_id }, newvalues);
    if(infoo.matchedCount==0){
    let silence = new Kitten({ name: 'info',arrayy:parcel,id:parcel_id});
    await silence.save();
    }
    await infoo


}
}
async function kitteninfo(parcel) {
    let infoo = await Kitten.findOne({ name: "info",id:parcel}).exec();
    return JSON.stringify(infoo.arrayy);
}


async function questionupdate(parcel,parcel_id,parcel_password) {
    let auth = await authenticate(parcel_id,parcel_password)
    if(auth=='faculty'){
    let newvalues = { $set: { arrayy: parcel } };
    let infoo = await questionmodel.updateOne({ name: "question",id:parcel_id }, newvalues);
    if(infoo.matchedCount==0){
        // let slience = new questionmodel({name:'questions'})
    let silence = new questionmodel({ name: 'question',arrayy:parcel,id:parcel_id});
    await silence.save();

    // console.log(infoo)
}
    await infoo;
}
}
async function questioninfo(parcel_id,parcel_password) {
    let idd=await getidd(parcel_id,parcel_password)
    let infoo = await questionmodel.findOne({ name: "question",id:JSON.parse(idd) }).exec();
    return JSON.stringify(infoo.arrayy);
}
async function answerupdateofstudent(parcel, parcel_id, parcel_password,idd) {
    let newvalues = { $set: { answer: parcel } };
    let infoo = await loginmodel.updateOne({ name: "login", login_id: parcel_id, login_password: parcel_password,id:JSON.parse(idd) }, newvalues)
    await infoo
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
async function responsesss(parcel, parcel_password) {
    let auth = await authenticate(parcel,parcel_password);
    let infoo;
    if(auth=='faculty'){
    infoo = await loginmodel.find({ name: "login", id:parcel,page:'student'}).exec();}
    for(let i=0;i<infoo.length;i++){}
    infoo=infoo.map(({ login_id,answer})=>{ 

        return { login_id,answer};
      
      });
    return infoo
    // for (let i = 0; i < infoo.length; i++) {
    //     if (infoo[i].login_id == parcel && infoo[i].login_password == parcel_password) {
    //         return infoo[i].answer;

    //     }
    // }
    
}
async function answerupdate(parcel_answer,parcel_id,parcel_password) {
    let auth = await authenticate(parcel_id,parcel_password);
    if(auth=='faculty'){
    let newvalues = { $set: { answer: parcel_answer } };
    let infoo = await answermodel.updateOne({ name: "answer" ,id:parcel_id}, newvalues)
    if(infoo.matchedCount==0){
    let silence = new answermodel({ name: 'answer',answer:parcel_answer,id:parcel_id});
    await silence.save();

    // console.log(infoo);
}
await infoo;

}
}
async function answerinfo(parcel) {
    // console.log(JSON.parse(parcel))
    let infoo = await answermodel.findOne({ name: "answer",id:JSON.parse(parcel) }).exec()
    // console.log(infoo)
    return infoo.answer;
}

async function getidd(parcel_id,parcel_password){
    let infoo = await loginmodel.findOne({ name: "login",login_id: parcel_id,login_password:parcel_password }).exec();

    // console.log(infoo.id)
    return JSON.stringify(infoo.id);
    
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
    // console.log(req.params)
    // console.log(req.params.id)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.redirect(baseUrl + '/faculty_index.html')
    }

})
app.get('/student_index.html/:id/:password', async (req, res) => {
    // console.log(req.params)
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
    // console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.sendFile(path.join(__dirname, "public/faculty_index.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})
app.get('/responces.html/:id/:password', async (req, res) => {
    // console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.sendFile(path.join(__dirname, "public/responces.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})
app.get('/show_answer.html/:id/:password', async (req, res) => {
    // console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'student') {
        res.sendFile(path.join(__dirname, "public/show_answer.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})
app.get('/question.html/:id/:password', async (req, res) => {
    // console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.sendFile(path.join(__dirname, "public/question.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})
app.get('/faculty_index.html/:id/:password', async (req, res) => {
    // console.log(req.params)
    let v = await authenticate(req.params.id, req.params.password);
    if (v == 'faculty') {
        res.sendFile(path.join(__dirname, "public/faculty_index.html"));
        // res.redirect(baseUrl + '/faculty_index.html')
    }

    else {
    }
})

app.get('/faculty_index.html', (req, res) => {
    // console.log("not you directly acces")
})




app.get('/info/:id/:password', async (req, res) => {
    let auth = await authenticate(req.params.id,req.params.password)
    // console.log(req.params)
    if(auth=='faculty'){
        // idd = await getidd(req.params.id,req.params.password);
        // console.log(idd)
        
        res.status(200).json(await kitteninfo(req.params.id));
    }
})
//student view
app.get('/questions/:id/:password', async (req, res) => {
    let auth = await authenticate(req.params.id, req.params.password);
    let writee = await questioninfo(req.params.id,req.params.password);
    if (auth == 'student') {
        res.status(200).json(`{"arrrr":${writee},"name":["${req.params.id}",${req.params.password}]}`);
    }
    else {
        res.status(400);
    }
})
app.get('/responces/:id/:password', async (req, res) => {
    let auth = await authenticate(req.params.id, req.params.password);
    if (auth == 'faculty') {
        let writee = await responsesss(req.params.id,req.params.password);
        res.status(200).json(`{"arrrr":${JSON.stringify(writee)},"name":["${req.params.id}",${req.params.password}]}`);
    }
    else {
        res.status(400);
    }
})
//end


app.get('/student_answer/:id/:password', async (req, res) => {
    // console.log("object")
    let v=await answerinfofstudent(req.params.id, req.params.password)
    // console.log(v)
    res.status(200).json(v);
})
// app.
app.post('/login', async (req, res) => {
    const { parcel, parcel_password } = req.body;
    console.log(parcel,parcel_password)
    let nexturl = await authenticate(parcel, parcel_password)

    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }

    if (nexturl == 'faculty') {
        console.log("faculty")
        res.status(200).send({ status: 'recieved' })
    }
    else if (nexturl == 'student') {
        if(parcel=='adarsh'){
            console.log("student")
            // res.render('http://localhost:8383/public/faceauth.html' )
            res.status(800).send({status:'recieved'})
        }
        else{
        // console.log("student")
        res.status(222).send({ status: 'recieved' })}
    }
    else {
        // console.log("no found")
        res.status(400).send({ status: 'recieved' })
    }

})
app.post('/indexxx', async (req, res) => {
    const { parcel,parcel_id,parcel_password } = req.body;
    await kittenupdate(parcel,parcel_id,parcel_password);
    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }
    res.status(200).send({ status: 'recieved' })
})
app.post('/signup', async (req, res) => {
    const { parcel,parcel_name } = req.body;
    // console.log(parcel_id)
    console.log(parcel,parcel_name)
    let a = new loginmodel({login_id:parcel,login_password:parcel_name,page:'student',name:'login'});
    await a.save()
    
    res.status(200).send({ status: 'recieved' })
})
app.post('/answerrr', async (req, res) => {
    const { parcel, parcel_name } = req.body;
    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }
    let v = await authenticate(parcel_name[0], parcel_name[1])
    let idd;
    if (v == 'student') {
        idd=await getidd(parcel_name[0],parcel_name[1]);
        ANSWERRR = await answerinfo(idd);
        for (let j = 0; j < ANSWERRR.length; j++) {
            count[j] = 0;
            for (let i = 0; i < ANSWERRR[j].length; i++) {
                if (ANSWERRR[j][i] == parcel[j][i]) {
                    count[j]++;
                }
            }
        }
    }
    // console.log(count)
    await answerupdateofstudent(count, parcel_name[0], parcel_name[1],idd);

    res.status(200).send({ status: 'recieved' })
})
app.post('/questionsss', async (req, res) => {
    const { parcel, parcel_answer,parcel_id,parcel_password } = req.body;
    // console.log(req.body)

    await questionupdate(parcel,parcel_id,parcel_password);
    await answerupdate(parcel_answer,parcel_id,parcel_password);



    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }

    res.status(200).send({ status: 'recieved' })

})


app.listen(port, () => {
    console.log(`server started on port ${port}`)

})

  