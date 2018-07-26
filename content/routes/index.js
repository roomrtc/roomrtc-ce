var router = require('express').Router();

/**
 * Config route to user home page
 */
router.get('/home', (req, res, next) => {
    // TODO: get kites from Request
    // eg: var kites = req.kites;

    res.view('home');
});

module.exports = router;