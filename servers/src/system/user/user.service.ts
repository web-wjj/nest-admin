import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { genSalt, hash, compare } from 'bcrypt'

import { ResultData } from '../../common/utils/result'

import { UserEntity } from './user.entity'

import { CreateUserDto } from './dto/create-user.dto'
import { classToPlain, plainToClass } from 'class-transformer'

export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly config: ConfigService,
  ) {}

  async findOneById(id: number): Promise<UserEntity> {
    return await this.userRepo.findOne(id)
  }

  async findOneByAccount(account: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ account })
  }

  // 创建
  async create(dto: CreateUserDto): Promise<ResultData> {
    const existing = await this.findOneByAccount(dto.account)
    if (existing) return ResultData.fail(500, '账号已存在，请调整后重新注册！')
    if (dto.password !== dto.confirmPassword) return ResultData.fail(500, '两次输入密码不一致，请重试')
    const salt = await genSalt()
    dto.password = await hash(dto.password, salt)
    const user = plainToClass(UserEntity, { salt, ...dto })
    const result = await this.userRepo.save(user)
    return ResultData.ok(classToPlain(result))
  }

  // 登录
  async login(account: string, password: string): Promise<ResultData> {
    const user = await this.findOneByAccount(account)
    if (!user) return ResultData.fail(500, '账号或密码错误')
    const checkPassword = await compare(password, user.password)
    if (!checkPassword) return ResultData.fail(500, '账号或密码错误')
    return ResultData.ok(user)
  }
}
