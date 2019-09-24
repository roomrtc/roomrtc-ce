import { Injectable, Inject } from '@kites/common';
import { UserModel, User } from '../models';
import { KITES_INSTANCE, KitesInstance } from '@kites/core';

@Injectable()
export class UserService {

  constructor(
    @Inject(KITES_INSTANCE) private kites: KitesInstance,
  ) { }

  async getAll() {
    const vUsers = await UserModel.find().skip(0).limit(10);
    return vUsers;
  }

  create(user: User) {
    if (!user || !user.username) {
      throw new Error('User is required: username!');
    }
    this.kites.logger.info('Create new user: ' + user.username);
    return UserModel.create(user);
  }

  async get(username: string) {
    this.kites.logger.info('Get details: ' + username);
    const user: User = await UserModel.findOne({ username });
    if (!user) {
      throw new Error('User not found: ' + username);
    }

    return user;
  }

  public update(user: string) {
    return `Update: ${user}`;
  }

  public delete(user: string) {
    return `Delete user "${user}"!`;
  }
}
