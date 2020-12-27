import { ApiProperty } from '@nestjs/swagger'

import { ReqListQuery } from '../../../common/utils/req-list-query'

export class FindUserListDto extends ReqListQuery {
  @ApiProperty({ description: '账号模糊搜索', required: false })
  account?: string

  @ApiProperty({ description: '按账号状态查询用户', required: false })
  status?: number
}
