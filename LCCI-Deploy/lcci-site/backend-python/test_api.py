"""
API Testing Utilities for LCCI Backend

This script provides helper functions to test the API endpoints.
Usage: python -m pytest tests/ or use the functions directly
"""

import httpx
import json
from typing import Dict, Any, Optional

BASE_URL = "http://localhost:8000"

class APIClient:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.token = None
        self.client = httpx.Client()
    
    def login(self, username: str, password: str) -> bool:
        """Login and get access token"""
        response = self.client.post(
            f"{self.base_url}/api/auth/login",
            json={"username": username, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            self.token = data["access_token"]
            return True
        return False
    
    def get_headers(self) -> Dict[str, str]:
        """Get authorization headers"""
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    def get(self, endpoint: str, params: Optional[Dict] = None) -> httpx.Response:
        """GET request"""
        return self.client.get(
            f"{self.base_url}{endpoint}",
            headers=self.get_headers(),
            params=params
        )
    
    def post(self, endpoint: str, data: Dict[str, Any]) -> httpx.Response:
        """POST request"""
        return self.client.post(
            f"{self.base_url}{endpoint}",
            headers=self.get_headers(),
            json=data
        )
    
    def patch(self, endpoint: str, data: Dict[str, Any]) -> httpx.Response:
        """PATCH request"""
        return self.client.patch(
            f"{self.base_url}{endpoint}",
            headers=self.get_headers(),
            json=data
        )
    
    def delete(self, endpoint: str) -> httpx.Response:
        """DELETE request"""
        return self.client.delete(
            f"{self.base_url}{endpoint}",
            headers=self.get_headers()
        )

# Example usage
if __name__ == "__main__":
    client = APIClient()
    
    # Test health endpoint
    print("Testing health endpoint...")
    response = client.get("/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    
    # Try to login
    print("Testing login...")
    if client.login("admin", "admin123"):
        print("✓ Login successful!")
        print(f"Token: {client.token[:20]}...\n")
        
        # Get current user
        print("Testing get current user...")
        response = client.get("/api/auth/me")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}\n")
        
        # List services
        print("Testing list services...")
        response = client.get("/api/services/")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    else:
        print("✗ Login failed")
