import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('sys_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ type: 'varchar', length: 200, nullable: false, comment: '用户登录密码' })
  public password: string

  @Column({ type: 'varchar', length: 32, comment: '用户登录账号' })
  public account: string

  @Column({ type: 'varchar', name: 'phone_num', length: 20, comment: '用户手机号码' })
  public phoneNum: string

  @Column({ type: 'varchar', comment: '邮箱地址' })
  public email: string

  @Column({ type: 'tinyint', default: 1, comment: '所属状态: 1-有效，0-禁用' })
  public status: number

  @Column({ type: 'varchar', comment: '头像地址' })
  public avatar: string

  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'update_date', comment: '更新时间' })
  updateData: Date
}
