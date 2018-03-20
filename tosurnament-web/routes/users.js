var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var query = "SELECT * from users";
  res.locals.connection.query(query, function(error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

module.exports = router;
