package lami.capstoneworkbook.application;


import lami.capstoneworkbook.domain.dto.GenerateProblemRequestDto;
import lami.capstoneworkbook.domain.dto.GenerateProblemResponseDto;
import lami.capstoneworkbook.domain.dto.WorkBookCreateDto;
import lami.capstoneworkbook.global.ResponseCode;
import lami.capstoneworkbook.global.exception.ExternalServiceException;
import lami.capstoneworkbook.global.util.FileUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@Service
@Slf4j
public class ApiService {
    private final FileUtils fileUtils;
    private final WebClient webClient;

    public ApiService(WebClient.Builder webClientBuilder,
                      @Value("${api.server.url}") String apiServerUrl,
                      FileUtils fileUtils){
        this.fileUtils = fileUtils;
        this.webClient = webClientBuilder.baseUrl(apiServerUrl).build();
    }


    public GenerateProblemResponseDto generateProblems(WorkBookCreateDto dto){
        log.info("[GenerateProblems] Problem 생성 API 요청");

        // PDF 확인 및 로컬에 저장
        String fileName = validateAndSave(dto);
        GenerateProblemRequestDto requestDto = GenerateProblemRequestDto.toDto(dto, fileName);
        log.info("{}", requestDto);

        return webClient.post()
                .uri("/api/ai/workbook")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestDto)
                .retrieve()
                .onStatus(status -> status.isError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> {
                                    log.error("[GenerateProblems] AI 서버 오류: {}", body);
                                    return new ExternalServiceException(ResponseCode.AI_SERVER_ERROR);
                                }))
                .bodyToMono(GenerateProblemResponseDto.class)
                .block();
    }



    private String validateAndSave(WorkBookCreateDto dto) {
        log.info("[ValidateAndSave] PDF 저장중 .. ");
        try {
            // 1. PDF 여부 확인
            if (!fileUtils.isPdf(dto.getPdf())) {
                throw new IllegalArgumentException(ResponseCode.FILE_TYPE_NOT_MATCH.getMessage());
            }
            // 2. 저장
            return fileUtils.save(dto.getPdf());

        } catch (IOException e) {
            throw new RuntimeException(ResponseCode.FILE_PROCESS_ERROR.getMessage());
        }
    }

}
