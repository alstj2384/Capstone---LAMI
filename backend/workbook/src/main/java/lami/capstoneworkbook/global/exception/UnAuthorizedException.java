package lami.capstoneworkbook.global.exception;

import lami.capstoneworkbook.global.ResponseCode;
import lombok.Getter;

@Getter
public class UnAuthorizedException extends RuntimeException{
    private ResponseCode code;
    public UnAuthorizedException(String message) {
        super(message);
    }

    public UnAuthorizedException(ResponseCode code){
        this.code = code;
    }
}
