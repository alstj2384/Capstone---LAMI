from pydantic import BaseModel


class WorkBook(BaseModel):
    pdf: str
    difficulty: int
    multiple_choice_amount: int
    true_false_amount: int 
    short_answer_amount: int 


class FeedBack(BaseModel):
    question: str
    choices: str
    answer: str


class Memorization(BaseModel):
    question: str
    choices: str
    answer: str
    method: str


'''
class CustomResponse(BaseModel):
    status: int
    message: str
'''
