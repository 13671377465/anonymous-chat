# anonymous-chat

### 项目地址：![艾希匿名聊天](http://www.eastcity.top/anony/)

### 安装使用：
```node
npm install
npm run build
pm2 start app.js --name Aici
```

### 技术架构：
+ 前端框架：React
+ 后端框架：koa2
+ 数据操作：sequelize
+ WebSocket：ws
+ 资源管理：webpack

### 技术实现：
+ 开发以及生产环境使用webpack进行部署，由于手机与电脑端的组件逻辑有较大差别，所以在dist目录输出手机以及电脑版的页面
+ 前台页面部分由于UI状态比较复杂所以使用React管理页面渲染和状态同步
+ 请求页面时在服务端根据useragent判断来自手机或电脑，以此返回不同页面，并根据时间戳持久化
+ 点击开始匹配按钮时发送ajax请求，服务器接到请求返回101并创建WebSocket连接
+ React组件是根据WebSocket消息中人数的信息的不同切换匹配前、匹配中、匹配后的页面状态
