package com.web_chess.chess_project.controllers;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web_chess.chess_project.Constants;
import com.web_chess.chess_project.entities.Player;
import com.web_chess.chess_project.exceptions.EtAuthException;
import com.web_chess.chess_project.services.PlayerService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PlayerResource {

    @Autowired
    PlayerService playerService;

    @PostMapping(path = "/register_player")
    public ResponseEntity<Map<String,String>>  registerPlayer(@RequestBody Player player) throws EtAuthException
    {
        Player player1 = null;
        try {
        player1 = this.playerService.registerPlayer(player);
            
        } catch (Exception e) {
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(generateJWTToken(player1),HttpStatus.OK);
    }

    @PostMapping("/login_player")
    public ResponseEntity<Map<String,String>>  loginPlayer(@RequestBody Player player)
    {
        List<Player> player1;
        try {
        player1 =  this.playerService.validatePlayer(player);
        if(player1.size() == 0)
            return new ResponseEntity<>(generateJWTToken(player1.get(0)),HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(generateJWTToken(player1.get(0)),HttpStatus.OK);
    }

    private Map<String, String> generateJWTToken(Player player) {
        long timestamp = System.currentTimeMillis();
        String token = Jwts.builder().signWith(SignatureAlgorithm.HS256, Constants.API_SECRET_KEY)
                .setIssuedAt(new Date(timestamp)).setExpiration(new Date(timestamp + Constants.TOKEN_VALIDITY))
                .claim("playerId", player.getPlayerId())
                .claim("playerName", player.getPlayerName()).compact();
        Map<String, String> map = new HashMap<>();
        // String token = "iitropar";
        map.put("token", token);
        return map;
    }
}
