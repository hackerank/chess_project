package com.web_chess.chess_project.web_socket;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web_chess.chess_project.enums.GameState;
import com.web_chess.chess_project.enums.Turn;
import com.web_chess.chess_project.game_logic.Game;
import com.web_chess.chess_project.game_logic.Castling;
import com.web_chess.chess_project.game_logic.GameService;
import com.web_chess.chess_project.game_logic.Piece;
import com.web_chess.chess_project.game_logic.PieceInfoConverter;

import jakarta.transaction.Transactional;

@Component
@Transactional
public class SocketModule {

    @Autowired
    private final SocketIOServer server;

    @Autowired
    private final SocketService socketService;

    @Autowired
    private final GameService gameService;

    @Autowired
    private final PieceInfoConverter pieceInfoConverter;

    @Autowired
    private PlatformTransactionManager transactionManager;

    public SocketModule(SocketIOServer server,
            SocketService socketService,GameService gameService,PieceInfoConverter pieceInfoConverter) {
        this.server = server;
        this.socketService = socketService;
        this.gameService = gameService;
        this.pieceInfoConverter = pieceInfoConverter;
        server.addEventListener("newMoveToServer", String.class, onNewMoveEvent());
        server.addEventListener("joinRoomEvent", String.class, onJoinRoomEvent());
        server.addEventListener("leaveRoomEvent", String.class, onLeaveRoomEvent());
        server.addEventListener("startGameEvent", String.class, onStartGameEvent());
        server.addEventListener("stalemate", String.class, onStalemate());
        server.addEventListener("checkmate", String.class, onCheckmate());
        server.addEventListener("kingMove", String.class, onKingMove());
        server.addEventListener("kingRookMove", String.class, onKingRookMove());
        server.addEventListener("queenRookMove", String.class, onQueenRookMove());
    }

