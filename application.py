import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = "secreto"	#os.getenv("SECRET_KEY")
socketio = SocketIO(app)


#todo = {"users":["juan","jorel"] , "channels": ["pat 23",'pat24",]}

todo = {"users":["juanes"] , "channels": ["pat 23","pat 24","pat 25"]}
user = {"user"}

messages = {"channels":["pat 23","pat 24","pat 25"] , "messages": [[" channel 1 mesage 1","chanel 1 message 2 "],["channel 2 message 1","channel 2 message 2"],["channel 3 message 1","channel 3 message 2"]]}


@app.route("/")
def index():
	print("Hola")
	return render_template("main.html")
	

@socketio.on("add_user")
def inic(data):
    #selection = user#data["selection"]
    print( data['user'])
	
	#emit("announce vote", {"selection": selection}, broadcast=True)
	
@socketio.on("add_channel_server")
def new_chanenl(channel_name):
	if channel_name in messages["channels"]:
		emit("channel_repeated")
	else:
		messages["channels"].append(channel_name)
		new_ch_mess_list=[]
		messages["messages"].append(new_ch_mess_list)
		#selection = user#data["selection"]
		emit("load_channels",messages["channels"],broadcast=True)
		print( messages["channels"])
		print(messages["messages"])
	
	#emit("announce vote", {"selection": selection}, broadcast=True)	
	
'''
@socketio.on("submit_user")
def add_user(data):
	todo["user"][0] = data["user"]#data["selection"]
	
	#return render_template("main.html",user=votes['user'][0])
    #return votes['user'][0]
	#emit("announce vote", {"selection": selection}, broadcast=True)
'''

@socketio.on("user_loged")
def load_channels():
	print("user_loged")
	emit("load_channels",messages["channels"]) #broadcast=True)
	print("channels loaded")
	#votes['user'][0] = data['user']#data["selection"]
	#return render_template("main.html",user=data)
    #return votes['user'][0]
	#emit("announce vote", {"selection": selection}, broadcast=True)
	
	
@socketio.on("recv_message_server") # recibe un diccionario con el mensaje y el canal al q pertenece un mensaje
def send_message_all(data):
	index_messages = messages["channels"].index(data["channel"])
	
	if len(messages["messages"][index_messages])==100:
		messages["messages"][index_messages].pop(0)
		
	messages["messages"][index_messages].append(data["message"])
	print(messages["messages"][index_messages])
	emit("show_messages",messages["messages"][index_messages],broadcast=True) 
	#votes['user'][0] = data['user']#data["selection"]
	#return render_template("main.html",user=data)
    #return votes['user'][0]
	#emit("announce vote", {"selection": selection}, broadcast=True)
	
@socketio.on("load_messages_channel_server") #recibe el nombre del canal
def update_msg_ch(channel_selected):
	print(channel_selected)
	index_messages = messages["channels"].index(channel_selected)
	#messages_channel = messages["messages"][index_messages] #list of the messages of a channel
	emit('show_messages',messages["messages"][index_messages]) #pasamos una lista de mensajes del canal


@socketio.on('prueba')
def prueba(data):
	print("cierre capturado",data)

@socketio.on("delete_channel_server")
def delete_channel(name):
	index_todelete = messages["channels"].index(name)
	messages["channels"].pop(index_todelete)
	messages["messages"].pop(index_todelete)
	print(f"{name} deleted")
	emit("load_channels",messages["channels"],broadcast=True)
	print("channels loaded")
	print (messages["channels"])
	print(messages["messages"])
	
if __name__ == "__main__":
    socketio.run(app)