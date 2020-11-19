import json
import logging
import urllib3

from treeckle.models.user import ThirdPartyAuthenticator, User
from treeckle.strings.json_keys import EMAIL, NAME, SUB

http = urllib3.PoolManager()
logger = logging.getLogger("main")


def authenticate_gmail_token(id_token: str) -> User:
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
    response = http.request('GET', url)
    response_data = json.loads(response.data)
    return User(
        third_party_authenticator=ThirdPartyAuthenticator.GOOGLE,
        third_party_id=response_data[SUB],
        name=response_data[NAME],
        email=response_data[EMAIL]
    )
