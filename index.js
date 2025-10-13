const express = require("express");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
const fs = require("fs"); // faili lugemine
const bodyparser = require("body-parser"); //päringu lahtiharjutaja POST jaoks
const mysql = require("mysql2");  //SQL andmebaasi moodul
const textRef = "public/txt/vanasonad.txt";
const app = express(); // käivitan express.js funktisooni ja annan talle nimeks "app"
app.set("view engine", "ejs"); //määran veebilehtede mallie renderamidse mootori
app.use(express.static("public")); //määran ühe päris kataloogi avalikult kättesaadavaks
app.use(bodyparser.urlencoded({extended:false}))//parsime päringu URLi, lipp false, kui ainult tekst ja true, kui muid andmeid ka
const conn = mysql.createConnection({ //loon andmebaasi ühenduse
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: "if25_maiko"
});

app.get("/", (req, res)=>{
    //res.send("Express.js läks käima ja serveerib veebi");
    res.render("index");
});

app.get("/timenow", (req,res)=>{
    const weekDayNow = dateEt.weekDay();
    const dateNow = dateEt.fullDate();
    res.render("timenow", {weekDayNow: weekDayNow, dateNow:dateNow})
})
app.get("/vanasonad", (req,res)=>{
    let folkWisdom = [];
    fs.readFile(textRef, "utf-8", (err, data)=>{
        if (err){
            res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]});
        }
        else {
            folkWisdom = data.split(";");
            res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
		}
    })
});
app.get("/regvisit", (req, res)=>{
    res.render("regvisit");
});
app.post("/regvisit", (req, res)=>{
    console.log(req.body)
    //avan tekstifaili kirjutamiseks sellisel moel, et kui seda pole, luuakse (parameeter "a")
    fs.open("public/txt/visitlog.txt", "a",(err,file)=>{
        if (err){
            throw(err);
        }
        else{
            //faili senisele sisule lisamine
            fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput+ " " +req.body.lastNameInput+" "+dateEt.fullDate()+" "+dateEt.fullTime()+ ";",(err)=>{
                if (err){
                    throw(err)
                }
                else{
                    console.log("Salvestatud!");
                    res.render("visitregistered", {fullName: req.body.firstNameInput+ " "+req.body.lastNameInput});
                }
            })
        }
    });
})
app.get("/visitregistered", (req,res)=>{
        if (err){
            throw(err)
        }
        else {
            res.render("visitregistered")
		}
});

app.get("/visitlog", (req,res)=>{
    let listData = [];
    fs.readFile("public/txt/visitlog.txt", "utf-8", (err, data)=>{
        if (err){
            res.render("visitlog", {heading: "Lehekülje külastajad", listData: ["Ei leidnud ühtegi külastajat!"]});
        }
        else {
            listData = data.split(";");
            let correctListData = [];
            for (let i = 0; i < listData.length-1; i++) {
                correctListData.push(listData[i]);
            }
            res.render("visitlog", {heading: "Lehekülje külastajad", listData: correctListData});
		}
    })
});
app.get("/eestifilm", (req, res)=>{
    res.render("eestifilm");
});
app.get("/eestifilm/inimesed", (req, res)=>{
    const sqlReq = "SELECT * FROM person";
    conn.execute(sqlReq, (err,sqlres)=>{
        if (err){
            throw(err)
        }
        else {
            console.log(sqlres);
            res.render("filmiinimesed", {personList: sqlres});
        }
    });
    //res.render("filmiinimesed");
});
app.get("/eestifilm/inimesed_add", (req, res)=>{
    res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});
app.post("/eestifilm/inimesed_add", (req, res)=>{
    console.log(req.body);
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date()){
        res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});    
    }
    else{
        let deceasedDate = null;
		if(req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput;
		}
        let sqlReq= "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
        conn.execute(sqlReq,[req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err,sqlres)=>{
            if (err){
                res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
            }
            else{
                res.render("filmiinimesed_add", {notice: "Andmed salvestatud "});
            }
        });
    }
    //res.render("filmiinimesed_add");
});
app.get("/eestifilm/ametid", (req, res)=>{
    const sqlReq = "SELECT * FROM position";
    conn.execute(sqlReq, (err,sqlres)=>{
        if (err){
            throw(err)
        }
        else {
            console.log(sqlres);
            res.render("filmiametid", {positionList: sqlres});
        }
    });
    //res.render("filmiinimesed");
});
app.get("/eestifilm/amet/amet_add", (req, res)=>{
    res.render("filmiametid_add", {notice: "Ootan sisestust"});
});
app.post("/eestifilm/amet/amet_add", (req, res)=>{
    if (!req.body.positionInput || !req.body.positionDescriptionInput){
        res.render("filmiametid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});    
    }
    else{
        let sqlReq= "INSERT INTO `position` (position_name 	, description ) VALUES (?,?)";
        conn.execute(sqlReq,[req.body.positionInput, req.body.positionDescriptionInput], (err,sqlres)=>{
            if (err){
                console.log(err)
                res.render("filmiametid_add", {notice: "Andmete salvestamine ebaõnnestus"});
            }
            else{
                res.redirect("/eestifilm/ametid");
                res.render("filmiametid_add", {notice: "Andmed salvestatud "});
            }
        });
    }
});


app.listen(5130);