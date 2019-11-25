//Author : Jordan Montenegro


document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
	//'http://127.0.0.1:5000'
	//console.log(socket)


	function ingresa_user() {
		console.log("funcion ingresa user")
		document.querySelector('#register_user').onclick = () => {
			var user1 = document.querySelector('#user_name').value 
			//console.log(user1);
			localStorage.setItem('user', user1);
			//alert(user1);
			//socket.emit('submit_user', {'user': user1});
		};
	};
	
	function get_date(){
		var d = new Date();
		var minute = d.getMinutes().toString();
		var mesok = (minute < 10) ? '0' + minute : minute;
		var hora = d.getHours().toString() + ":" + mesok;  //hora en formato : hh:mm
		return hora;
	};
	
	
	function printprueba(){
		alert("boton pulsado");
	};
	
	function add_new_channel(channel){
		
	};

	function add_message(message) {
		//console.log(user1)
		document.querySelector('#send_button').onclick = () => {
			//console.log(user1);
			//localStorage.setItem('user', user1);
			//alert(user1);
		socket.emit('recv_message_server', {"user": user1,"message":message});
		};
	//return False;
	};
	
	function select_channel(){

	};


socket.on('connect', () => {
	//console.log("Connected")
	//socket.emit('saludar', {'saludo': "I connected!"});
	var user = localStorage.getItem('user');
	
	if (user === null){
		document.querySelector('#channel_button').disabled=true;
		document.querySelector('#channel_name').disabled=true;
		document.querySelector('#message').disabled=true;
		document.querySelector('#send_button').disabled=true;
		document.querySelector('#listofchannels').disabled=true;
		alert("Enter a username");
		document.querySelector('#register_user').onclick = () => {
			var user1 = document.querySelector('#user_name').value 
			//console.log(user1);
			localStorage.setItem('user', user1);
			//alert(user1);
			//socket.emit('submit_user', {'user': user1});
			var user1 = localStorage.getItem('user');
			document.querySelector('h2').innerHTML="Welcome " + user1;
			document.querySelector('#register_user').disabled=true;
			document.querySelector('#user_name').disabled=true;
			socket.emit('user_loged');
		};
		
		//ingresa_user();
		
	}
	else {
		//user2=localStorage.getItem('user');
		var l_channel = localStorage.getItem('last_channel');
		if (l_channel!=null){
			var combo5 = document.querySelector("#listofchannels");
			//combo5.selectedIndex = l_channel;
			var cantidad = combo5.length;
			for (i = 0; i < cantidad; i++) {
				var x = Number(l_channel);
				console.log(x);
				if (i == x) {
					console.log(i);
					combo5[i].selected = true;
				}   
			}
		
			
			//combo5.options[combo5.selectedIndex].text = l_channel;
		};
		document.querySelector('#register_user').disabled=true;
		document.querySelector('#user_name').value=user;
		document.querySelector('#user_name').disabled=true;
		document.querySelector('h2').innerHTML="Welcome again " + user;
	
		
		socket.emit('user_loged');
	}
});

/*
socket.on('create_channel', () =>  { //emite el nombre del nuevo canal
			document.querySelector('#channel_button').onclick = () => {
			document.querySelector('#channel_name').disabled=true;	
			console.log("New channel to be created");
			var new_channel = document.querySelector('#channel_name').value ;
			console.log(new_channel);
			socket.emit('add_channel_server',new_channel);	
		};
});
*/
socket.on('load_channels', (channels_list) => {
	document.querySelector('#channel_button').disabled=false;
		document.querySelector('#channel_name').disabled=false;
		document.querySelector('#message').disabled=false;
		document.querySelector('#send_button').disabled=false;
		document.querySelector('#listofchannels').disabled=false;
		
    document.querySelector("#listofchannels").innerHTML = "";
	document.querySelector("#listofmessages").innerHTML = "";
	var option = document.createElement('option');
    var x = document.querySelector('#listofchannels');
	for (let i=0;i < channels_list.length;i++) {
		var option = document.createElement('option');
		option.text = channels_list[i];
		//option.innerHTML = channel;
		//document.querySelector('#listofchannels').append(option);
		x.add(option);
	}
	console.log("channels loaded");
	
	console.log("pruebba enviada");
});

socket.on('channel_repeated', () => {
	document.querySelector('#channel_name').value="";
	alert("That channel already exists. Pick another name");

});
	

document.querySelector('#channel_button').onclick = () => { //aqui creamos un canal nuevvo
	//document.querySelector('#channel_name').disabled=true;	
	//console.log("New channel to be created");
	var new_channel = document.querySelector('#channel_name').value ;
	console.log(new_channel);
	socket.emit('add_channel_server',new_channel);	//envia el nombre del canal nuevo
	//console.log("New channel created");
	//console.log("New channel added");
};

document.querySelector('#delete_button').onclick = () => { //aqui eliminamos el canal
	//document.querySelector('#channel_name').disabled=true;	
	//console.log("New channel to be created");
	
	var combo6 = document.querySelector("#listofchannels");
	var channel_selected3 = combo6.options[combo6.selectedIndex].text;
	
	socket.emit('delete_channel_server',channel_selected3);	//envia el nombre del canal a eliminar 
	//console.log("New channel created");
	//console.log("New channel added");
};

document.querySelector('#reset_button').onclick = () => { //aqui reseteamos el ususario
	localStorage.clear();
}



document.querySelector('#listofchannels').onchange = () => {
	console.log("change of selector detected");
	var combo = document.querySelector("#listofchannels");
	var selected = combo.options[combo.selectedIndex].text; // nombre del canala elegrido
	socket.emit('load_messages_channel_server',selected);  //envia el nombre del canal elegido
};

document.querySelector('#send_button').onclick = () => {
	if (document.querySelector('#message').value.length > 0){
		var user3 = document.querySelector('#user_name').value; 
		let hora = get_date();
		let msg_sent = user3 + +' ('+hora+') : '+ document.querySelector('#message').value;
		var combo1 = document.querySelector("#listofchannels");
		var channel_selected = combo1.options[combo1.selectedIndex].text;
		socket.emit('recv_message_server',{"channel": channel_selected ,"message" :user3  + ' at ('+ hora +') : '+ document.querySelector('#message').value});
	}
	else{
		alert("Message must have at least one character.");
	}
};
	

document.querySelector('body').onbeforeunload = () => {
	var combo2 = document.querySelector("#listofchannels");
	var selected4 = combo2.selectedIndex // indice del canal elegido
	
	localStorage.setItem('last_channel',selected4);
	socket.emit('prueba',selected4);
}

socket.on('add use', () => {

	
});	

socket.on('sesad',() =>{
		var d = new Date();

		var minute = d.getMinutes().toString();
		var mesok = (minute < 10) ? '0' + minute : minute;
		var hora = d.getHours().toString() + ":" + mesok;  //hora en formato : hh:mm
		
		var message1 = document.querySelector('#message').value ;
		add_message(message1);
	socket.emit ('recv_message_server',)
});

socket.on('update_messages', data => {
        
    });


socket.on('request_messages_channel_user', () => { //envia la solicitu para recibir mensajes de un channel
		
});


socket.on('show_messages', (messages_list) => {
	document.querySelector("#listofmessages").innerHTML = "";
	var x = document.querySelector('#listofmessages');
	//console.log("now let us charge the list");
	//console.log(messages_list[0]);
	for (message of messages_list){
		//console.log(message);
		var new_message = document.createElement('li');
		new_message.innerHTML = message;
		//option.innerHTML = channel;
		//console.log(new_message)
		document.querySelector('#listofmessages').append(new_message);	
	}


});

});
