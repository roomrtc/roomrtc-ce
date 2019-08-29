import { Controller, Get, RequestParam } from '@kites/rest';
import { Inject } from '@kites/common';
import { KITES_INSTANCE, KitesInstance } from '@kites/core';
import { UserService } from './user.service';

/**
 * User controller
 */
@Controller('/user')
export class UserController {

  constructor(
    @Inject(KITES_INSTANCE) private kites: KitesInstance,
    private svUser: UserService,
  ) {
    this.kites.logger.debug('Init User controller!');
  }

  @Get('/')
  create() {
    return this.svUser.getAll();
  }

  @Get('/:username')
  details(
    @RequestParam('username') username: string,
  ) {
    return this.svUser.get(username);
  }

}
