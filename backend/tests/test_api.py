from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture
def client(tmp_path):
    # Do not let a developer's old dist/ influence API tests.
    return TestClient(create_app(frontend_dir=tmp_path))


BASE = {"origin": "District 1, Ho Chi Minh City", "destination": "Vung Tau City"}


def test_catalogue_is_explicitly_simulated(client):
    assert client.get("/api/health").json() == {
        "status": "ok",
        "simulated": True,
        "phase": 1,
    }
    response = client.get("/api/locations")
    assert response.status_code == 200
    data = response.json()
    assert data["simulated"] is True
    assert len(data["locations"]) == 6
    assert len({location["id"] for location in data["locations"]}) == 6
    assert BASE["origin"] in {location["name"] for location in data["locations"]}


def test_preview_is_not_a_journey_or_booking(client):
    response = client.post("/api/search-preview", json=BASE)
    assert response.status_code == 200
    assert response.json() == {
        **BASE,
        "timing": "now",
        "date": None,
        "simulated": True,
        "phase": 1,
    }


@pytest.mark.parametrize("timing", ["depart", "arrive"])
def test_scheduled_preview_preserves_wall_clock_time(client, timing):
    response = client.post(
        "/api/search-preview",
        json={**BASE, "timing": timing, "date": "2026-12-01T10:30"},
    )
    assert response.status_code == 200
    assert response.json()["date"] == "2026-12-01T10:30"
    assert response.json()["timing"] == timing


@pytest.mark.parametrize(
    "changes",
    [
        {"origin": "Unknown"},
        {"destination": "Unknown"},
        {"destination": BASE["origin"]},
        {"origin": ""},
        {"origin": "   "},
        {"destination": ""},
        {"timing": "later"},
        {"timing": "depart"},
        {"timing": "arrive"},
        {"timing": "depart", "date": "not-a-date"},
        {"origin": "x" * 201},
        {"booking": True},
    ],
)
def test_invalid_search_is_rejected_even_without_browser_validation(client, changes):
    response = client.post("/api/search-preview", json={**BASE, **changes})
    assert response.status_code == 422


def test_missing_destination_is_rejected(client):
    assert (
        client.post("/api/search-preview", json={"origin": BASE["origin"]}).status_code
        == 422
    )


def test_now_discards_irrelevant_schedule(client):
    response = client.post(
        "/api/search-preview", json={**BASE, "date": "2026-12-01T10:30"}
    )
    assert response.status_code == 200
    assert response.json()["date"] is None


def test_production_static_site_and_api_share_one_origin(tmp_path: Path):
    (tmp_path / "index.html").write_text(
        "<html><body>Travel Hub test build</body></html>"
    )
    (tmp_path / "assets").mkdir()
    (tmp_path / "assets" / "app.js").write_text("console.log('Travel Hub')")
    client = TestClient(create_app(frontend_dir=tmp_path))
    assert "Travel Hub test build" in client.get("/").text
    assert client.get("/assets/app.js").status_code == 200
    assert client.get("/api/health").json()["status"] == "ok"
    assert client.get("/api/does-not-exist").status_code == 404
    assert client.get("/pyproject.toml").status_code == 404
