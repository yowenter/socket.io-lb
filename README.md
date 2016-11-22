# socket.io loadbalance example

This is the source code for a very simple chat example used for 
the [Getting Started](http://socket.io/get-started/chat/) guide 
of the Socket.IO website.

Please refer to it to learn how to run this application.




# Socket.IO 使用 Nginx 作负载均衡


众所周知， `Nginx ` 是高性能的开源 http 服务器，反向代理服务器。  
我们可以使用它来为 socket.io 应用 作负载均衡。  


## Get it ready :

首先安装 nginx 。
Mac 下可以使用 `brew` 。不过用brew 的 `nginx` 安装第三方模块，比如 `real_ip` 的module 比较麻烦，此处略去不提。   
建议使用 `Docker `容器，方便快捷。   


## Let's begin :

我们需要 使用 `nginx` 的 `stickey session` 的功能， 我们负载均衡 选择 `ip_hash` 。 

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


# 多节点的 消息同步 

我们 已经能够同时运行多个节点， 我们当然也希望 多个节点之间能够通信。 
我们可以更改 Socket.io 的默认转接器(Adapter) 。  
对于分布式的系统，我们可以使用 `Redis` 来做数据层 。  


我们首先要安装，
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














 