
# 문제 응답 형식 지정
RESPONSE_WORKBOOK_FORMAT = """
    [
        {
          "question": "Sample question 1",
          "type": 0,
          "choices": {
            "1": "Option 1",
            "2": "Option 2",
            "3": "Option 3",
            "4": "Option 4"
          },
          "answer": "1"
        },
        {
          "question": "Sample question 2",
          "type": 1,
          "answer": "O"
        },
        {
          "question": "Sample question 3",
          "type": 2,
          "answer": "Dolphin"
        }
    ]

        Where:
        - "type" is an integer:
          - 0 for Multiple Choice
          - 1 for True/False
          - 2 for Short Answer
"""


# 피드백 응답 형식 지정
RESPONSE_FEEDBACK_FORMAT = """ 
    - 핵심 개념만 설명하고, 부가 설명은 1~2문장 이내로 요약
"""


# 암기법 응답 형식 지정
RESPONSE_MEMORIZATION_FORMAT = """ 
    - 사용자가 쉽게 외울수 있는 한문장만 출력하기
"""
