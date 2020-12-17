import { ApiProperty } from '@nestjs/swagger'

export class LoginUser {
  @ApiProperty({ description: '账号' })
  readonly account: string

  @ApiProperty({ description: '密码' })
  readonly password: string
}
