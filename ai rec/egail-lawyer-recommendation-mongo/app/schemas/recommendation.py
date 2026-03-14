from pydantic import BaseModel


class RecommendationRequest(BaseModel):

    user_id: int
    case_type: str
    consultation_type: str
    city: str
    budget: float