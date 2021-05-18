var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});
const port = new SerialPort('COM1',{
    baudRate: 115200
});
port.pipe(parser);

app.get('/' , function(req, res){
    res.sendFile(__dirname+'/index.html');
});

io.on('connection',function(socket){
    socket.on('message',function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
        port.write(msg+'\n', (err, results) => {
            if(err) {
                console.log('Err: '+err);
                console.log('Results: '+results);
            }
        });
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});

port.on('open', () => {
    console.log('port open');
});

parser.on('data', (data) => {
    console.log(data);
});