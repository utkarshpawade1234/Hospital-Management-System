package com.hospital.hospital_management_system.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class RazorpayConfig {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String secretKey;

    @Bean
    public RazorpayClient getRazorPayClient() throws RazorpayException {
        return new RazorpayClient(keyId, secretKey);
    }
//
//    @PostConstruct
//    public void keys(){
//        System.out.println(STR."KEY = \{keyId}");
//        System.out.println(STR."SECRET = \{secretKey}");
//    }


}
