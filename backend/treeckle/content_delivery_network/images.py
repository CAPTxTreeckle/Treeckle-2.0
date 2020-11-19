import os
from imagekitio import ImageKit
import logging
from typing import Tuple


logger = logging.getLogger("main")

imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"),
    public_key=os.getenv("IMAGEKIT_PUBLIC_KEY"),
    url_endpoint=os.getenv("IMAGEKIT_URL")
)

# Referereces:
# - https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload
# - https://pypi.org/project/imagekitio/


def delete_image(image_id: str) -> None:
    if not image_id:
        return
    imagekit.delete_file(image_id)


def upload_image(filename: str, base64_image: str) -> Tuple[str, str]:
    if base64_image == "":
        return ("", "")
    _, file = base64_image.split(":", 1)
    data = imagekit.upload(file=file, file_name=filename).get("response")
    image_url = data.get("url")
    file_id = data.get("fileId")
    logger.info(image_url)
    logger.info(file_id)
    return (file_id, image_url)
