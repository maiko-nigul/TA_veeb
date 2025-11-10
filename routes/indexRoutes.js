const express = require("express");
const router = express.Router();

//kontrollerid
const {
    homePage
} = require("../controllers/indexControllers");

router.route("/").get(homePage)

module.exports=router;
