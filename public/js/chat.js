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
	userNm : "",
	/**
		페이지 접속 시 방이름, 사용자 설정
	*/
	init : function(){
		//location.search 에 qs 들어가있음
		let qs = {};
		location.search.replace("?", '')
							.split('&')
							.map((v)=>{
								v=v.split('=');
								v[1] = decodeURIComponent(v[1]);
								qs[v[0]] = v[1];
							});
		this.room = qs.room || 'lobby';
		this.userNm = qs.userNm || new Date().getTime();
		socket.emit('join', this.room);
	},
	/**
		소켓 서버로 데이터 전송
		@param String message 전송할 메세지
	*/
	send : function (message) {
		const data ={			
			room: this.room,
			userNm : this.userNm,
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

// 페이지 접속시 초기화
chat.init();

$(function() {
	$(".chat #word").keyup(function(e) {
		if(e.keyCode == 13){
			const message =$(this).val().trim();
			if(message){
				chat.send(message);
				$(this).val('');
			}
		}
	});
	
	socket.on('chat', (data) =>{
		let html = $("#chat_template").html();
		
		let addClass='other';
		if( data.userNm == chat.userNm ){
			addClass = 'mine';
		}
		html = html.replace(/<%=addClass%>/g, addClass);
		html = html.replace(/<%=userNm%>/g,data.userNm);
		html = html.replace(/<%=message%>/g, data.message);
		
		
		$(".chat .contents").append(html);
		
		chat.scrollBottom();
	});
});
