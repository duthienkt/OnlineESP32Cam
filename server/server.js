const net = require('net');
const express = require("express");
var mListener = null;
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  
  c.on('data', (c)=>{
      if (mListener){
          try{
              mListener(c);
          }
          catch(e){
              
          }
      }
      var matched = c.toString().match(/Content-Type:\s+image\/jpeg\r\nContent-Length: ([0-9]+)\r\n\r\n/);
        if (matched)
     console.log(matched[1]); 
  });
  
});
server.on('error', (err) => {
  throw err;
});
server.listen(8183, () => {
  console.log('server bound');
});


var app = express();

var PART_BOUNDARY = "123456789000000000000987654321";

app.use("/stream", function(req, res){
    res.writeHead(200,{
        'Content-Type': 'multipart/x-mixed-replace;boundary="' + PART_BOUNDARY + '"',
        'Connection': 'keep-alive',
        'Expires': 'Fri, 01 Jan 1990 00:00:00 GMT',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache'
    });
    res.write('--'+PART_BOUNDARY+'\n');
    mListener = (data)=>{
        res.write(data);
    }
    
});

app.listen(8184);