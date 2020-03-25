const net = require('net')

const server = net.createServer(function(socket) {
  /* 获取地址信息 */
  var address = server.address();
  var message = "the server address is"+JSON.stringify(address);

  socket.write(message,function(){
    var writeSize = socket.bytesWritten;
    console.log(message + "has send");
    console.log("the size of message is"+writeSize);
  })
})

server.on('connection', socket => {
  /* 监听data事件 */
  socket.on('data',function(data){
    console.log(data.toString());
    console.log(Buffer.isBuffer(data))
  })
})

server.listen(8000, function() {
  var address = server.address()

  console.log(address)
});


