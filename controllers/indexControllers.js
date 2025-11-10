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


const homePage = async(req,res)=>{
    let conn;
    let sqlReq = "SELECT file_name, alt_text FROM `gallery_photos` WHERE id=(SELECT MAX(id) FROM `gallery_photos` WHERE privacy=3 AND deleted IS NULL);"
    try{
        conn=await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud");
        const [rows]=await conn.execute(sqlReq)
        console.log(rows) // andmed
        res.render("index",{photos: rows});
    }
    catch (err){
        console.log(err)
        res.render("index",{photos: []});
    }
    finally{
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus on suletud")
        }
    }
};

module.exports={
    homePage
};