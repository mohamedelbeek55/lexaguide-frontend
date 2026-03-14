import asyncio
from datetime import datetime
from app.database import db


async def seed_lawyers():

    lawyers = [

        {
            "full_name": "Mahmoud Adel",
            "specialization": "family",
            "city": "Cairo",
            "years_experience": 12,
            "consultation_type": "video",
            "price": 350,
            "avg_rating": 4.7,
            "reviews_count": 85,
            "success_rate": 90,
            "is_available": True,
            "is_verified": True,
            "created_at": datetime.utcnow()
        },

        {
            "full_name": "Hany Tarek",
            "specialization": "family",
            "city": "Cairo",
            "years_experience": 8,
            "consultation_type": "both",
            "price": 450,
            "avg_rating": 4.8,
            "reviews_count": 120,
            "success_rate": 93,
            "is_available": True,
            "is_verified": True,
            "created_at": datetime.utcnow()
        },

        {
            "full_name": "Ali Fathy",
            "specialization": "family",
            "city": "Cairo",
            "years_experience": 5,
            "consultation_type": "chat",
            "price": 200,
            "avg_rating": 4.3,
            "reviews_count": 40,
            "success_rate": 80,
            "is_available": True,
            "is_verified": False,
            "created_at": datetime.utcnow()
        },

        {
            "full_name": "Omar Yasser",
            "specialization": "family",
            "city": "Alexandria",
            "years_experience": 9,
            "consultation_type": "both",
            "price": 300,
            "avg_rating": 4.4,
            "reviews_count": 55,
            "success_rate": 85,
            "is_available": True,
            "is_verified": False,
            "created_at": datetime.utcnow()
        }

    ]

    await db.lawyers.insert_many(lawyers)



    print("Seed lawyers inserted")


if __name__ == "__main__":
    asyncio.run(seed_lawyers())