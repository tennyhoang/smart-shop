package com.tenny.smart_shop_api.controller;

import com.tenny.smart_shop_api.dto.ChatRequest;
import com.tenny.smart_shop_api.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatbotController {
    private final ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequest req) {
        String reply = chatbotService.chat(req.getMessage());
        return ResponseEntity.ok(Map.of(
                "message", req.getMessage(),
                "reply", reply
        ));
    }
}