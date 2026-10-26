"""Serve demo locations and validate searches without computing journeys."""

import json
from datetime import datetime
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field, model_validator

APP_DIR = Path(__file__).resolve().parent
LOCATIONS = json.loads((APP_DIR / "data" / "locations.json").read_text())
LOCATION_NAMES = {location["name"] for location in LOCATIONS}
DEFAULT_FRONTEND_DIR = APP_DIR.parents[1] / "dist"


class SearchRequest(BaseModel):
    """The same form fields used by the JavaScript frontend."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    origin: str = Field(min_length=1, max_length=200)
    destination: str = Field(min_length=1, max_length=200)
    timing: Literal["now", "depart", "arrive"] = "now"
    date: datetime | None = None

    @model_validator(mode="after")
    def require_scheduled_time(self):
        if self.timing != "now" and self.date is None:
            raise ValueError("Choose a date and time for your journey.")
        return self


class SearchPreview(BaseModel):
    origin: str
    destination: str
    timing: Literal["now", "depart", "arrive"]
    date: str | None
    simulated: bool = True
    phase: int = 1


def create_app(frontend_dir: Path = DEFAULT_FRONTEND_DIR) -> FastAPI:
    app = FastAPI(title="Travel Hub Demo API", version="0.2.0")

    @app.get("/api/health")
    def health():
        return {"status": "ok", "simulated": True, "phase": 1}

    @app.get("/api/locations")
    def locations():
        return {"simulated": True, "locations": LOCATIONS}

    @app.post("/api/search-preview", response_model=SearchPreview)
    def search_preview(search: SearchRequest):
        if (
            search.origin not in LOCATION_NAMES
            or search.destination not in LOCATION_NAMES
        ):
            raise HTTPException(422, "Choose a location from the demo suggestions.")
        if search.origin == search.destination:
            raise HTTPException(
                422, "Choose a destination different from your starting point."
            )
        return SearchPreview(
            origin=search.origin,
            destination=search.destination,
            timing=search.timing,
            # Treat datetime-local as the user's wall-clock preference. No timezone
            # conversion or timetable calculation is performed in Phase 1.
            date=search.date.isoformat(timespec="minutes")
            if search.timing != "now" and search.date
            else None,
        )

    # After `npm run build`, Python can serve the complete app on one port.
    # API routes are registered first so static files cannot shadow them.
    if (frontend_dir / "index.html").is_file():
        app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
    return app


app = create_app()
