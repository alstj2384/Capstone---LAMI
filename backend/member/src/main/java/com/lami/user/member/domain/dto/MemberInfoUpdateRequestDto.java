package com.lami.user.member.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberInfoUpdateRequestDto {
    private String nickname;
    private String memorizationMethod;
    private String profileImage;
}
