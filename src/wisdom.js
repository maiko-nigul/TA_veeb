const fs = require("fs");
const textRef = "txt/vanasonad.txt";

const listWisdom = function(rawData){
    if (typeof rawData !== "string") return [];
    const wisdoms = rawData.split(";");
    for (let i = 0; i < wisdoms.length; i++) {
        wisdoms[i] = wisdoms[i].trim();
    }
return wisdoms;
}

const readTextFile = function(){
    fs.readFile(textRef, "utf8",(err, data)=>{
        if(err){
            console.log(err);
        } else{
            //console.log(data);
            listWisdom(data);
        }
    });
}
module.exports={listW: listWisdom, readText: readTextFile};