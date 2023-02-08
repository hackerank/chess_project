package com.web_chess.chess_project.util;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class RandomString {
    private SecureRandom random = new SecureRandom();
    private final String CHARACTER_SET="0123456789abcdefghijklmnopqrstuvwxyz"; 
 
    public String getRandomString(Integer len) {
        StringBuffer buff = new StringBuffer(len);
        for(int i=0;i<len;i++) {
            int offset = random.nextInt(CHARACTER_SET.length());
            buff.append(CHARACTER_SET.substring(offset,offset+1));
        }
        return buff.toString();
    }
}
