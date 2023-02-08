package com.web_chess.chess_project.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.web_chess.chess_project.entities.Player;

@Repository
public interface PlayerRepository extends JpaRepository<Player,Integer> {
    @Query(value="SELECT * FROM players_data WHERE players_data.PLAYER_NAME = :pName",nativeQuery=true)
    public List<Player> findPlayerByPlayerName(@Param("pName")String playerName);
    @Query(value="SELECT * FROM players_data WHERE players_data.PLAYER_NAME = :pName AND players_data.PASSWORD = :pass",nativeQuery=true)
    public List<Player> findPlayerByPlayerNameAndPassword(@Param("pName")String playerName,@Param("pass")String password);
}
