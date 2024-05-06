import pytest
from datetime import datetime, timedelta
from unittest.mock import MagicMock
from fastapi import HTTPException, status
from app import oauth2
from app import schemas

# Mock dependencies for token verification
oauth2.get_userbyid = MagicMock(return_value={"userid": 1, "username": "testuser"})
oauth2.get_adminbyid = MagicMock(return_value={"adminid": 1, "username": "adminuser"})

@pytest.fixture
def valid_token():
    # Generate a valid token for testing
    data = {"userid": 1}
    return oauth2.create_access_token(data)

@pytest.fixture
def expired_token():
    # Generate an expired token for testing
    data = {"userid": 1}
    expire = datetime.utcnow() - timedelta(minutes=1)  # Expired token
    return oauth2.create_access_token(data,expire)

def test_create_access_token():
    # Test creating a valid access token
    data = {"userid": 1}
    token = oauth2.create_access_token(data)
    assert isinstance(token, str)

def test_verify_access_token_valid(valid_token):
    # Test verifying a valid access token
    token_data = oauth2.verify_access_token(valid_token)
    assert token_data.id == 1

def test_verify_access_token_expired(expired_token):
    # Test verifying an expired access token
    with pytest.raises(HTTPException) as e:
        oauth2.verify_access_token(expired_token)
    assert e.value.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_current_user(valid_token):
    # Test getting current user from a valid token
    user = oauth2.get_current_user(valid_token)
    assert user["userid"] == 1
    assert user["username"] == "testuser"

def test_get_current_admin(valid_token):
    # Test getting current admin from a valid token
    admin = oauth2.get_current_admin(valid_token)
    assert admin["adminid"] == 1
    assert admin["username"] == "adminuser"

# Run the tests by executing `pytest` in the terminal at your project directory
