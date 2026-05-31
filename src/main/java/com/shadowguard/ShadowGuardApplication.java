package com.shadowguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShadowGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShadowGuardApplication.class, args);
    }

}


// 31-may:-  made changes in postgre changed text from charecter varying(255) to text to fix the problem related to big
// paragraphs breaking the code during testing. 