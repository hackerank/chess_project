package com.web_chess.chess_project.game_logic;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web_chess.chess_project.repositories.GameRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class GameService {
    @Autowired
    private GameRepository gameRepository;

    @Transactional
    public Game findByRoomId(String roomId) {
        return this.gameRepository.findByRoomId(roomId);
    }

    public Game save(Game game) {
        return this.gameRepository.save(game);
    }

    public List<Piece> getInitialWhitePieces() throws JsonProcessingException {
        String initialWhite = "[{\"image\":\"assets/images/B_pawn.png\",\"x\":1,\"y\":0,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":1,\"y\":1,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":1,\"y\":2,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":1,\"y\":3,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":1,\"y\":4,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":1,\"y\":5,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":1,\"y\":6,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":1,\"y\":7,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_rook.png\",\"x\":0,\"y\":0,\"type\":\"rook\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_rook.png\",\"x\":0,\"y\":7,\"type\":\"rook\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_knight.png\",\"x\":0,\"y\":1,\"type\":\"knight\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_knight.png\",\"x\":0,\"y\":6,\"type\":\"knight\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_bishop.png\",\"x\":0,\"y\":2,\"type\":\"bishop\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_bishop.png\",\"x\":0,\"y\":5,\"type\":\"bishop\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_king.png\",\"x\":0,\"y\":4,\"type\":\"king\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_queen.png\",\"x\":0,\"y\":3,\"type\":\"queen\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":6,\"y\":0,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":6,\"y\":1,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":6,\"y\":2,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":6,\"y\":3,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":6,\"y\":4,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":6,\"y\":5,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":6,\"y\":6,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":6,\"y\":7,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/W_rook.png\",\"x\":7,\"y\":0,\"type\":\"rook\",\"team\":\"our\"},{\"image\":\"assets/images/W_rook.png\",\"x\":7,\"y\":7,\"type\":\"rook\",\"team\":\"our\"},{\"image\":\"assets/images/W_knight.png\",\"x\":7,\"y\":1,\"type\":\"knight\",\"team\":\"our\"},{\"image\":\"assets/images/W_knight.png\",\"x\":7,\"y\":6,\"type\":\"knight\",\"team\":\"our\"},{\"image\":\"assets/images/W_bishop.png\",\"x\":7,\"y\":2,\"type\":\"bishop\",\"team\":\"our\"},{\"image\":\"assets/images/W_bishop.png\",\"x\":7,\"y\":5,\"type\":\"bishop\",\"team\":\"our\"},{\"image\":\"assets/images/W_king.png\",\"x\":7,\"y\":4,\"type\":\"king\",\"team\":\"our\"},{\"image\":\"assets/images/W_queen.png\",\"x\":7,\"y\":3,\"type\":\"queen\",\"team\":\"our\"}]";

        ObjectMapper mapper = new ObjectMapper();

        ArrayList<Piece> ret = mapper.readValue(initialWhite,
                mapper.getTypeFactory().constructCollectionType(ArrayList.class, Piece.class));
        for (Piece ele : ret) {
            ele.setEnPassant(false);
        }
        return ret;

    }

    public List<Piece> getInitialBlackPieces() throws JsonProcessingException {
        String initialBlack = "[{\"image\":\"assets/images/W_pawn.png\",\"x\":1,\"y\":0,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":1,\"y\":1,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":1,\"y\":2,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":1,\"y\":3,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":1,\"y\":4,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":1,\"y\":5,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":1,\"y\":6,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_pawn.png\",\"x\":1,\"y\":7,\"type\":\"pawn\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_rook.png\",\"x\":0,\"y\":0,\"type\":\"rook\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_rook.png\",\"x\":0,\"y\":7,\"type\":\"rook\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_knight.png\",\"x\":0,\"y\":1,\"type\":\"knight\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_knight.png\",\"x\":0,\"y\":6,\"type\":\"knight\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_bishop.png\",\"x\":0,\"y\":2,\"type\":\"bishop\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_bishop.png\",\"x\":0,\"y\":5,\"type\":\"bishop\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_king.png\",\"x\":0,\"y\":4,\"type\":\"king\",\"team\":\"opponent\"},{\"image\":\"assets/images/W_queen.png\",\"x\":0,\"y\":3,\"type\":\"queen\",\"team\":\"opponent\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":6,\"y\":0,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":6,\"y\":1,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":6,\"y\":2,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":6,\"y\":3,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":6,\"y\":4,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":6,\"y\":5,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":6,\"y\":6,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/B_pawn.png\",\"x\":6,\"y\":7,\"type\":\"pawn\",\"team\":\"our\"},{\"image\":\"assets/images/B_rook.png\",\"x\":7,\"y\":0,\"type\":\"rook\",\"team\":\"our\"},{\"image\":\"assets/images/B_rook.png\",\"x\":7,\"y\":7,\"type\":\"rook\",\"team\":\"our\"},{\"image\":\"assets/images/B_knight.png\",\"x\":7,\"y\":1,\"type\":\"knight\",\"team\":\"our\"},{\"image\":\"assets/images/B_knight.png\",\"x\":7,\"y\":6,\"type\":\"knight\",\"team\":\"our\"},{\"image\":\"assets/images/B_bishop.png\",\"x\":7,\"y\":2,\"type\":\"bishop\",\"team\":\"our\"},{\"image\":\"assets/images/B_bishop.png\",\"x\":7,\"y\":5,\"type\":\"bishop\",\"team\":\"our\"},{\"image\":\"assets/images/B_king.png\",\"x\":7,\"y\":3,\"type\":\"king\",\"team\":\"our\"},{\"image\":\"assets/images/B_queen.png\",\"x\":7,\"y\":4,\"type\":\"queen\",\"team\":\"our\"}]";

        ObjectMapper mapper = new ObjectMapper();
        ArrayList<Piece> ret = mapper.readValue(initialBlack,
                mapper.getTypeFactory().constructCollectionType(ArrayList.class, Piece.class));
        for (Piece ele : ret) {
            ele.setEnPassant(false);
        }
        return ret;
    }

    @Transactional
    public List<Piece> getPieces(String roomId,String color)
    {
        Game game = this.gameRepository.findByRoomId(roomId);
        return  color.equals("white")?game.getWhitePieces():game.getBlackPieces();
    }
}
