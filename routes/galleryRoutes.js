const express = require("express");
const multer = require("multer");

const router = express.Router();
//seadistame vahevara fotode üleslaadimiseks kindlase kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

//kontrollerid
const {
    photouploadPage,
    photouploadPage_post
} = require("../controllers/galleryControllers");

router.route("/").get(photouploadPage);
router.route("/").post(uploader.single("photoInput"),photouploadPage_post);



module.exports=router;
