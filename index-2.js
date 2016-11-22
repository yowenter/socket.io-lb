var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('socket.io-redis');
var redisConfig = {
      host: 'localhost',
      port: 6379
    };
// var emitter = require('socket.io-emitter')(redisConfig);

io.adapter(redis(redisConfig));


app.get('/', function(req, res){
 var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("new client ",ip);
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('server receive chat message', function(msg){
    io.emit('server send chat message', msg);
  });
});


// use api to send messages .
app.post('/message',function(req,res){
	room = 'connection' ;

	var message = req.query['message'];
	console.log("api new message", message);
	io.emit("server send chat message", message);
	res.status(200).json({"message_result":message});

});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
