from pydantic import BaseModel


class LawyerResponse(BaseModel):

    id: str
    full_name: str
    specialization: str
    city: str

    price: float

    avg_rating: float
    reviews_count: int
    success_rate: float

    is_verified: bool

    score: float