    private DataListener<String> onKingMove() {
        return (senderClient, data, ack) -> {
            DefaultTransactionDefinition def = new DefaultTransactionDefinition();

            def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

            TransactionStatus status = transactionManager.getTransaction(def);
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode jsonNode = mapper.readTree(data);
                String room = jsonNode.get("room").textValue();
                String color = jsonNode.get("color").textValue();
                Game game = this.gameService.findByRoomId(room);
                Castling castling = game.getCastling();
                if (color.equals("white")) {
                    castling.setWhiteKingMove(true);
                } else {
                    castling.setBlackKingMove(true);
                }
                game.setCastling(castling);
                this.gameService.save(game);
                transactionManager.commit(status);
            } catch (Exception ex) {
                transactionManager.rollback(status);
                throw ex;
            }
        };
    }

    private DataListener<String> onKingRookMove() {
        return (senderClient, data, ack) -> {
            DefaultTransactionDefinition def = new DefaultTransactionDefinition();

            def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

            TransactionStatus status = transactionManager.getTransaction(def);
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode jsonNode = mapper.readTree(data);
                String room = jsonNode.get("room").textValue();
                String color = jsonNode.get("color").textValue();
                Game game = this.gameService.findByRoomId(room);
                Castling castling = game.getCastling();
                if (color.equals("white")) {
                    castling.setWhiteRookKingSide(true);
                } else {
                    castling.setBlackRookKingSide(true);
                }
                game.setCastling(castling);
                this.gameService.save(game);
                transactionManager.commit(status);
            } catch (Exception ex) {
                transactionManager.rollback(status);
                throw ex;
            }

        };
    }

    private DataListener<String> onQueenRookMove() {
        return (senderClient, data, ack) -> {
            DefaultTransactionDefinition def = new DefaultTransactionDefinition();

            def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

            TransactionStatus status = transactionManager.getTransaction(def);
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode jsonNode = mapper.readTree(data);
                String room = jsonNode.get("room").textValue();
                String color = jsonNode.get("color").textValue();
                Game game = this.gameService.findByRoomId(room);
                Castling castling = game.getCastling();
                if (color.equals("white")) {
                    castling.setWhiteRookQueenSide(true);
                } else {
                    castling.setBlackRookQueenSide(true);
                }
                game.setCastling(castling);
                this.gameService.save(game);
                transactionManager.commit(status);
            } catch (Exception ex) {
                transactionManager.rollback(status);
                throw ex;
            }
        };
    }

    private DataListener<String> onEligibleForEnPassant() {
        return (senderClient, data, ack) -> {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(data);
            String roomId = jsonNode.get("room").textValue();
            Integer x = jsonNode.get("x").intValue();
            Integer y = jsonNode.get("y").intValue();
            Map<String, Object> ret = new HashMap<>();
            ret.put("x", (7-x));
            ret.put("y", (7-y));
            socketService.sendMessage(roomId, "enPassant",
            mapper.writeValueAsString(ret), senderClient);
        };
    }

    private DataListener<String> onJoinRoomEvent() {
        return (senderClient, data, ack) -> {
            DefaultTransactionDefinition def = new DefaultTransactionDefinition();
            def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        
            TransactionStatus status = transactionManager.getTransaction(def);
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode jsonNode = mapper.readTree(data);
                String room = jsonNode.get("room").textValue();
                String color = jsonNode.get("color").textValue();
                senderClient.joinRoom(room);
                Game game = this.gameService.findByRoomId(room);
                String state = "not_started";
                if (game != null) {
                    if (game.getState().equals(GameState.NOT_STARTED)) {
                        state = "not_started";
                    } else if (game.getState().equals(GameState.ONGOING)) {
                        state = "started";
                    } else {
                        state = "finished";
                    }
                }
                List<Piece> pieces = gameService.getPieces(room, color);
                Map<String, Object> ret = new HashMap<>();
                ret.put("pieces",pieces);
                ret.put("game_state",state);
                if (game != null) {
                    ret.put("turn", game.getTurn().equals(Turn.WHITE) ? "white" : "black");

                } else {
                    ret.put("turn", "NA");
                }
                senderClient.sendEvent("pieceInfo", mapper.writeValueAsString(ret));
                transactionManager.commit(status);
            } catch (Exception ex) {
                transactionManager.rollback(status);
                throw ex;
            }
        };
    }

    private DataListener<String> onLeaveRoomEvent() {
        return (senderClient, data, ack) -> {
            senderClient.leaveRoom(data);
        };
    }

    

    private DataListener<String> onCheckmate() {
        return (senderClient, data, ack) -> {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(data);
            String room = jsonNode.get("room").textValue();
            String winner = jsonNode.get("color").textValue();
            Game game = this.gameService.findByRoomId(room);
            game.setState(GameState.COMPLETED);
            game.setWinner(winner);
            this.gameService.save(game);
            Map<String, Object> ret = new HashMap<>();
            ret.put("result", winner);
            socketService.sendMessageToRoom(room, "gameEndEvent",
                    mapper.writeValueAsString(ret));
        };
    }

    private DataListener<String> onStalemate() {
        return (senderClient, data, ack) -> {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(data);
            String room = jsonNode.get("room").textValue();
            Game game = this.gameService.findByRoomId(room);
            game.setState(GameState.COMPLETED);
            this.gameService.save(game);
            Map<String, Object> ret = new HashMap<>();
            ret.put("result", "");
            socketService.sendMessageToRoom(room, "gameEndEvent",
                    mapper.writeValueAsString(ret));
        };
    }

    private DataListener<String> onStartGameEvent() {
        return (senderClient, data, ack) -> {
            String room = data;
            Game game = this.gameService.findByRoomId(room);
            game.setState(GameState.ONGOING);
            game.setTurn(Turn.WHITE);
            //now we gather both the clients first
            Collection<SocketIOClient> clientsCollection =   this.server.getRoomOperations(room).getClients();

            ArrayList<SocketIOClient> clients = new ArrayList<>(clientsCollection);

            SocketIOClient client1 = clients.get(0);

            SocketIOClient client2 = clients.get(1);
            
            socketService.sendMessage(room, "colorMsg", "white", client1);

            socketService.sendMessage(room, "colorMsg", "black", client2);

            this.gameService.save(game);
        };
    }

    @Transactional
    private DataListener<String> onNewMoveEvent() {
        return (senderClient, data, ack) -> {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(data);
            JsonNode pieceArr = jsonNode.get("pieces");
            String roomId = jsonNode.get("room").textValue();
            String team = jsonNode.get("color").textValue();
            List<Piece> pieces = new ArrayList<>();
            for(JsonNode ele : pieceArr)
            {
                Piece pieceObj = mapper.treeToValue(ele,Piece.class);
                pieces.add(pieceObj);
            }
            Game game = this.gameService.findByRoomId(roomId);
            List<Piece> convertedPieces = new ArrayList<>();
            convertedPieces = this.pieceInfoConverter.convert(pieces);
            if(team.equals("white"))
            {
                game.setWhitePieces(pieces);
                game.setBlackPieces(convertedPieces);
            }
            else
            {
                game.setBlackPieces(pieces);
                game.setWhitePieces(convertedPieces);
            }
            if(game.getTurn().equals(Turn.BLACK))
            {
                game.setTurn(Turn.WHITE);
            }
            else
            {
                game.setTurn(Turn.BLACK);
            }
            this.gameService.save(game);
            Map<String, Object> ret = new HashMap<>();
            String teamToSend = "";
            teamToSend = team.equals("white") ? "black" : "white";
            ret.put("pieces", convertedPieces);
            ret.put("team", teamToSend);
            socketService.sendMessage(roomId, "newMoveUpdateServerToClient",
                    mapper.writeValueAsString(ret), senderClient);
        };
    }
}
