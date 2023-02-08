package com.web_chess.chess_project.game_logic;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class PieceInfoConverter {

    public PieceInfoConverter() {
    }

    public List<Piece> convert(List<Piece> src) {
        // for every piece in srcpiece , we interchange x and y.
        ArrayList<Piece> dest = new ArrayList<>();
        for (Integer i = 0; i < src.size(); ++i) {
            Piece target = src.get(i);
            dest.add(
                    new Piece(target.getImage(), 7 - target.getX(), 7 - target.getY(), target.getType(),
                            target.getTeam().equals("our") ? "opponent" : "our", target.getEnPassant()));
        }
        return dest;
    }
}
