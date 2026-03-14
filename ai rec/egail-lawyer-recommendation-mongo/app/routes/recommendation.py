from fastapi import APIRouter
from app.schemas.recommendation import RecommendationRequest
from app.schemas.lawyer import LawyerResponse
from app.services.recommendation_service import recommend_lawyers

router = APIRouter()


@router.post("/recommend-lawyers", response_model=list[LawyerResponse])
async def recommend(request: RecommendationRequest):

    results = await recommend_lawyers(request)

    response = []

    for lawyer, score in results:

        response.append(
            LawyerResponse(
                id=str(lawyer["_id"]),
                full_name=lawyer["full_name"],
                specialization=lawyer["specialization"],
                city=lawyer["city"],
                price=lawyer["price"],
                avg_rating=lawyer["avg_rating"],
                reviews_count=lawyer["reviews_count"],
                success_rate=lawyer["success_rate"],
                is_verified=lawyer["is_verified"],
                score=round(score, 4)
            )
        )

    return response