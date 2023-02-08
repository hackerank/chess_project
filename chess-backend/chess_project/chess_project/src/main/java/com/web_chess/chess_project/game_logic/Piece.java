package com.web_chess.chess_project.game_logic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;


@Embeddable
@JsonIgnoreProperties(ignoreUnknown = true)
public class Piece {
    @JsonProperty("image")
    @Column
    private String image;

    @JsonProperty("x")
    @Column
    private Integer x;

    @JsonProperty("y")
    @Column
    private Integer y;

    @JsonProperty("type")
    @Column
    private String type;

    @JsonProperty("team")
    @Column
    private String team;

    @JsonProperty("enPassant")
    @Column
    private Boolean enPassant;

    public Piece() {
    }

    public Piece(String image, Integer x, Integer y, String type, String team,Boolean enPassant) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.type = type;
        this.team = team;
        this.enPassant = enPassant;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getX() {
        return this.x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return this.y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTeam() {
        return this.team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public Boolean getEnPassant() {
        return this.enPassant;
    }

    public void setEnPassant(Boolean enPassant) {
        this.enPassant = enPassant;
    }

    @Override
    public String toString() {
        return "{" +
            " image='" + getImage() + "'" +
            ", x='" + getX() + "'" +
            ", y='" + getY() + "'" +
            ", type='" + getType() + "'" +
            ", team='" + getTeam() + "'" +
            "}";
    }
}
