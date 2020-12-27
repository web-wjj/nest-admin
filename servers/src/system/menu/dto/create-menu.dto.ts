import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsNumber, IsString, Min } from 'class-validator'

export class CreateMenuDto {
  @ApiProperty({ description: '父级菜单' })
  @IsNumber()
  readonly parentId: number

  @ApiProperty({ description: '菜单名称' })
  @IsString()
  readonly name: string

  @ApiProperty({ description: '菜单唯一标识，前端控制页面显隐' })
  @IsString()
  readonly code: string

  @ApiProperty({ description: '菜单类型 1-菜单/目录 2-tabs 3-按钮' })
  @IsNumber({}, { message: 'type 类型错误' })
  @IsIn([1, 2, 3], { message: '菜单类型错误，菜单类型 1-菜单/目录 2-tabs 3-按钮' })
  readonly type: 1 | 2 | 3

  @ApiProperty({ description: '排序', required: false })
  @IsNumber({}, { message: '排序传值错误' })
  @Min(0)
  readonly orderNum: number

  @ApiProperty({ description: '菜单接口路径权限' })
  @IsArray({ each: true, message: '菜单权限是数组格式' })
  @IsString({ each: true, message: '菜单' })
  readonly menuPermList: string[]
}
