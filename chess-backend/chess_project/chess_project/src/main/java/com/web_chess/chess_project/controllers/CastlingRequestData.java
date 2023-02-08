package com.web_chess.chess_project.controllers;

public class CastlingRequestData {
    private String room;
    private String color;

    public CastlingRequestData() {
    }

    public CastlingRequestData(String room, String color) {
        this.room = room;
        this.color = color;
    }

    public String getRoom() {
        return this.room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getColor() {
        return this.color;
    }

    public void setColor(String color) {
        this.color = color;
    }

}
