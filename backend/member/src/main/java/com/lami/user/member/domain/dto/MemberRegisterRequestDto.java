package com.lami.user.member.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MemberRegisterRequestDto { // 추후 수정 예정

    private String userId;
    private String password;
    private String name;
    private String email;
    private String nickname;
    private String memorizationMethod;
}
