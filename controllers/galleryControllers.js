const mysql = require("mysql2/promise")
const dbInfo = require("../../../vp2025config");
const sharp = require("sharp");
const fs = require("fs").promises;

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: "if25_maiko"
};


const photouploadPage = (req,res)=>{
    res.render("galleryphotoupload");
};

const photouploadPage_post = async(req,res)=>{
    let conn;
    let sqlReq = "INSERT INTO `gallery_photos` (file_name, orig_name, alt_text, privacy,user_id) VALUES (?,?,?,?,?)"
    try{
        const filename="vp_"+Date.now()+".jpg";
        await fs.rename(req.file.path,req.file.destination+filename);
        //loon normaalsuuruse 800x600
        await sharp(req.file.destination+filename).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/"+filename);
        //loon thumbnail pildi 100x100  
        await sharp(req.file.destination+filename).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/"+filename);
        conn=await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud");
        //kuna kasutajakontosid veel ei ole, siis määrama user_id =1
        const user_id=1
        console.log(filename);
        console.log(req.file.originalname);
        console.log(req.body.altInput);
        console.log(req.body.privacyInput);
        console.log(user_id);
        const [result]=await conn.execute(sqlReq,[filename, req.file.originalname,req.body.altInput,req.body.privacyInput,user_id])
        console.log("Salvestati pilt: "+result.insertId);
        res.render("galleryphotoupload");
    }
    catch (err){
        console.log(err)
        res.render("galleryphotoupload");
    }
    finally{
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus on suletud")
        }
    }
}

module.exports={
    photouploadPage,
    photouploadPage_post
};