import time
from collections import defaultdict
from typing import Dict, List
from fastapi import Request, HTTPException, status
from config import settings

class RateLimiterService:
    """
    In-memory Sliding-Window Rate Limiter for FastAPI.
    Defends AI prompt generation and critical API endpoints against DoS & quota exhaustion.
    """

    def __init__(self):
        # Maps IP -> list of timestamps
        self.request_history: Dict[str, List[float]] = defaultdict(list)

    def check_rate_limit(self, request: Request, max_requests: int, window_seconds: int = 60):
        # Obtain client IP address
        client_ip = request.client.host if request.client else "127.0.0.1"
        # Respect X-Forwarded-For header if behind reverse proxy
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()

        now = time.time()
        window_start = now - window_seconds

        # Clean old timestamps outside window
        timestamps = [t for t in self.request_history[client_ip] if t > window_start]
        self.request_history[client_ip] = timestamps

        if len(timestamps) >= max_requests:
            retry_after = int(window_seconds - (now - timestamps[0]))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {max_requests} requests per {window_seconds}s allowed.",
                headers={"Retry-After": str(max(1, retry_after))}
            )

        self.request_history[client_ip].append(now)

rate_limiter = RateLimiterService()

def rate_limit_ai(request: Request):
    """Dependency for AI endpoints (strict rate limit)."""
    rate_limiter.check_rate_limit(request, max_requests=settings.RATE_LIMIT_AI_RPM, window_seconds=60)

def rate_limit_general(request: Request):
    """Dependency for standard API endpoints."""
    rate_limiter.check_rate_limit(request, max_requests=settings.RATE_LIMIT_GENERAL_RPM, window_seconds=60)
