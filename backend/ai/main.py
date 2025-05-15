from fastapi import FastAPI

from prompt_gpt import post_gpt_make_workbook
from prompt_gpt import post_gpt_make_feedback
from prompt_gpt import post_gpt_make_memorization

from models import WorkBook
from models import FeedBack
from models import Memorization


app = FastAPI()


@app.get("/api/ai")
async def root():
    return {"status": 200, "message": "Hello, This is Chat GPT Channel", "data": {}}


# 문제집 생성
@app.post("/api/ai/workbook")
def workbook(workbook: WorkBook):

    try:
        pdf = workbook.pdf
        difficulty = workbook.difficulty
        multiple_choice_amount = workbook.multiple_choice_amount
        true_false_amount = workbook.true_false_amount
        short_answer_amount = workbook.short_answer_amount

        response = post_gpt_make_workbook(
            pdf, difficulty, multiple_choice_amount, true_false_amount, short_answer_amount
        )

        return {"status": 200, "message": "success", "data": response}
    
    except Exception as e:
        return {"status": 400, "message": "error", "data": str(e)}


# 피드백 생성
@app.post("/api/ai/feedback")
def feedback(feedback: FeedBack):

    try:
        question = feedback.question
        choices = feedback.choices
        answer = feedback.answer

        response = post_gpt_make_feedback(question, choices, answer)

        return {"status": 200, "message": "success", "data": response}

    except Exception as e:
        return {"status": 400, "message": "error", "data": str(e)}


# 암기법 생성
@app.post("/api/ai/memorization")
def memorization(memorization: Memorization):
    
    try:
        question = memorization.question
        choices = memorization.choices
        answer = memorization.answer
        method = memorization.method

        response = post_gpt_make_memorization(question, choices, answer, method)

        return {"status": 200, "message": "success", "data": response}

    except Exception as e:
        return {"status": 400, "message": "error", "data": str(e)}

