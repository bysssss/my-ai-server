from fastapi.testclient import TestClient

from app.main_api import my_fastapi

client = TestClient(my_fastapi)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["name"]
    assert body["version"]


def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert "name" in res.json()
