package lami.capstoneworkbook.global;

import lami.capstoneworkbook.global.exception.ExternalServiceException;
import lami.capstoneworkbook.global.exception.UnAuthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class ExceptionHandlers {

    @ExceptionHandler
    public ResponseEntity<ApiResponse<Object>> illegalArgumentException(IllegalArgumentException exception){
        log.info("IllegalArgumentException: {}", exception.getMessage());

        return ApiResponse.response(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<ApiResponse<Object>> unAuthorizedException(UnAuthorizedException exception){
        log.info("unAuthorizedException: {}", exception.getCode().getMessage());

        return ApiResponse.response(exception.getCode());
    }

    @ExceptionHandler
    public ResponseEntity<ApiResponse<Object>> externalServiceException(ExternalServiceException exception){
        log.info("externalServiceException: {}", exception.getCode().getMessage());

        return ApiResponse.response(exception.getCode());
    }
}
