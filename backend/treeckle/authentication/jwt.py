from datetime import datetime, timedelta
import dateutil.parser
import jwt
import os
import logging
from typing import Tuple

from treeckle.models.user import User
from treeckle.strings.json_keys import ACCESS_TOKEN, REFRESH_TOKEN, USER
from users.logic import user_to_json


_EXPIRY_DATE = "expiry_date"
_JWT_SECRET = os.getenv("JWT_SECRET", "NUS")
_TOKEN_TYPE = "token_type"
_UTF_8 = "utf-8"
_USER_ID = "user_id"
_HS256 = "HS256"

_ACCESS_TOKEN_TYPE = 0
_REFRESH_TOKEN_TYPE = 1

logger = logging.getLogger("main")

def encode_dictionary_as_jwt_string(dictionary):
	return jwt.encode(dictionary, _JWT_SECRET, algorithm=_HS256).decode(_UTF_8)


def decode_dictionary_from_jwt_string(jwt_string):
	return jwt.decode(jwt_string.encode(), _JWT_SECRET, algorithm=_HS256)


def get_authentication_data(user: User):
	now = datetime.now()
	now_plus_10_mins = now + timedelta(minutes=10)
	now_plus_14_days = now + timedelta(days=14)

	encoded_access_token = encode_dictionary_as_jwt_string({
		_TOKEN_TYPE: _ACCESS_TOKEN_TYPE,
		_USER_ID: user.id,
		_EXPIRY_DATE: now_plus_10_mins.isoformat(),
	})

	encoded_refresh_token = encode_dictionary_as_jwt_string({
		_TOKEN_TYPE: _REFRESH_TOKEN_TYPE,
		_USER_ID: user.id,
		_EXPIRY_DATE: now_plus_14_days.isoformat(),
	})

	authentication_data = {
        USER: user_to_json(user),
        ACCESS_TOKEN: encoded_access_token,
        REFRESH_TOKEN: encoded_refresh_token,
    }

	return authentication_data


def decode_token(token: str) -> Tuple[int, int, datetime]:
	dictionary = decode_dictionary_from_jwt_string(token)
	token_type = dictionary[_TOKEN_TYPE]
	user_id = dictionary[_USER_ID]
	expiry_date_iso_format = dictionary[_EXPIRY_DATE]
	expiry_date = dateutil.parser.parse(expiry_date_iso_format)
	return int(token_type), user_id, expiry_date


def is_valid_token(token_type: int, expected_token_type: int, expiry_date: datetime) -> bool:
	return token_type == expected_token_type and expiry_date > datetime.now()


def check_access_token(access_token: str) -> Tuple[int, bool]:
	token_type, user_id, expiry_date = decode_token(access_token)
	return user_id, is_valid_token(token_type, _ACCESS_TOKEN_TYPE, expiry_date)


def check_refresh_token(refresh_token: str) -> Tuple[int, bool]:
	token_type, user_id, expiry_date = decode_token(refresh_token)
	return user_id, is_valid_token(
        token_type, _REFRESH_TOKEN_TYPE, expiry_date)
