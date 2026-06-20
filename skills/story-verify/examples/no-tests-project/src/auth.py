# Example source file — no test configuration present
# Used as input fixture to verify skill falls back to manual mode (AC-3)

def login(username: str, password: str) -> dict:
    if username == "admin" and password == "secret":
        return {"token": "abc123", "user_id": 1}
    raise ValueError("invalid_credentials")
