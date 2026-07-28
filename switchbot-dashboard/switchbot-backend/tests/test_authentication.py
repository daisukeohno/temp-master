from unittest.mock import AsyncMock, patch

import app.main as main_module
from app.main import MeterDevice, data_store

from tests.conftest import TEST_API_KEY


class TestBackupEndpointAuth:
    def test_backup_requires_api_key(self, client):
        response = client.get("/api/backup")

        assert response.status_code == 401
        assert "api key" in response.json()["detail"].lower()

    def test_backup_wrong_api_key(self, client):
        response = client.get("/api/backup", headers={"X-API-Key": "wrong-key"})

        assert response.status_code == 401

    def test_backup_valid_api_key(self, client):
        response = client.get("/api/backup", headers={"X-API-Key": TEST_API_KEY})

        assert response.status_code == 200
        assert response.headers["content-type"] == "application/x-sqlite3"

    def test_backup_valid_bearer_token(self, client):
        response = client.get(
            "/api/backup", headers={"Authorization": f"Bearer {TEST_API_KEY}"}
        )

        assert response.status_code == 200

    def test_backup_fails_closed_when_key_unset(self, client):
        with patch.object(main_module, "DASHBOARD_API_KEY", ""):
            response = client.get("/api/backup", headers={"X-API-Key": "anything"})

            assert response.status_code == 503
            assert "not configured" in response.json()["detail"].lower()


class TestImportEndpointAuth:
    def test_import_requires_api_key(self, client):
        response = client.post("/api/import", json={"devices": []})

        assert response.status_code == 401

    def test_import_wrong_api_key(self, client):
        response = client.post(
            "/api/import", json={"devices": []}, headers={"X-API-Key": "wrong-key"}
        )

        assert response.status_code == 401

    def test_import_valid_api_key(self, client):
        response = client.post(
            "/api/import", json={"devices": []}, headers={"X-API-Key": TEST_API_KEY}
        )

        assert response.status_code == 200
        assert response.json()["imported_devices"] == 0

    def test_import_fails_closed_when_key_unset(self, client):
        with patch.object(main_module, "DASHBOARD_API_KEY", ""):
            response = client.post(
                "/api/import", json={"devices": []}, headers={"X-API-Key": TEST_API_KEY}
            )

            assert response.status_code == 503


class TestRefreshEndpointAuth:
    def test_refresh_requires_api_key(self, client):
        response = client.post("/api/meters/refresh")

        assert response.status_code == 401

    def test_refresh_wrong_api_key(self, client):
        response = client.post(
            "/api/meters/refresh", headers={"X-API-Key": "wrong-key"}
        )

        assert response.status_code == 401

    def test_refresh_valid_api_key(self, client, reset_data_store):
        with patch.object(main_module, "SWITCHBOT_TOKEN", "test-token"), \
             patch.object(main_module, "SWITCHBOT_SECRET", "test-secret"), \
             patch("app.main.collect_data", new_callable=AsyncMock):
            data_store.devices["device-001"] = MeterDevice(
                device_id="device-001",
                device_name="Test Meter",
                device_type="Meter",
            )

            response = client.post(
                "/api/meters/refresh", headers={"X-API-Key": TEST_API_KEY}
            )

            assert response.status_code == 200
            assert response.json()["status"] == "ok"

    def test_refresh_fails_closed_when_key_unset(self, client):
        with patch.object(main_module, "DASHBOARD_API_KEY", ""):
            response = client.post(
                "/api/meters/refresh", headers={"X-API-Key": TEST_API_KEY}
            )

            assert response.status_code == 503


class TestReadOnlyEndpointsRemainPublic:
    def test_healthz_no_auth(self, client):
        assert client.get("/healthz").status_code == 200

    def test_meters_no_auth(self, client):
        assert client.get("/api/meters").status_code == 200

    def test_status_no_auth(self, client):
        assert client.get("/api/status").status_code == 200


class TestLatencyLogsValidation:
    def test_limit_upper_bound_rejected(self, client):
        response = client.get("/api/latency-logs?limit=5000")

        assert response.status_code == 422

    def test_limit_lower_bound_rejected(self, client):
        response = client.get("/api/latency-logs?limit=0")

        assert response.status_code == 422

    def test_limit_within_bounds_accepted(self, client):
        response = client.get("/api/latency-logs?limit=500")

        assert response.status_code == 200

    def test_invalid_start_time_returns_400(self, client):
        response = client.get("/api/latency-logs?start_time=not-a-date")

        assert response.status_code == 400
        assert "start_time" in response.json()["detail"].lower()

    def test_invalid_end_time_returns_400(self, client):
        response = client.get("/api/latency-logs?end_time=not-a-date")

        assert response.status_code == 400

    def test_invalid_stats_start_time_returns_400(self, client):
        response = client.get("/api/latency-stats?start_time=not-a-date")

        assert response.status_code == 400
