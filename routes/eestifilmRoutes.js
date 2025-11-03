const express = require("express");
const router = express.Router();

//kontrollerid
const {
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



} = require("../controllers/eestifilmControllers");

router.route("/").get(eestifilm);
router.route("/inimesed").get(inimesed);
router.route("/inimesed_add").get(inimesed_add);
router.route("/inimesed_add").post(inimesed_add_post);
router.route("/ametid").get(ametid)
router.route("/ametid/ametid_add").get(ametid_add)
router.route("/ametid/ametid_add").post(ametid_add_post)
router.route("/filmid").get(filmid)
router.route("/filmid/filmid_add").get(filmid_add)
router.route("/filmid/filmid_add").post(filmid_add_post)
router.route("/seosed").get(seosed)
router.route("/seosed/seosed_add").get(seosed_add)
router.route("/seosed/seosed_add").post(seosed_add_post)

module.exports=router;
