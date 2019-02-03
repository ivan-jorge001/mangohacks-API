const express = require('express');
const router  = express.Router();
const request = require('request');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const Algorithmia = require("algorithmia");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.post('/uploadImage', async (req, res, next) => {

  const response = {};
  try {
    const result = await client.textDetection(req.body.url);
    // console.log(result)
    const labels = result[0].textAnnotations[0].description;
    response.text = labels;
    const res = await Algorithmia.client("simX0Ugg0WFLCZ/hjQ5x3JFICq31")
    .algo("PetiteProgrammer/ProgrammingLanguageIdentification/0.1.3")
    .pipe(labels)
    response.language = res.get();

  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  return res.status(200).json(response);
});

router.post('/compile', async (req, res, next) => {
  const program = {
    script: req.body.script,
    language: req.body.lang,
    versionIndex: "0",
    clientId: "4785307d0e3e8339893ea35ac006f8b8",
    clientSecret:"64bb7eddaf04393c6c9e84c1e025ae6496f13b17830302ff9c5bc598968f39df"
};
  request({
      url: 'https://api.jdoodle.com/execute',
      method: "POST",
      json: program
  }, (error, response, body)  => {
    if (error) {
      console.log(error)
      return res.status(500).json({ error: 'somethinghappened trying to compile' });
    }

      return res.status(response.statusCode).json(body)
  });
});

module.exports = router;
