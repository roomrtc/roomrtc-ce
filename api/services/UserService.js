'use strict';
/**
 * Model Specification Service
 */
class UserService {

    constructor(kites, options) {
        kites.logger.info(`hello (${this.name}): `, options);
        this.UserModel = kites.db.User;
    }

    /**
     * Find user by id or user name
     * 
     * @param {String} idOrUsername 
     */
    findUser(idOrUsername) {
        return new Promise((resolve, reject) => {
            // make queryable
            var query = this.UserModel.findOne();

            query
                .or([{
                        id: idOrUsername
                    },
                    {
                        username: idOrUsername
                    }
                ])
                .run((err, result) => {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err);
                    }
                })
        })
    }

}

module.exports = UserService;