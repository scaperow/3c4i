# douyincloud-nodejs-koa-demo
本项目是抖音云平台基于 Nodejs [koa](https://koajs.com/) 框架的开发模版，模版通过使用 Redis 和 MongoDB 实现了简单的 hello-world 功能。\
抖音云平台支持基于 Git 代码和 Docker 镜像部署两种方式。其中，Dockerfile 文件可以参考本项目中的 Dockerfile 文件。
部署在抖音云平台的服务日志需要重定向到标准输出，并在抖音云平台日志功能中查看。

## 目录结构
~~~
.
├── Dockerfile              Dockerfile文件
├── Readme.md               Readme文件
├── src                     源码目录
│ ├── server.ts             应用入口文件
├── run.sh                  容器运行时启动文件
├── package.json            npm 包管理文件
~~~

## 请求方法
前往抖音云托管平台「调试」功能界面，进行请求调试。

## API说明
### `POST /api/set_data_to_redis?key=test`
调用 redis 组件设置数据，其中 key 通过 query 传递，value 在 HTTP request body中传递
### 请求参数
- `value`:`string` 写入redis的数据


### 响应结果
```json
{
    "success": true,
}
```

### `GET /api/get_data_from_redis?key=test`
调用 redis 组件获取 value
### 请求参数
- `key`:`string` redis key

### 响应结果
```json
{
    "success": true,
    "data": "",
}
```

### `POST /api/set_data_to_mongodb?name=test`
调用 mongodb 组件写入数据
### 请求参数
- `name`:`string` 写入mongodb的数据


### 响应结果
```json
{
    "success": true,
}
```

### `GET /api/get_data_from_mongodb?name=test`
调用 mongodb 组件获取数据
### 请求参数
- `name`:`string` 

### 响应结果
```json
{
    "success": true,
    "data": {},
}
```

### 组件使用注意事项
在抖音云托管平台上启用组件后，抖音云平台会自动将组件的地址，账号，密码以环境变量的方式注入到容器中。\
以Redis为例，在抖音云托管平台启用Redis组件后，平台会生成 `REDIS_ADDRESS`，`REDIS_USERNAME`，`REDIS_PASSWORD`三个环境变量，在业务代码中可以使用如下代码获取相应值。
```js
	const redisAddr = process.env.REDIS_ADDRESS;
	const redisUserName = process.env.REDIS_USERNAME;
	const redisPassword = process.env.REDIS_PASSWORD; 
```

## License

This project is licensed under the [Apache-2.0 License](LICENSE).



<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
