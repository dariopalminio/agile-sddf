# Test example for story-verify: pytest project
# Used as input fixture to verify skill detects pytest and runs tests

def test_login_success():
    """Successful login returns a token."""
    result = {"token": "abc123", "user_id": 1}
    assert result["token"] is not None
    assert result["user_id"] == 1


def test_login_failure():
    """Invalid credentials raise an error — this test is intentionally failing."""
    # This test FAILS to demonstrate the VERIFY BLOQUEADO path (AC-5)
    result = {"token": None, "error": "invalid_credentials"}
    assert result["token"] is not None  # intentional failure
