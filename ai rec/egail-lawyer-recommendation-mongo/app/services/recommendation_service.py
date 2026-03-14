from app.database import db


def calculate_score(lawyer, budget):

    rating_score = lawyer["avg_rating"] / 5

    reviews_score = min(lawyer["reviews_count"] / 100, 1)

    success_score = lawyer["success_rate"] / 100

    if lawyer["price"] <= budget:
        price_score = 1
    else:
        diff = lawyer["price"] - budget
        price_score = max(0, 1 - (diff / budget))

    verified_score = 1 if lawyer["is_verified"] else 0

    score = (
        0.35 * rating_score
        + 0.20 * reviews_score
        + 0.20 * success_score
        + 0.15 * price_score
        + 0.10 * verified_score
    )

    return score


async def recommend_lawyers(request):

    lawyers_cursor = db.lawyers.find({
        "specialization": request.case_type,
        "city": request.city,
        "is_available": True,
        "consultation_type": {
            "$in": [request.consultation_type, "both"]
        }
    })

    lawyers = await lawyers_cursor.to_list(length=100)

    scored = []

    for lawyer in lawyers:

        score = calculate_score(lawyer, request.budget)

        scored.append((lawyer, score))

    ranked = sorted(scored, key=lambda x: x[1], reverse=True)

    return ranked[:10]