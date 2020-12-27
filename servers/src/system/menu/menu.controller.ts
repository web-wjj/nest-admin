import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateMenuDto } from './dto/create-menu.dto'

@ApiTags('菜单与菜单权限管理')
@Controller('menu')
export class MenuController {
  @Post()
  @ApiOperation({ summary: '创建菜单' })
  async create(@Body() dto: CreateMenuDto): Promise<string> {
    console.log(dto, 90)
    return ''
  }
}
