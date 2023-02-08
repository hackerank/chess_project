package com.web_chess.chess_project.game_logic;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import com.web_chess.chess_project.enums.GameState;
import com.web_chess.chess_project.enums.Turn;

import jakarta.persistence.Basic;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name="game_data")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="game_id")
    private Integer gameId;

    @Column(name="room",nullable = false)
    private String roomId;

    GameState state;

    Turn turn;

    String winner;

    @Embedded
    Castling castling;

    public Castling getCastling() {
        return this.castling;
    }

    public void setCastling(Castling castling) {
        this.castling = castling;
    }

    @ElementCollection
    @ColumnDefault("[]")
    @CollectionTable(name = "white_pieces", joinColumns = @JoinColumn(name = "game_id"))
    @Basic(fetch = FetchType.EAGER)
    private List<Piece> whitePieces = new ArrayList<>();

    @ElementCollection
    @ColumnDefault("[]")
    @CollectionTable(name = "black_pieces", joinColumns = @JoinColumn(name = "game_id"))
    @Basic(fetch = FetchType.EAGER)
    private List<Piece> blackPieces = new ArrayList<>();

    public Game(String roomId) {
        this.roomId = roomId;
        this.state = GameState.NOT_STARTED;
        this.turn = Turn.INVALID;
        this.winner = "";
        this.castling = new Castling();
    }

    public Game() {
    }

    public String getWinner() {
        return this.winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public Integer getGameId() {
        return this.gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public String getRoomId() {
        return this.roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public GameState getState() {
        return this.state;
    }

    public void setState(GameState state) {
        this.state = state;
    }

    public Turn getTurn() {
        return this.turn;
    }

    public void setTurn(Turn turn) {
        this.turn = turn;
    }

    public List<Piece> getWhitePieces() {
        return this.whitePieces;
    }

    public void setWhitePieces(List<Piece> whitePieces) {
        this.whitePieces = whitePieces;
    }

    public List<Piece> getBlackPieces() {
        return this.blackPieces;
    }

    public void setBlackPieces(List<Piece> blackPieces) {
        this.blackPieces = blackPieces;
    }

    @Override
    public String toString() {
        return "{" +
            " gameId='" + getGameId() + "'" +
            ", roomId='" + getRoomId() + "'" +
            ", state='" + getState() + "'" +
            ", whitePieces='" + getWhitePieces() + "'" +
            ", blackPieces='" + getBlackPieces() + "'" +
            "}";
    }

}
