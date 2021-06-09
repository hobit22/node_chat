/**
	채팅
*/
const socket = io();
//console.log( socket );
/** Emitting, Listening, Room */
/*
socket.emit('chat', '테스트 채팅 메세지');
socket.on('chat', (arg) => {
	console.log(arg);
});
*/
const chat = {
	room : '',
	/**
		소켓 서버로 데이터 전송
		@param String message 전송할 메세지
	*/
	send : function (message, userNm) {
		const data ={			
			userNm : userNm,
			message : message,
		};
		socket.emit('chat', data);
	},
	scrollBottom : function(){
		const $li =$(".chat .contents li ");
		const h =$li.innerHeight();
		const st = h * $li.length;
		$(".chat .contents").scrollTop(st);
	},
}

$(function() {
	$(".chat #word").keyup(function(e) {
		if(e.keyCode == 13){
			const message =$(this).val().trim();
			if(message){
				chat.send(message);
				$(this).val();
			}
		}
	});
	
	socket.on('chat', (data) =>{
		let html = $("#chat_template").html();
		html = html.replace(/<%=message%>/g, data.message);
		$(".chat .contents").append(html);
		
		chat.scrollBottom();
	});
});
