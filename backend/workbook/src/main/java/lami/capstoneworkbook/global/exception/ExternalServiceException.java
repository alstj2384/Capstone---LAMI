package lami.capstoneworkbook.global.exception;

import lami.capstoneworkbook.global.ResponseCode;
import lombok.Getter;

@Getter
public class ExternalServiceException extends RuntimeException{
    private ResponseCode code;
    public ExternalServiceException(String message) {
        super(message);
    }
    public ExternalServiceException(ResponseCode code){
        this.code = code;
    }
}
