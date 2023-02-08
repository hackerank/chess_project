package com.web_chess.chess_project.web_socket;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.corundumstudio.socketio.SocketIOServer;

import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin
@Configuration
public class SocketIOConfig {

	@Value("${socket-server.host}")
	private String SOCKETHOST;
	@Value("${socket-server.port}")
	private int SOCKETPORT;

    @Bean
	public SocketIOServer socketIOServer(){
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname(SOCKETHOST);
        config.setPort(SOCKETPORT);
        return new SocketIOServer(config);
    }

}
