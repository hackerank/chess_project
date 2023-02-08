package com.web_chess.chess_project.repositories;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.web_chess.chess_project.game_logic.Game;

@Repository
public interface GameRepository extends CrudRepository<Game,Integer>{
    public Game findByRoomId(String roomId);
}
