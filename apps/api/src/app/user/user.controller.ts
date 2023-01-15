import { UserService } from '@api/app/user/user.service';
import { SearchUserParams } from '@interfaces/user';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Get('search')
  searchUsers(@Query() params: SearchUserParams) {
    return this.userService.searchUsers(params);
  }
}
