package com.web_chess.chess_project.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web_chess.chess_project.entities.Player;
import com.web_chess.chess_project.exceptions.EtAuthException;
import com.web_chess.chess_project.repositories.PlayerRepository;
import com.web_chess.chess_project.security.Md5;

@Service
public class PlayerServiceImpl implements PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Override
    public List<Player> validatePlayer(Player player) throws EtAuthException {
        if(null == player)
            throw new IllegalArgumentException();
        return this.playerRepository.findPlayerByPlayerNameAndPassword(player.getPlayerName(),Md5.getMd5(player.getPassword()));
    }

    @Override
    public Player registerPlayer(Player player) throws EtAuthException {
        String password = player.getPassword();
        // BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(10,new SecureRandom());
        String encodedPassword = Md5.getMd5(password);
        Player player2 = new Player(player.getPlayerName(),encodedPassword);
        // if the player is already registered then we must throw an exception.
        // we need to check if a player with the same playername already exists in the DB or not
        List<Player> pl =  this.playerRepository.findPlayerByPlayerName(player.getPlayerName());
        if(pl.size() > 0)
            throw new EtAuthException("Player Already Exists");

        return this.playerRepository.saveAndFlush(player2);
    }
}
