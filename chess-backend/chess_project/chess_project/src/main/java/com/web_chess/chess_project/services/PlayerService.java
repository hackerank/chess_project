package com.web_chess.chess_project.services;

import java.util.List;


import com.web_chess.chess_project.entities.Player;
import com.web_chess.chess_project.exceptions.EtAuthException;

public interface PlayerService {
    List<Player> validatePlayer(Player player) throws EtAuthException;
    Player registerPlayer(Player player) throws EtAuthException;
}
