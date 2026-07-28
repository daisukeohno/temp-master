from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient

import app.main as main_module
from app.main import app, call_switchbot_api, cors_allow_credentials, get_allowed_origins


@pytest.fixture
def client(reset_data_store) -> TestClient:
    return TestClient(app)


class TestLatencyLogsValidation:
    def test_limit_above_maximum_returns_422(self, client):
        response = client.get("/api/latency-logs", params={"limit": 100000})

        assert response.status_code == 422

    def test_limit_below_minimum_returns_422(self, client):
        response = client.get("/api/latency-logs", params={"limit": 0})

        assert response.status_code == 422

    def test_limit_within_range_is_accepted(self, client):
        response = client.get("/api/latency-logs", params={"limit": 10})

        assert response.status_code == 200

    def test_invalid_start_time_returns_400(self, client):
        response = client.get("/api/latency-logs", params={"start_time": "not-a-date"})

        assert response.status_code in (400, 422)

    def test_invalid_end_time_returns_400(self, client):
        response = client.get("/api/latency-logs", params={"end_time": "not-a-date"})

        assert response.status_code in (400, 422)

    def test_latency_stats_invalid_start_time_returns_400(self, client):
        response = client.get("/api/latency-stats", params={"start_time": "not-a-date"})

        assert response.status_code in (400, 422)


class TestUpstreamErrorMasking:
    async def test_non_200_detail_excludes_upstream_body(self, reset_data_store):
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.text = "secret-upstream-body"

        with patch.object(main_module, "SWITCHBOT_TOKEN", "test-token"), \
             patch.object(main_module, "SWITCHBOT_SECRET", "test-secret"), \
             patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

            with pytest.raises(HTTPException) as exc_info:
                await call_switchbot_api("/devices")

            assert "secret-upstream-body" not in exc_info.value.detail
            assert exc_info.value.detail == main_module.UPSTREAM_ERROR_DETAIL

    async def test_request_error_detail_excludes_exception_text(self, reset_data_store):
        with patch.object(main_module, "SWITCHBOT_TOKEN", "test-token"), \
             patch.object(main_module, "SWITCHBOT_SECRET", "test-secret"), \
             patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=httpx.RequestError("internal-host-unreachable")
            )

            with pytest.raises(HTTPException) as exc_info:
                await call_switchbot_api("/devices")

            assert "internal-host-unreachable" not in exc_info.value.detail

    async def test_latency_logs_response_masks_error_message(self, client, reset_data_store):
        await main_module.save_latency_log(
            endpoint="/devices",
            latency_ms=12.3,
            status_code=500,
            success=False,
            error_message="SwitchBot API error: secret-upstream-body",
        )

        response = client.get("/api/latency-logs")

        assert response.status_code == 200
        logs = response.json()["logs"]
        assert len(logs) == 1
        assert "secret-upstream-body" not in logs[0]["error_message"]


class TestImportLimits:
    def test_too_many_devices_rejected(self, client):
        devices = [
            {
                "device_id": f"device-{i}",
                "device_name": "Meter",
                "device_type": "Meter",
                "readings": [],
            }
            for i in range(main_module.MAX_IMPORT_DEVICES + 1)
        ]

        response = client.post("/api/import", json={"devices": devices})

        assert response.status_code in (413, 422)

    def test_invalid_last_updated_returns_400(self, client):
        import_data = {
            "devices": [
                {
                    "device_id": "device-001",
                    "device_name": "Meter",
                    "device_type": "Meter",
                    "last_updated": "not-a-date",
                    "readings": [],
                }
            ]
        }

        response = client.post("/api/import", json=import_data)

        assert response.status_code in (400, 422)

    def test_invalid_reading_timestamp_returns_400(self, client):
        import_data = {
            "devices": [
                {
                    "device_id": "device-001",
                    "device_name": "Meter",
                    "device_type": "Meter",
                    "readings": [
                        {"timestamp": "not-a-date", "temperature": 25.0, "humidity": 60},
                    ],
                }
            ]
        }

        response = client.post("/api/import", json=import_data)

        assert response.status_code in (400, 422)

    def test_empty_reading_timestamp_returns_400(self, client):
        import_data = {
            "devices": [
                {
                    "device_id": "device-001",
                    "device_name": "Meter",
                    "device_type": "Meter",
                    "readings": [
                        {"timestamp": "", "temperature": 25.0, "humidity": 60},
                    ],
                }
            ]
        }

        response = client.post("/api/import", json=import_data)

        assert response.status_code in (400, 422)


class TestCorsConfiguration:
    def test_get_allowed_origins_parses_comma_separated(self, monkeypatch):
        monkeypatch.setenv("ALLOWED_ORIGINS", "https://a.example, https://b.example")

        assert get_allowed_origins() == ["https://a.example", "https://b.example"]

    def test_get_allowed_origins_defaults_to_empty(self, monkeypatch):
        monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)

        assert get_allowed_origins() == []

    def test_wildcard_disables_credentials(self):
        assert cors_allow_credentials(["*"]) is False
        assert cors_allow_credentials(["https://a.example"]) is True

    def test_disallowed_origin_gets_no_cors_header(self, client):
        response = client.get("/healthz", headers={"Origin": "https://evil.example"})

        assert response.headers.get("access-control-allow-origin") != "https://evil.example"

    def test_configured_origin_is_allowed(self, reset_data_store):
        from fastapi import FastAPI

        test_app = FastAPI()
        test_app.add_middleware(
            CORSMiddleware,
            allow_origins=["https://allowed.example"],
            allow_credentials=True,
            allow_methods=["GET", "POST", "OPTIONS"],
            allow_headers=["Content-Type", "Authorization"],
        )

        @test_app.get("/ping")
        async def ping():
            return {"ok": True}

        test_client = TestClient(test_app)
        response = test_client.get("/ping", headers={"Origin": "https://allowed.example"})

        assert response.headers.get("access-control-allow-origin") == "https://allowed.example"
