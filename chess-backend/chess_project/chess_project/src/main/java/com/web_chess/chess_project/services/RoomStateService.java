package com.web_chess.chess_project.services;

import org.springframework.beans.factory.annotation.Autowired;

import com.corundumstudio.socketio.SocketIOServer;

public class RoomStateService {
    @Autowired
    private final SocketIOServer socketIOServer;

    public RoomStateService(SocketIOServer socketIOServer) {
        this.socketIOServer = socketIOServer;
    }

    public Integer isOtherClientConnected(String room) {
        return (this.socketIOServer.getRoomOperations(room).getClients().size() == 2 ? 1 : 0);
    }

}
