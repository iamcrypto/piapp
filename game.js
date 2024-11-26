game = new Chess();
var socket = io();
var color = "white";
var players;
var roomId;
var userNm;
var timerclk = null;
var play = true;
var room = document.getElementById("room")
var messagewrap = document.getElementById("messagewrap")
var timewrap = document.getElementById("timerWrap")
var user = document.getElementById("userName")
var roomNumber = document.getElementById("roomNumbers")
var roomuser = document.getElementById("roomuser")
var button = document.getElementById("button")
var state = document.getElementById('state')
var HroomNo = document.getElementById('roomNo')
var userid = document.getElementById('userId')
var ucolor = document.getElementById('ucolor')
var uName = document.getElementById('uName')
$('#divscore').hide();
$('#divover').hide();
var connect = function(){
    roomId = room.value;
    userNm = user.value;
    userNm = userNm[0].toUpperCase() + userNm.slice(1);
    if (roomId !== "" && parseInt(roomId) <= 100) {
        room.remove(); 
        HroomNo.value = roomId;
        roomNumber.innerHTML = "Room Number : " + roomId;
        roomuser.innerHTML = "UserName : " + userNm;
        uName.value = userNm;
        button.remove(); 
        user.remove();
        socket.emit('setUsername', userNm);
        socket.emit('joined', roomId);
    }
}
socket.on('userSet', function(data) {
    user = data.username;
    $('#divscore').show();
    messagewrap.innerHTML = '<input type = "text" id = "message">\
        <button type = "button" name = "button" onclick = "sendMessage()">Send</button>\
        <div class= "message_div"> <div id = "message-container"></div><div>';
 });

socket.on('full', function (msg) {
    if(roomId == msg)
        window.location.assign(window.location.href+ 'full.html');
});
socket.on('play', function (msg) {
    //msg.playerId
    var string1 = JSON.stringify(msg);
    var parsed = JSON.parse(string1); 
    if (msg.roomId == roomId) {
        play = false;
        timewrap.innerHTML = '<span id="minutes">00</span>:<span id="seconds">00</span>'; 
        var sec = 0;
        function pad ( val ) { return val > 9 ? val : "0" + val; }
        timerclk = setInterval( function(){
                    document.getElementById("seconds").innerHTML=pad(++sec%60);
                    document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
                }, 1000);
              
        state.innerHTML = "Game in Progress";      
    }
    // console.log(msg)
});

socket.on('move', function (msg) {
    if (msg.room == roomId) {
        game.move(msg.move);
        board.position(game.fen());
        console.log("moved")
        console.log(msg.room);
        if(msg.won ==1 )
        {
            var clr = document.getElementById('ucolor').value;
            state.innerHTML = 'GAME OVER';
            clearInterval(timerclk);
            console.log(clr);
            console.log(clr + "loose");
            var fuser = document.getElementById("uName").value;
            var uloc = document.getElementById('uLocation').value;
            var udate = document.getElementById('c_date').value;
            var player = $('#player').text();
            var playerno = player.match(/\d+/);
            $('#divover').show();
            $("#playsts").text("Loose");
            axios.post('/save', {
                user_Name: fuser,
                user_time: msg.stime,
                user_location:uloc,
                u_date: udate,
                user_status:  "Loose"
            }).then((response) => {
            }, (error) => {
                console.log(error);
            });
        }
    }
});

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function (square) {
    var squareEl = $('#board .square-' + square);
    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }
    squareEl.css('background', background);
};

var onDragStart = function (source, piece) {
    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    var clr = document.getElementById('ucolor').value;
    if(game.turn() == clr)
    {
        if (game.game_over() === true || play ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
            (game.turn() === 'w' && color === 'black') ||
            (game.turn() === 'b' && color === 'white') ) {                
                return false;
        }
    }
    // console.log({play, players});
};

var onDrop = function (source, target) {
    var clr = document.getElementById('ucolor').value;
    var wonparam = 0;
    var timespan = 0;
    if(game.turn() == clr)
    {
    removeGreySquares();
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    if (game.game_over()) {
        state.innerHTML = 'GAME OVER';
        clearInterval(timerclk);
        console.log(clr);
        console.log(clr + "won");
        var wonparam = 1;
        var fuser = document.getElementById("uName").value;
        var uloc = document.getElementById('uLocation').value;
        var udate = document.getElementById('c_date').value;
        var res = $('#timerWrap').text();
        var player = $('#player').text();
        var playerno = player.match(/\d+/);
        timespan = res;
        $('#divover').show();
        $("#playsts").text("Won");
        axios.post('/save', {
            user_Name: fuser,
            user_time: timespan,
            user_location:uloc,
            u_date: udate,
            user_status:  "Won"
        }).then((response) => {
        }, (error) => {
            console.log(error);
        });   
        socket.emit('gameOver', roomId);
    }
    // illegal move
    if (move === null) return 'snapback';
    else
        socket.emit('move', { move: move, board: game.fen(), room: roomId,won:wonparam,stime:timespan});
}
};

var onMouseoverSquare = function (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    });
    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }  
};

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
};

var onSnapEnd = function () {
    board.position(game.fen());
};


socket.on('player', (msg) => {
    var plno = document.getElementById('player')
    color = msg.color; 
    plno.innerHTML = 'Player ' + msg.players + " : " + color;
    players = msg.players;
    userid.value = msg.playerId;
    ucolor.value = msg.colorcode;
    if(players == 2){
        play = false;
        socket.emit('play', {roomId:msg.roomId,playerId:msg.playerId});
        timewrap.innerHTML = '<span id="minutes">00</span>:<span id="seconds">00</span>'; 
        var sec = 0;
        function pad ( val ) { return val > 9 ? val : "0" + val; }
        timerclk = setInterval( function(){
                        document.getElementById("seconds").innerHTML=pad(++sec%60);
                        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
                    }, 1000);
        
        state.innerHTML = "Game in Progress"
    }
    else        
        state.innerHTML = "Waiting for Second player"

    var cfg = {
        orientation: color,
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board', cfg);
});
function sendMessage() {
    var msg = document.getElementById('message').value;
    if(msg) {
       socket.emit('msg', {message: msg, user: userNm, roomNo:roomId});
    }
 }

 socket.on('newmsg', function(data) {
    if(userNm) {
        roomNoV = document.getElementById('roomNo').value;
        if(roomNoV.trim() == data.roomNo.trim() ){
            var msg = document.getElementById('message');
            msg.value = '';
            actMsg = data.message;
            actMsg = actMsg[0].toUpperCase() + actMsg.slice(1);
            var d1 = document.getElementById('message-container');
            d1.insertAdjacentHTML('afterend', '<div class="row"><b>' + data.user + '</b>: ' + actMsg + '</div>');
            }
        }
 })

// console.log(color)
var board;