package com.tenny.smart_shop_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {


    private String apiKey = "......";

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.groq.com")
            .build();

    public String chat(String userMessage) {
        String prompt = "Bạn là trợ lý AI của Smart Shop - cửa hàng thời trang online. "
                + "Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. "
                + "Bạn có thể hỗ trợ: tư vấn sản phẩm, hướng dẫn đặt hàng, chính sách đổi trả. "
                + "Khách hàng hỏi: " + userMessage;

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama-3.1-8b-instant");
        body.put("messages", List.of(message));

        try {
            Map response = webClient.post()
                    .uri("/openai/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(),
                            res -> res.bodyToMono(String.class)
                                    .map(RuntimeException::new)
                    )
                    .bodyToMono(Map.class)
                    .block();

            return extractText(response);
        } catch (Exception e) {
            return "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau!";
        }
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map response) {
        try {
            List choices = (List) response.get("choices");
            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "Không thể xử lý phản hồi từ AI.";
        }
    }
}
