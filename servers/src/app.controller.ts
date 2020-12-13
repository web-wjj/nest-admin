import { Controller, Get, Req } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Router, Request } from 'express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly config: ConfigService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('ser/:id')
  getSer(@Req() req: Request): string[] {
    const router = req.app._router as Router
    const routes = router.stack
      .map((layer) => {
        if (layer.route) {
          const path = layer.route?.path
          const method = layer.route?.stack[0].method
          return `${method.toUpperCase()} ${path}`
        }
      })
      .filter((v) => !!v)
    console.log(this.config.get('db.mysql'))
    return routes
    //return '90'
  }
}
