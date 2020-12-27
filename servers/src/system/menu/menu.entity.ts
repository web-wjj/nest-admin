import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { MenuPermEntity } from './menu-perm.entity'

@Entity('sys_menu')
export class MenuEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  public id: number

  @Column({ name: 'parent_id' })
  @ApiProperty({ description: '父级菜单id' })
  public parentId: number

  @Column({ type: 'varchar', length: 30, comment: '菜单名称' })
  @ApiProperty({ description: '菜单名称' })
  public name: string

  @Column({ type: 'varchar', length: 50, comment: '菜单/按钮唯一标识，由前端路由name,用于控制菜单按钮显隐' })
  @ApiProperty({ description: '菜单/按钮唯一标识,有前端定义,用于控制菜单按钮显隐' })
  public code: string

  @Column({ type: 'int', comment: '菜单类型， 1-菜单/目录 2-tabs 3-按钮' })
  @ApiProperty({ description: '菜单类型, 1-菜单 2-tabs 3-按钮' })
  public type: 1 | 2 | 3

  @Column({ name: 'order_num', type: 'int', comment: '排序', default: 0 })
  @ApiProperty({ description: '排序' })
  public orderNum: number

  @OneToMany(() => MenuPermEntity, (menuPerm) => menuPerm.menu)
  @ApiProperty({ description: '菜单路由权限' })
  public menuPerms: MenuPermEntity[]
}
