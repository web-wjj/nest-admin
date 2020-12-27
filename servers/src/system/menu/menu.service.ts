import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { ResultData } from '../../common/utils/result'

import { MenuEntity } from './menu.entity'
import { MenuPermEntity } from './menu-perm.entity'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepo: Repository<MenuEntity>,
    @InjectRepository(MenuPermEntity)
    private readonly menuPerm: Repository<MenuPermEntity>,
  ) {}

  // create menu(): Promise<ResultData> {}
}
