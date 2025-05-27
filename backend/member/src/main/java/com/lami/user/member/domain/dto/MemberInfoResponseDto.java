package com.lami.user.member.domain.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
public class MemberInfoResponseDto {
    private Long userId;
    private String name;
    private String email;
}
