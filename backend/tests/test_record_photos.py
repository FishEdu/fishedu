import base64
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from routes.record_photos import MAX_PHOTO_SIZE, router


PNG_PHOTO = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZQAAAABJRU5ErkJggg=="
)


class RecordPhotosTests(unittest.TestCase):
    def setUp(self):
        self.directory = TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.photos = Path(self.directory.name)
        self.storage_patch = patch("routes.record_photos.RECORD_PHOTOS_DIR", self.photos)
        self.storage_patch.start()
        self.addCleanup(self.storage_patch.stop)
        app = FastAPI()
        app.include_router(router)
        self.client = TestClient(app)
        self.addCleanup(self.client.close)

    def test_uploaded_photo_can_be_downloaded(self):
        response = self.client.post(
            "/api/v1/records/photos",
            files={"file": ("user-photo.png", PNG_PHOTO, "image/png")},
        )
        self.assertEqual(response.status_code, 201)
        image_url = response.json()["image_url"]
        photo = self.client.get(image_url)
        self.assertEqual(photo.status_code, 200)
        self.assertEqual(photo.content, PNG_PHOTO)
        self.assertEqual(photo.headers["content-type"], "image/png")
        self.assertEqual(photo.headers["x-content-type-options"], "nosniff")

    def test_filename_from_upload_is_not_used_as_storage_path(self):
        response = self.client.post(
            "/api/v1/records/photos",
            files={"file": ("../../photo.png", PNG_PHOTO, "image/png")},
        )
        self.assertEqual(response.status_code, 201)
        self.assertRegex(response.json()["image_url"], r"/photos/[a-f0-9]{32}\.png$")
        self.assertEqual(len(list(self.photos.iterdir())), 1)

    def test_invalid_image_is_rejected(self):
        response = self.client.post(
            "/api/v1/records/photos",
            files={"file": ("photo.jpg", b"not an image", "image/jpeg")},
        )
        self.assertEqual(response.status_code, 415)
        self.assertEqual(list(self.photos.iterdir()), [])

    def test_oversized_photo_is_rejected(self):
        response = self.client.post(
            "/api/v1/records/photos",
            files={"file": ("photo.png", PNG_PHOTO + b"x" * MAX_PHOTO_SIZE, "image/png")},
        )
        self.assertEqual(response.status_code, 413)
        self.assertEqual(list(self.photos.iterdir()), [])

    def test_missing_and_invalid_photo_paths_return_not_found(self):
        for filename in ("a" * 32 + ".jpg", "main.py", "invalid.png"):
            with self.subTest(filename=filename):
                self.assertEqual(self.client.get(f"/api/v1/records/photos/{filename}").status_code, 404)


if __name__ == "__main__":
    unittest.main()
