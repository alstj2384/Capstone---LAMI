package com.lami.user.member.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyCodeRequestDto {
    private String userId;
    private String code;
}
