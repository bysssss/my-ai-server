import pytest
from fastapi.testclient import TestClient

from app.main_api import my_fastapi


@pytest.fixture
def client():
    # with 로 열어야 lifespan(시작·종료 로그)까지 실행된다 — 커버리지 대상.
    with TestClient(my_fastapi) as c:
        yield c


def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["name"]
    assert body["version"]


def test_root(client):
    res = client.get("/")
    assert res.status_code == 200
    assert "name" in res.json()
