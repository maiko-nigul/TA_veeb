const mysql = require("mysql2/promise")
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: "if25_maiko"
};

//@desc home page for Estonian Film section
//@route GET /eestifilm
//@access public

//app.get("/eestifilm", (req, res)=>{
const eestifilm = (req,res)=>{
    res.render("eestifilm");
};
//@desc Page for Estonian Film actors
//@route GET /eestifilm/inimesed
//@access public

//app.get("/eestifilm/inimesed", async(req,res)=>{
const inimesed = async(req,res)=>{
    let conn;
    const sqlReq="SELECT * FROM person";
    try{
        conn=await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud");
        const [rows, fields]=await conn.execute(sqlReq)
        console.log(rows) // andmed
        console.log(fields) // struktuur
        res.render("filmiinimesed", {personList: rows})
    }
    catch(err){
        console.log("Viga: "+err)
        res.render("filmiinimesed", {personList: []})
    }
    finally{
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus on suletud")
        }
    }
};

//@desc Page for adding Estonian Film actors
//@route GET /eestifilm/inimesed_add
//@access public

//app.get("/eestifilm/inimesed_add", (req, res)=>{
const inimesed_add= (req,res)=>{
    res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
};

//@desc Page for Estonian Film actors
//@route POST /eestifilm/inimesed_add
//@access public

//app.post("/eestifilm/inimesed_add", async (req,res)=>{
const inimesed_add_post = async(req,res)=>{
    let conn;
    let sqlReq= "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date()){
        res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});    
    }
    else{
        try{
            conn=await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühendus loodud");
            let deceasedDate = null;
		    if(req.body.deceasedInput != ""){
			    deceasedDate = req.body.deceasedInput;
		    }
            const [result] =await conn.execute(sqlReq,[req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
            console.log("Salvestati kirje: "+result.insertId);
            res.render("filmiinimesed_add", {notice: "Andmed salvestatud "});
        }
        catch(err){
            console.log("Viga"+err)
            res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
        }
        finally{
            if(conn){
                await conn.end();
                console.log("Andmebaasi ühendus on suletud")
            }
        }
    }
};

//app.get("/eestifilm/ametid", (req, res)=>{
const ametid = async(req,res)=>{
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
};


//app.get("/eestifilm/amet/amet_add", (req, res)=>{
const ametid_add = (req,res)=>{
    res.render("filmiametid_add", {notice: "Ootan sisestust"});
};


//app.post("/eestifilm/amet/amet_add", (req, res)=>{
const ametid_add_post = async(req,res)=>{
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
};



module.exports={
    eestifilm,
    inimesed,
    inimesed_add,
    inimesed_add_post
};