package com.lami.user.member.domain.dto;


import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MemberInfoUpdateResponseDto {
    private String memberId;
    private String nickname;
    private String memorizationMethod;
    private String profileImage;
}
