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
    let conn;
    const sqlReq = "SELECT * FROM position";
    try{
        conn=await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud");
        const [rows, fields]=await conn.execute(sqlReq)
        console.log(rows) // andmed
        console.log(fields) // struktuur
        res.render("filmiametid", {positionList: rows})
    }
    catch(err){
        console.log("Viga: "+err)
        res.render("filmiametid", {positionList: []})
    }
    finally{
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus on suletud")
        }
    }
};


//app.get("/eestifilm/amet/amet_add", (req, res)=>{
const ametid_add = (req,res)=>{
    res.render("filmiametid_add", {notice: "Ootan sisestust"});
};


//app.post("/eestifilm/amet/amet_add", (req, res)=>{
const ametid_add_post = async(req,res)=>{
    let conn;
    let sqlReq= "INSERT INTO `position` (position_name 	, description ) VALUES (?,?)";
    if (!req.body.positionInput || !req.body.positionDescriptionInput){
        res.render("filmiametid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});    
    }
    else{
        try{
            conn=await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühendus loodud");
            const [result] =await conn.execute(sqlReq,[req.body.positionInput, req.body.positionDescriptionInput]);
            console.log("Salvestati kirje: "+result.insertId);
            res.render("filmiametid_add", {notice: "Andmed salvestatud "});
        }
        catch(err){
            console.log("Viga"+err)
            res.render("filmiametid_add", {notice: "Andmete salvestamine ebaõnnestus"});
        }
        finally{
            if(conn){
                await conn.end();
                console.log("Andmebaasi ühendus on suletud")
            }
        }
        
    }
};

const filmid = async(req,res)=>{
    let conn;
    const sqlReq = "SELECT * FROM movie";
    try{
        conn=await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud");
        const [rows, fields]=await conn.execute(sqlReq)
        console.log(rows) // andmed
        console.log(fields) // struktuur
        res.render("filmid", {filmidList: rows})
    }
    catch(err){
        console.log("Viga: "+err)
        res.render("filmid", {filmidList: []})
    }
    finally{
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus on suletud")
        }
    }
};


//app.get("/eestifilm/amet/amet_add", (req, res)=>{
const filmid_add = (req,res)=>{
    res.render("filmid_add", {notice: "Ootan sisestust"});
};


//app.post("/eestifilm/amet/amet_add", (req, res)=>{
const filmid_add_post = async(req,res)=>{
    let conn;
    let sqlReq= "INSERT INTO `movie` (title, production_year, duration, description) VALUES (?,?,?,?)";
    if (!req.body.movieInput || !req.body.movieProductionYear || !req.body.movieDuration || !req.body.movieDescription){
        res.render("filmid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});    
    }
    else{
        try{
            conn=await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühendus loodud");
            const [result] =await conn.execute(sqlReq,[req.body.movieInput, req.body.movieProductionYear, req.body.movieDuration, req.body.movieDescription]);
            console.log("Salvestati kirje: "+result.insertId);
            res.render("filmid_add", {notice: "Andmed salvestatud "});
        }
        catch(err){
            console.log("Viga"+err)
            res.render("filmid_add", {notice: "Andmete salvestamine ebaõnnestus"});
        }
        finally{
            if(conn){
                await conn.end();
                console.log("Andmebaasi ühendus on suletud")
            }
        }
        
    }
};

const seosed = async(req,res)=>{
    let conn;
    const sqlReq = `SELECT 
                person_in_movie.id,
                person.first_name,
                person.last_name,
                movie.title,
                position.position_name,
                person_in_movie.role
            FROM person_in_movie
            JOIN person 
                ON person_in_movie.person_id = person.id
            JOIN movie 
                ON person_in_movie.movie_id = movie.id
            JOIN position 
                ON person_in_movie.position_id = position.id;`
    try{
        conn=await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud");
        const [rows, fields]=await conn.execute(sqlReq)
        console.log(rows) // andmed
        console.log(fields) // struktuur
        res.render("seosed", {seosedList: rows})
    }
    catch(err){
        console.log("Viga: "+err)
        res.render("seosed", {seosedList: []})
    }
    finally{
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus on suletud")
        }
    }
};

const seosed_add = async(req,res)=>{
    let conn;
    try{
        conn=await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud");
        const [position]=await conn.execute("SELECT id, position_name FROM position")
        const [person]=await conn.execute("SELECT id, first_name, last_name FROM person")
        const [movie]=await conn.execute("SELECT id, title FROM movie")
        console.log(position);
        res.render("seosed_add", {notice: "Ootan sisestust", positionList: position , personList: person, movieList: movie })
    }
    catch(err){
        console.log("Viga: "+err)
        res.render("seosed", {notice: "Viga",position: [], person: [], movie: []})
    }
    finally{
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus on suletud")
        }
    }
};

const seosed_add_post = async(req,res)=>{
    let conn;
    let sqlReq= "INSERT INTO `person_in_movie` (position_id, role, person_id, movie_id) VALUES (?,?,?,?)";
    if (!req.body.person_in_moviePositionId || !req.body.person_in_moviePersonId || !req.body.person_in_movieMovieId || req.body.person_in_moviePositionId ==1 && req.body.person_in_movieRole == ""){
        res.render("/eestifilm/seosed", {notice: "Osa andmeid oli puudu või ebakorrektsed"});    
    }
    else{
        try{
            conn=await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühendus loodud");
            let role=null;
            if (req.body.person_in_movieRole != ""){
                role = req.body.person_in_movieRole;
            }
            const [result] =await conn.execute(sqlReq,[req.body.person_in_moviePositionId, role, req.body.person_in_moviePersonId, req.body.person_in_movieMovieId]);
            console.log("Salvestati kirje: "+result.insertId);
            res.redirect("/eestifilm/seosed");
        }
        catch(err){
            console.log("Viga"+err)
            res.render("seosed");
        }
        finally{
            if(conn){
                await conn.end();
                console.log("Andmebaasi ühendus on suletud")
            }
        }
        
    }
};



module.exports={
    eestifilm,
    inimesed,
    inimesed_add,
    inimesed_add_post,
    ametid,
    ametid_add,
    ametid_add_post,
    filmid,
    filmid_add,
    filmid_add_post,
    seosed,
    seosed_add,
    seosed_add_post
};