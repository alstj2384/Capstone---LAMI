package com.lami.user.member.domain.dto;

import lombok.Data;

@Data
public class MemberRegistEmailVerifyDto {

    private String email;
    private String code;
}
