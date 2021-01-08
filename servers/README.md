## nestjs 框架

 Nest 从请求的纬度上讲将应用代码逻辑氛围三种 控制器（Controller）, 提供者 （Provider）, 中间件 （Middleware）。而从功能纬度上讲，将应用分割为若干模块（Module）, 并通过 exports 等方式向其他模块提供自己的内部服务。

#### 先从控制器这个概念入手

控制器概念这个太常见了， NestNest 中也大同小异，而且 Nest 中的做法和 SpringMVC 中做法几乎一样


```
@Controller('user')
export class UserController {}
```

我们通过 ```@Controller``` 装饰类， 并通过以下方式

```
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'

@Module({
    controllers: [UserController]
})
export class AppModule {}
```

注册到 App 模块中，那么应用中就有一个 User 控制器，现在我们可以为控制器编写业务代码：

```
import { Controller, Get, Req, Query, Headers, Param, Post } from '@nestjs/common'

@Controller('user')
export class UserController {

    @Get('')
    findAll(@Req req, @Query query, @Headers() headers) {
        return [query, headers]
    }

    @Get(':id')
    findOne(@Param() params) {
        return params
    }

}
```

控制器端点的设计也基本上照搬了 SpringMVC 的设计，同样利用 ```@Get``` 、``` @Post ```、 ```@Put```、 ```@Delete``` 等 代表当前方法对应什么请求方法和请求路径。而且还可以通过参数装饰器装饰各种参数，例如 用```@Req``` 装饰 req , 用 ```@Query``` 装饰 query （查询参数）等，这样的好处显而易见，参数可以随意排列，不必担心传错参数。

不过 Nest 不仅仅利用了装饰器，其实它底层是基于 Express 的，我们也可以利用 Express 结合上述模式来满足我们的要求。例如 上述代码我们其实是很难更改 http status ， 我们可以利用 Express 的 res 参数修改：

```
import { Body, Controller, Get, Req, Query, Headers, Param, Post, Put, Res, HttpStatus } from '@nestjs/common'

@Controller('user')
export class UserController {

    @Get('')
    findAll(@Req req, @Query query, @Headers() headers) {
        return [query, headers]
    }

    @Get(':id')
    findOne(@Param() params) {
        return params
    }


    @Put()
    update(@Body() updateUserDto: UpdateUserDto, @Res() res) {
        res.status(HttpStatus.UNAUTHORIZED).send()
    }

}
```

#### Provider 是个大概念

Service 、 Repository 、Factory 都可以被认为是 Provider 。 所有 Provider 都是可注入的组件， 以 Service 为例

```
import { Injectable } from '@nestjs/common'
import User from './interfaces/user'
import UpdateUserDto from './dto/update-user.dto'

@Injectable()
export class UserService {
    private readonly users: User[] => []

    create (user: User): void {
        this.users.push(user)
    }

    findAll (): User[] {
        return users
    }

    update (index: number, userInfo: UpdateUserDto): User {
        this.users[index] = userInfo
        return this.users[index]
    }
}
```

我们通过 ```@Injectable``` 将其标记为 Provider, 现在你可以将 UserService 注入到任意的 Controller ， 任意 Service 中，以之前的 UserController 为例：

```
import { Body, Controller, Get, Req, Query, Headers, Param, Post, Put, Res, HttpStatus } from '@nestjs/common'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('')
    findAll(@Req req, @Query query, @Headers() headers) {
        return [query, headers]
    }

    @Get(':id')
    findOne(@Param() params) {
        return params
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
       this.userService.create(dto)
    }

    @Put()
    update(@Body() updateUserDto: UpdateUserDto, @Res() res) {
        res.status(HttpStatus.UNAUTHORIZED).send()
    }

}
```

我们通过 Controller 的方式为控制器注入了 UserService 。 说明 Nest 是一个拥有控制反转能力的框架。

#### Nest 将 Express 中的 Middleware 细化了

除了可以添加 Middleware , Nest 还可以添加 Filter（过滤器）、 Pipe （管道）、Guard（守卫）、Interceptor（拦截器），很明显这些概念均出现在请求处理之前及请求响应之后，那么它们在 Nest 中分别有什么用？ 基于什么目的，Nest 要造这么多概念？

Middleware 的用法 Nest 做了一层封装，但是很明显根本方法没有变化，都是一个 MiddlewareFunction ：

```
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('log', true)

    resolve(...args: any[]): MiddlewareFunction {
        this.logger.log('Request...')
        next()
    }
}
```
