var express = require('express');
var user =require('./users')
const router = express.Router();

const defaultRoutes = [
  {
    path: "/user",
    route: user,
  }
];

defaultRoutes.forEach((r) => {
  router.use(r.path, r.route);
});

module.exports = router;
