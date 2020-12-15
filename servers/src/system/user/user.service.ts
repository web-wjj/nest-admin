import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ResultData } from '../../common/utils/result'
import { CryptoUtil } from '../../common/utils/crypto.util'

import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './user.entity'

export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly config: ConfigService,
    private readonly cryptoUtil: CryptoUtil,
  ) {}

  async findOneById(id: number): Promise<UserEntity> {
    return await this.userRepo.findOne(id)
  }

  async findOneByAccount(account: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ account })
  }

  async create(dto: CreateUserDto): Promise<ResultData> {
    const existing = await this.findOneByAccount(dto.account)
    if (existing) return ResultData.fail(500, '账号已存在，请调整后重新注册！')
    if (dto.password !== dto.confirmPassword) return ResultData.fail(500, '两次输入密码不一致，请重试')
    dto.password = this.cryptoUtil.encryPassword(dto.password)
    let user = new UserEntity()
    user = { ...dto, ...user }
    const result = await this.userRepo.save(user)
    return ResultData.ok(result)
  }
}
