package com.web_chess.chess_project.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web_chess.chess_project.enums.Turn;
import com.web_chess.chess_project.game_logic.Castling;
import com.web_chess.chess_project.game_logic.Game;
import com.web_chess.chess_project.game_logic.GameService;
import com.web_chess.chess_project.repositories.GameRepository;
import com.web_chess.chess_project.util.RandomString;
import com.web_chess.chess_project.web_socket.SocketService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class GameAPI {
    @Autowired
    private RandomString randomString;
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private GameService gameService;
    @Autowired
    private SocketService socketService;
    @PostMapping(path="/create_game")
    public Map<String,String> createGame(@RequestBody String color) throws JsonProcessingException
    {
        Map<String, String> response = new HashMap<>();
        String roomId = randomString.getRandomString(10);
        while (gameRepository.findByRoomId(roomId) != null) {
            roomId = randomString.getRandomString(10);
        }
        Game game = new Game(roomId);
        game.setWhitePieces(this.gameService.getInitialWhitePieces());
        game.setBlackPieces(this.gameService.getInitialBlackPieces());
        Game savedGame = this.gameRepository.save(game);
        response.put("game_id", savedGame.getGameId().toString());
        response.put("room_id", roomId);
        response.put("color", color);
        return response;
    }

    @PostMapping(path ="/is_room_present")
    public Map<String, String> isRoomPresent(@RequestBody String room) {
        Map<String, String> map = new HashMap<>();
        Game game = this.gameRepository.findByRoomId(room);
        map.put("is_room_present",game==null?"false":"true");
        return map;
    }

    @PostMapping(path ="/num_clients")
    public Map<String, String> numClientsConnected(@RequestBody String room) {
        Map<String, String> map = new HashMap<>();
        map.put("num_clients",this.socketService.numClientsConnected(room).toString());
        return map;
    }

    @PostMapping(path ="/castling")
    public String turn(@RequestBody CastlingRequestData req) throws JsonProcessingException{
        Map<String, Object> map = new HashMap<>();
        Game game = this.gameRepository.findByRoomId(req.getRoom());
        String color = req.getColor();
        Castling castling = game.getCastling();
        if(color.equals("white"))
        {
            map.put("king",castling.getWhiteKingMove());
            map.put("kingRook",castling.getWhiteRookKingSide());
            map.put("queenRook",castling.getWhiteRookQueenSide());
        }
        else
        {
            map.put("king",castling.getBlackKingMove());
            map.put("kingRook",castling.getBlackRookKingSide());
            map.put("queenRook",castling.getBlackRookQueenSide());
        }
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(map);
    }
}
