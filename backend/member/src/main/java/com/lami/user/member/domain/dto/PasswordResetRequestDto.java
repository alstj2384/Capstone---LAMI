package com.lami.user.member.domain.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PasswordResetRequestDto {
    private String userId;
    private String newPassword;
}
