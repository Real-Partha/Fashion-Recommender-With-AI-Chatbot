from .encrypt import hash_password, verify_password

# Test hashing a password
def test_hash_password():
    # Given a plain password
    plain_password = "test_password"

    # When hashing the password
    hashed_password = hash_password(plain_password)

    # Ensure hashed password is not empty and is a valid hash
    assert hashed_password is not None
    assert len(hashed_password) > 0
    assert hashed_password.startswith("$2b$")  # Assuming bcrypt scheme

# Test verifying a correct password
def test_verify_correct_password():
    # Given a plain password and its hashed version
    plain_password = "test_password"
    hashed_password = hash_password(plain_password)

    # When verifying the password
    is_valid = verify_password(plain_password, hashed_password)

    # Ensure the password is verified successfully
    assert is_valid is True

# Test verifying an incorrect password
def test_verify_incorrect_password():
    # Given a correct plain password and its hashed version
    correct_password = "test_password"
    incorrect_password = "wrong_password"
    hashed_password = hash_password(correct_password)

    # When verifying with an incorrect password
    is_valid = verify_password(incorrect_password, hashed_password)

    # Ensure the password verification fails
    assert is_valid is False
