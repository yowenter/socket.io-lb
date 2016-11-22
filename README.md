# socket.io load balance example

The code  was copied from [Socket.io Chat Example](https://github.com/rauchg/chat-example)




# Socket.IO 使用 Nginx 作负载均衡


`Nginx` 是高性能 的 http 反向代理服务器。  
使用 `Nginx` 作负载均衡最好不过。  


## Get it ready

安装 `nginx` 
Mac 下可以使用 `brew` 。    
不过用brew 的 `nginx` 安装第三方模块，比如 `real_ip` 的module 比较麻烦，此处略去不提。建议使用 `Docker `容器，方便快捷。   


## How to do it  

利 用 `nginx` 的 `ip_hash` 来确保 socket 握手成功 。 

以下是 配置文件：

```


server {
    server_name _ ;
    listen 80;
    set_real_ip_from 0.0.0.0/0;
    real_ip_header    X-Forwarded-For;
    real_ip_recursive on;
    ＃使用 头部 的 ip 进行hash 

    location /  {
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_pass http://io_nodes;
    }
}


upstream io_nodes {
   ip_hash;
   server 192.168.1.7:3000;
   server 192.168.1.7:3001;
   # 本地起的 两个 socket.io 聊天室应用 。 
}

```

nginx 的 yml 配置文件：

```

version: "2"
services:
  loadbalance:
    image: nginx:1.9
    volumes:
    - /root/nginx.conf:/etc/nginx/conf.d/nginx.conf:ro
    - /root/nginx-base.conf:/etc/nginx/nginx.conf:ro
    ports:
    - 9000:80

```   

在 nginx 目录下已经有 `nginx.yml` , 可以 `docker-compose -f nginx.yml up -d ` 一键部署。 

# 多节点的 消息同步 

我们已经能够同时运行多个节点，当然也希望 多个节点之间能够通信。 
通过更改 Socket.io 的默认内存转接器(Memory based Adapter) 。  
在此，我们可以使用 `socket.io-redis`, 将数据存储在 `Redis`里 。   

请确保已经安装依赖：

`npm install socket.io-redis`   

以下是示例：

```

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('socket.io-redis');
var redisConfig = {
      host: 'localhost',
      port: 6379
    };

io.adapter(redis(redisConfig));


```


经过以上步骤，我们就得到了一个高性能的 socket.io 聊天室应用了 。
你可以运行 该 repo 的 代码尝试一下。 














 