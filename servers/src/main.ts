import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  )

  // 设置 api 访问前缀
  app.setGlobalPrefix('/api')
  // web 安全，防常见漏洞
  app.use(helmet())

  const config = app.get(ConfigService)

  // sagger 配置 获取是否显示 swagger 文档
  if (config.get<boolean>('app.swagger')) {
    const swaggerOptions = new DocumentBuilder().setTitle('nest-admin App').setDescription('nest-admin App 接口文档').setVersion('2.0.0').addBearerAuth().build()
    const document = SwaggerModule.createDocument(app, swaggerOptions)
    SwaggerModule.setup('/api/docs', app, document)
  }

  // 防止跨站请求伪造
  // 设置 csrf 保存 csrfToken
  // app.use(csurf())

  // 全局验证
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  // 获取配置端口
  const port = config.get<number>('app.port') || 8080

  await app.listen(port)

  const appLocalPath = await app.getUrl()

  Logger.log(appLocalPath, '服务启动成功')
}

bootstrap()
