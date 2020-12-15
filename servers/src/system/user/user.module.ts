import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CryptoUtil } from '../../common/utils/crypto.util'

import { BaseController } from './base.controller'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, CryptoUtil],
  controllers: [BaseController],
})
export class UserModule {}
