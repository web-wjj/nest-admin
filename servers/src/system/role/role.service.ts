import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getManager, Like } from 'typeorm'
import { plainToClass } from 'class-transformer'

import { ResultData } from '../../common/utils/result'

import { RoleEntity } from './role.entity'
import { RoleMenuEntity } from './role-menu.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { FindRoleListDto } from './dto/find-role-list.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepo: Repository<RoleMenuEntity>,
  ) {}

  async create(dto: CreateRoleDto): Promise<ResultData> {
    const role = plainToClass(RoleEntity, dto)
    const res = await getManager().transaction(async (transactionalEntityManager) => {
      const result = await transactionalEntityManager.save<RoleEntity>(role)
      if (result) {
        const roleMenus = plainToClass(
          RoleMenuEntity,
          dto.menuIds.map((menuId) => {
            return { menuId: menuId, roleId: result.id }
          }),
        )
        await transactionalEntityManager.save<RoleMenuEntity>(roleMenus)
      }
      return result
    })
    if (!res) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '角色创建失败，请稍后重试')
    return ResultData.ok(res)
  }

  async update(dto: UpdateRoleDto): Promise<ResultData> {
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      if (dto.menuIds) {
        await this.roleMenuRepo.delete({ roleId: dto.id })
      }
      const result = await transactionalEntityManager.update<RoleEntity>(RoleEntity, dto.id, plainToClass(RoleEntity, dto))
      return result
    })
    if (!affected) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '当前角色更新失败，请稍后尝试')
    return ResultData.ok()
  }

  async delete(id: number): Promise<ResultData> {
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      await this.roleMenuRepo.delete({ roleId: id })
      const result = await transactionalEntityManager.delete<RoleEntity>(RoleEntity, id)
      return result
    })
    if (!affected) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '删除失败，请稍后重试')
    return ResultData.ok()
  }

  async findOne(id: number): Promise<ResultData> {
    const role = await this.roleRepo.findOne({ id })
    const roleMenuList = await this.roleMenuRepo.find({ where: { roleId: id } })
    return ResultData.ok({ ...role, ...roleMenuList })
  }

  async findList(dto: FindRoleListDto): Promise<ResultData> {
    const { page, size, name } = dto
    const where = {
      ...(name ? { name: Like(`%${name}%`) } : null),
    }
    const roleList = await this.roleRepo.find({ where, order: { id: 'DESC' }, skip: size * (page - 1), take: size })
    return ResultData.ok(roleList)
  }
}
