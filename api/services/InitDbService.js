'use strict';
/**
 * Model Specification Service
 */
class InitDbService {

    constructor(kites, options) {
        kites.logger.info(`hello (${this.name}): `, options);
        this.UserModel = kites.db.User;
    }

    initDatabase() {
        if (this.kites.isProd()) {
            return Promise.reject('EENV - Kites is in production!');
        } else {

            // init super user
            var initSuperUser = new Promise((resolve, reject) => {
                this.UserModel.findOne({
                    username: 'admin'
                }, (err, user) => {

                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        this.UserModel.create({
                            firstname: 'Vu',
                            lastname: 'Nhu-Bao',
                            username: 'admin',
                            email: 'vunb@nodejs.vn'
                        }, (err, user) => {
                            if (!err) {
                                return resolve(user)
                            } else {
                                return reject(err);
                            }
                        })

                    } else {
                        resolve(user);
                    }
                })
            })

            return Promise.all([
                initSuperUser,
            ])
        }
    }
}

module.exports = InitDbService;