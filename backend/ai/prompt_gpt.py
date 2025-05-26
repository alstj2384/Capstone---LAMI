import os
from openai import OpenAI
import json
# env 파일 불러오기
from dotenv import load_dotenv
from fastapi import HTTPException
# 응답 형식 불러오기
from prompt_response_model import RESPONSE_WORKBOOK_FORMAT
from prompt_response_model import RESPONSE_FEEDBACK_FORMAT
from prompt_response_model import RESPONSE_MEMORIZATION_FORMAT

load_dotenv()

GPT_API_KEY = os.getenv("GPT_API_KEY")
DIR_PATH = os.getenv("DIR_PATH")
MODEL = "gpt-3.5-turbo-0125"
client = OpenAI(
    api_key=GPT_API_KEY
)


# GPT에게 문제집 생성
def post_gpt_make_workbook(pdf, difficulty, multiple_choice_amount, true_false_amount, short_answer_amount):
    request_msg = "한국어로 " + "\n"
    request_msg += "해당 pdf에 내용을 바탕으로 " + "\n"
    request_msg += "난이도는 " + ("하" if difficulty == 1 else "중 " if difficulty == 2 else "상 " if difficulty == 3 else "생략 ") + "\n"
    request_msg += "O/X 문제 " + str(multiple_choice_amount) + "개 " + "\n"
    request_msg += "객관식 문제 " + str(true_false_amount) + "개 " + "\n"
    request_msg += "단답형 문제 " + str(short_answer_amount) + "개 " + "\n"
    request_msg += "내가 원하는 응답 형식: " + RESPONSE_WORKBOOK_FORMAT

    try:
        file = client.files.create(
            file=open(DIR_PATH + pdf, "rb"),
            purpose="user_data"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="No file error")
        
    try:
        response = client.responses.create(
            model="gpt-4.1",
            input=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_file",
                            "file_id": file.id,
                        },
                        {
                            "type": "input_text",
                            "text": request_msg,
                        },
                    ]
                }
            ]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail={e})
    
    # 파일 삭제
    '''
    client.beta.assistants.files.delete(
        file_id=file.id
    )
    '''

    # 출력 확인
    print("-------------AAA")
    print(response.output_text) 

    # json으로 변환
    res = json.loads(response.output_text)

    return res
    

# GPT에게 피드백 생성
def post_gpt_make_feedback(question, choices, answer):
    request_msg = "한국어로 " + "\n"
    request_msg += "해당 질문과 답에 맞는 풀이 설명을 해줘 " + "\n"
    request_msg += "문제는 " + question + "이고 " + "\n"
    request_msg += "선택지는 " + choices + "이고 " + "\n"
    request_msg += "내가 선택한 정답은 " + answer + "이다. " + "\n"
    request_msg += "내가 왜 이 답을 선택했는지, 어떤 개념이 부족한지 문제와 풀이를 설명해달라." + "\n"
    request_msg += "내가 원하는 응답 형식: " + RESPONSE_FEEDBACK_FORMAT

    try:
        response = client.responses.create(
            model=MODEL,
            input=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": request_msg,
                        },
                    ]
                }
            ]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail={e})
    
    # 출력 확인
    print("-------------BBB")
    print(response.output_text) 

    # json으로 변환
    res = {"explain" : response.output_text}

    return res
    

# GPT에게 암기법 생성
def post_gpt_make_memorization(question, choices, answer, method):
    request_msg = "한국어로 " + "\n"
    request_msg += "해당 질문과 답에 맞는 풀이 설명을 해줘 " + "\n"
    request_msg += "문제는 " + question + "이고 " + "\n"
    request_msg += "선택지는 " + choices + "이고 " + "\n"
    request_msg += "내가 선택한 정답은 " + answer + "이다. " + "\n"
    request_msg += "원하는 암기 방법은 " + method + "이다. " + "\n"
    request_msg += "내가 쉽게 외울 수 있는 문장을 만들어줘. " + "\n"
    request_msg += "내가 원하는 응답 형식: " + RESPONSE_MEMORIZATION_FORMAT

    try:
        response = client.responses.create(
            model=MODEL,
            input=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": request_msg,
                        },
                    ]
                }
            ]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail={e})
    
    # 출력 확인
    print("-------------CCC")
    print(response.output_text) 

    # json으로 변환
    res = {"memorize": response.output_text}

    return res

