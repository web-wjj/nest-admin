import { Controller, Query, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

import { UserService } from './user.service'
import { ResultData } from '../../common/utils/result'

import { FindUserListDto } from './dto/find-user-list.dto'

@ApiTags('用户账号相关')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: '查询用户列表' })
  async findList(@Query() dto: FindUserListDto): Promise<ResultData> {
    console.log(dto, 90)
    return await this.userService.findList(dto)
  }
}
