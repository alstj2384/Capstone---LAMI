package com.lami.user.member.domain.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
public class MemberInfoResponseDto {
    private String userId;
    private String name;
    private String email;
}
