import { Injectable, Inject } from '@kites/common';
import { UserModel } from '../models';
import { KITES_INSTANCE, KitesInstance } from '@kites/core';

@Injectable()
export class UserService {

  constructor(
    @Inject(KITES_INSTANCE) private kites: KitesInstance,
  ) {}

  public getAll(): string {
    return 'Get all user!!!';
  }

  public create(user: any) {
    console.log('Create user: ', user);
    return { _id: Date.now(), ...user };
  }

  async get(username: string) {
    let user = await UserModel.findOne({ username });
    if (!user) {
      this.kites.logger.info('Create new user: ' + username);
      user = await UserModel.create({ username });
    }

    this.kites.logger.info('Get details: ' + username);

    return user;
  }

  public update(user: string) {
    return `Update: ${user}`;
  }

  public delete(user: string) {
    return `Delete user "${user}"!`;
  }
}
