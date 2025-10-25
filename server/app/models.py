from pydantic import BaseModel
from typing import List, Dict

class BackReq(BaseModel):
    backs: List[str] = []  # courses with backlog

class ExplainReq(BaseModel):
    course: str
    backs: List[str] = []
