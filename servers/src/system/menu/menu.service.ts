import { HttpStatus, Injectable } from '@nestjs/common'
import { getManager, Repository, Transaction } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { ResultData } from '../../common/utils/result'

import { MenuEntity } from './menu.entity'
import { MenuPermEntity } from './menu-perm.entity'
import { CreateMenuDto } from './dto/create-menu.dto'

import { plainToClass } from 'class-transformer'
import { UpdateMenuPermDto } from './dto/update-menu-perm.dto'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepo: Repository<MenuEntity>,
    @InjectRepository(MenuPermEntity)
    private readonly menuPermRepo: Repository<MenuPermEntity>,
  ) {}

  async create(dto: CreateMenuDto): Promise<ResultData> {
    if (dto.parentId !== 0) {
      // 查询当前父级菜单是否存在
      const parentMenu = await this.menuRepo.findOne({ id: dto.parentId })
      if (!parentMenu) return ResultData.fail(HttpStatus.NOT_FOUND, '当前父级菜单不存在，请调整后重新添加')
    }
    await getManager().transaction(async (transactionalEntityManager) => {
      const menu = await transactionalEntityManager.save(plainToClass(MenuEntity, dto))
      await transactionalEntityManager.save(
        dto.menuPermList.map((perm) => {
          return { menuId: menu.id, ...perm }
        }),
      )
    })
    return ResultData.ok()
  }

  async findAllMenu(): Promise<ResultData> {
    const menuList = await this.menuRepo.find()
    return ResultData.ok(menuList)
  }

  async deleteMenu(id: number): Promise<ResultData> {
    await this.menuPermRepo.delete({ menuId: id })
    const result = await this.menuRepo.delete({ id })
    return ResultData.ok(result, '删除成功')
  }

  async findMenuPerms(menuId: number): Promise<ResultData> {
    const menuPerms = await this.menuPermRepo.find({ where: { menuId } })
    return ResultData.ok(menuPerms)
  }

  async updateMenuPerm(dto: UpdateMenuPermDto): Promise<ResultData> {
    await this.menuPermRepo.delete({ menuId: dto.menuId })
    await this.menuPermRepo.save(
      dto.menuPerms.map((perm) => {
        return { menuId: dto.menuId, perm }
      }),
    )
    return ResultData.ok()
  }
}
