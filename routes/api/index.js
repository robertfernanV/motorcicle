const router = require('express').Router();

router.use('/bikes',require('./bikes'));

module.exports = router;