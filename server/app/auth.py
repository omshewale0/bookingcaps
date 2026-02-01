from passlib.context import CryptContext
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from dotenv import load_dotenv
import os

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "change_me")
TOKEN_EXPIRE_SECONDS = 60 * 60 * 24 * 7
serializer = URLSafeTimedSerializer(SECRET_KEY)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(user_id: int) -> str:
    return serializer.dumps({"user_id": user_id})


def verify_access_token(token: str) -> int | None:
    try:
        data = serializer.loads(token, max_age=TOKEN_EXPIRE_SECONDS)
        return data.get("user_id")
    except (BadSignature, SignatureExpired, KeyError):
        return None
