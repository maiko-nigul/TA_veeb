const express = require("express");
const router = express.Router();

//kontrollerid
const {
    eestifilm,
    inimesed,
    inimesed_add,
    inimesed_add_post} = require("../controllers/eestifilmControllers");

router.route("/").get(eestifilm);
router.route("/inimesed").get(inimesed);
router.route("/inimesed_add").get(inimesed_add);
router.route("/inimesed_add").post(inimesed_add_post);
router.route("/ametid").get(ametid)
router.route("/ametid_add").get(ametid_add)
router.route("/filmid").get(filmid)
router.route("/filmid_add").post(filmid_add)

module.exports=router;
