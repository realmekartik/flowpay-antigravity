from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "FlowPay AntiGravity"
    ENVIRONMENT: str = "development"  # development | staging | production
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Security & Tokens
    SECRET_KEY: str = "supersecret_flowpay_antigravity_jwt_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Database
    DATABASE_URL: str = "sqlite:///./flowpay.db"

    # AI Engine & Rate Limits
    GEMINI_API_KEY: str = ""
    AI_MATCHING_THRESHOLD: float = 0.75
    RATE_LIMIT_AI_RPM: int = 10        # Max AI requests per minute per client
    RATE_LIMIT_GENERAL_RPM: int = 60   # Max API requests per minute per client

    # PayPal Escrow Credentials (Sandbox / Live)
    PAYPAL_MODE: str = "sandbox"       # sandbox | live
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    PAYPAL_SECRET: str = ""            # Alias for PAYPAL_CLIENT_SECRET
    PAYPAL_WEBHOOK_ID: str = ""

    @property
    def paypal_secret_key(self) -> str:
        return self.PAYPAL_CLIENT_SECRET or self.PAYPAL_SECRET or ""

    @property
    def paypal_base_url(self) -> str:
        if self.PAYPAL_MODE.lower() == "live":
            return "https://api-m.paypal.com"
        return "https://api-m.sandbox.paypal.com"

    # Escrow Platform Parameters
    ESCROW_FEE_PERCENTAGE: float = 2.5
    PLATFORM_WALLET_ADDRESS: str = "0xFLOWPAY_ANTIGRAVITY_ESCROW_VAULT_ADDRESS"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
