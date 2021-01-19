import { Injectable } from '@nestjs/common'
import { getConnection } from 'typeorm'

@Injectable()
export class PermService {
  async findUserPerms(userId: number) {
    const perms = await getConnection()
      .createQueryBuilder()
      .select()
      .from('sys_user_role', 'ur')
      .leftJoinAndSelect('sys_role_menu', 'rm', 'ur.role_id = rm.role_id')
      .leftJoinAndSelect('sys_menu_perm', 'mp', 'rm.menu_id = m.menu_id')
      .where('ur.user_id = :userId', { userId })
    return perms
  }

  async findUserMenus(userId: number) {
    const menus = await getConnection()
      .createQueryBuilder()
      .select()
      .from('sys_user_role', 'ur')
      .leftJoinAndSelect('sys_role_menu', 'rm', 'ur.role_id = rm.role_id')
      .leftJoinAndSelect('sys_menu', 'm', 'rm.menu_id = m.id')
      .where('ur.user_id = :userId', { userId })
    return menus
  }
}
