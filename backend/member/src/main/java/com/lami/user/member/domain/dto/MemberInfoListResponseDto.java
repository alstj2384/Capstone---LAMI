package com.lami.user.member.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberInfoListResponseDto {

    List<MemberInfotoSingleResponseDto> members;

}
