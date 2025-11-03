const express = require("express");
const dateEt = require("./src/dateTimeET");
//const dbInfo = require("../../vp2025config");
const fs = require("fs"); // faili lugemine
const bodyparser = require("body-parser"); //päringu lahtiharjutaja POST jaoks
//const mysql = require("mysql2"); kuna kaustame Asynci siis impordime mysql2/promise mooduli  //SQL andmebaasi moodul
//const mysql = require("mysql2/promise")
const textRef = "public/txt/vanasonad.txt";
const app = express(); // käivitan express.js funktisooni ja annan talle nimeks "app"
app.set("view engine", "ejs"); //määran veebilehtede mallie renderamidse mootori
app.use(express.static("public")); //määran ühe päris kataloogi avalikult kättesaadavaks
app.use(bodyparser.urlencoded({extended:true}))//parsime päringu URLi, lipp false, kui ainult tekst ja true, kui muid andmeid ka

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

//Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm",eestifilmRouter);

//Galerii fotode üleslaadimine
const photoupRouter=require("./routes/galleryRoutes");
app.use("/galleryphotoupload", photoupRouter);


app.listen(5130);