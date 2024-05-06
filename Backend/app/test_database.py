import pytest
from .database import (
    connect, insert, update, get_userbyid, create_user,
    create_admin, get_adminbyid, token_entry, verify_token,
    add_product, delete_product
)

@pytest.fixture(scope="module")
def db():
    """Setup database connection for testing."""
    return connect()

def test_insert_and_update_chats(db):
    # Test insert function
    data = {"userid": 123, "date": "2024-05-06", "chats": ["Message 1"]}
    assert insert(data) == True

    # Test update function
    new_data = "New message"
    assert update(123, "2024-05-06", new_data) == True

def test_user_functions():
    # Test create_user and get_userbyid functions
    user_data = {"userid": 456, "username": "testuser", "password": "testpass"}
    assert create_user(user_data) == True
    assert get_userbyid(456) == {"userid":456,"username": "testuser"}

def test_admin_functions():
    # Test create_admin and get_adminbyid functions
    admin_data = {"adminid": 789, "username": "adminuser", "password": "adminpass"}
    assert create_admin(admin_data) == True
    assert get_adminbyid(789) == {"adminid": 789,"username": "adminuser"}

def test_token_functions():
    # Test token_entry and verify_token functions
    token = "abc123"
    token_entry(token, "active")
    assert verify_token(token) == True

def test_product_functions():
    # Test add_product and delete_product functions
    product_data = {"pid": 999999, "name": "Product 1", "price": 99.99}
    assert add_product(product_data) == True
    assert delete_product(999999) == True

# Run the tests by executing `pytest` in the terminal at your project directory
