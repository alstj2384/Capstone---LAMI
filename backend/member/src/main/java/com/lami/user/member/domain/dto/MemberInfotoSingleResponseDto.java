package com.lami.user.member.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberInfotoSingleResponseDto {
    private Long memberId;
    private String userName;
}
