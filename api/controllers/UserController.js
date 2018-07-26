'use strict';

class UserController {

    constructor(kites, options) {
        kites.logger.info(`hello (${this.name}): `, options);

        this.InitDbService = kites.sv.initDb;
    }

    /**
     * Api get user detail by user id or user name
     * Override base controller read()
     * 
     * eg: curl http://localhost:3000/api/user/vunb
     * eg: curl http://localhost:3000/api/user/1
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    read(req, res, next) {

        // get param from request
        var username = req.param('id');

        // call user service
        this.kites.sv.user.findUser(username)
            .then((user) => {
                res.ok(user)
            })
            .catch((err) => {
                res.error(err)
            })
    }

    /**
     * Api create a Http POST method to initialize a sample database
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    'post demo' (req, res, next) {

        // call initDb service
        this.InitDbService
            .initDatabase()
            .then((result) => {
                res.ok(result)
            })
            .catch(err => {
                res.error(err)
            })
    }
}

module.exports = UserController;