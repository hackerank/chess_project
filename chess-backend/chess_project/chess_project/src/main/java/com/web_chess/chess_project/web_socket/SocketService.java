package com.web_chess.chess_project.web_socket;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.web_chess.chess_project.game_logic.Piece;

@Service
public class SocketService {
    @Autowired
    private final SocketIOServer socketIOServer;

    public SocketService(SocketIOServer socketIOServer)
    {
        this.socketIOServer = socketIOServer;
    }
    public void sendMessage(String room, String eventName, String msg,SocketIOClient excludedClient) {
        this.socketIOServer.getRoomOperations(room).sendEvent(eventName,excludedClient, msg);
    }
    // public void sendMessageToClient(UUID clientId, String message) {
    //     socketIOServer.getClient(clientId).sendEvent("message", message);
    // }
    public void sendMessageToRoom(String room, String eventName, String msg) {
        this.socketIOServer.getRoomOperations(room).sendEvent(eventName, msg);
    }
    public Integer numClientsConnected(String room)
    {
       return this.socketIOServer.getRoomOperations(room).getClients().size();
    }
}
