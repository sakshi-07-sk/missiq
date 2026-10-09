import hashlib
import os
import secrets
import time
from typing import Dict, Optional, Any, List
from models import UserRoleType, UserResponse

class AuthService:
    def __init__(self):
        # In-memory user store: email -> user record
        self.users: Dict[str, Dict[str, Any]] = {}
        # Tokens: token_string -> { "user_id": str, "email": str, "role": str, "expires_at": float }
        self.tokens: Dict[str, Dict[str, Any]] = {}
        # Reset tokens: reset_token -> { "email": str, "expires_at": float }
        self.reset_tokens: Dict[str, Dict[str, Any]] = {}

        # Provision initial Administrator securely
        admin_email = os.getenv("ADMIN_EMAIL", "admin@missiq.ai").lower()
        admin_pwd = os.getenv("ADMIN_PASSWORD", "Admin@MissIQ2026!")
        self._create_user_internal(
            user_id="usr_admin_001",
            full_name="Platform Administrator",
            email=admin_email,
            password=admin_pwd,
            role="admin"
        )

        # Provision initial demo Registered User
        self._create_user_internal(
            user_id="usr_alex_002",
            full_name="Alex Chen",
            email="alex@innovate.io",
            password="Password123!",
            role="user"
        )

    def _hash_password(self, password: str, salt: Optional[str] = None) -> tuple[str, str]:
        if not salt:
            salt = secrets.token_hex(16)
        # PBKDF2 with 100,000 rounds of HMAC-SHA256
        dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return dk.hex(), salt

    def _verify_password(self, password: str, password_hash: str, salt: str) -> bool:
        test_hash, _ = self._hash_password(password, salt)
        return secrets.compare_digest(test_hash, password_hash)

    def _create_user_internal(self, user_id: str, full_name: str, email: str, password: str, role: UserRoleType):
        pwd_hash, salt = self._hash_password(password)
        self.users[email.lower()] = {
            "id": user_id,
            "full_name": full_name,
            "email": email.lower(),
            "password_hash": pwd_hash,
            "salt": salt,
            "role": role,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }

    def register_user(self, full_name: str, email: str, password: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        if email_clean in self.users:
            raise ValueError("An account with this email address already exists.")

        # Enforce server-side role: ALWAYS "user" (Security criterion 2)
        user_id = f"usr_{secrets.token_hex(6)}"
        self._create_user_internal(user_id, full_name.strip(), email_clean, password, "user")
        
        user_record = self.users[email_clean]
        token = self.create_session_token(user_record["id"], user_record["email"], user_record["role"])
        return {
            "token": token,
            "user": UserResponse(
                id=user_record["id"],
                full_name=user_record["full_name"],
                email=user_record["email"],
                role=user_record["role"],
                created_at=user_record["created_at"]
            )
        }

    def login_user(self, email: str, password: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        user_record = self.users.get(email_clean)

        # Generic error message to prevent account enumeration
        if not user_record or not self._verify_password(password, user_record["password_hash"], user_record["salt"]):
            raise ValueError("Invalid email address or password.")

        token = self.create_session_token(user_record["id"], user_record["email"], user_record["role"])
        return {
            "token": token,
            "user": UserResponse(
                id=user_record["id"],
                full_name=user_record["full_name"],
                email=user_record["email"],
                role=user_record["role"],
                created_at=user_record["created_at"]
            )
        }

    def create_session_token(self, user_id: str, email: str, role: str) -> str:
        token = f"msq_{secrets.token_urlsafe(32)}"
        # Token valid for 7 days
        self.tokens[token] = {
            "user_id": user_id,
            "email": email,
            "role": role,
            "expires_at": time.time() + (7 * 86400)
        }
        return token

    def authenticate_token(self, token: Optional[str]) -> Optional[Dict[str, Any]]:
        if not token:
            return None
        # Clean Bearer prefix if provided
        clean_token = token.replace("Bearer ", "").strip()
        record = self.tokens.get(clean_token)
        if not record:
            return None
        if time.time() > record["expires_at"]:
            del self.tokens[clean_token]
            return None

        user = self.users.get(record["email"])
        if not user:
            return None
        return user

    def request_password_reset(self, email: str) -> str:
        email_clean = email.strip().lower()
        token = f"rst_{secrets.token_urlsafe(24)}"
        self.reset_tokens[token] = {
            "email": email_clean,
            "expires_at": time.time() + 3600 # 1 hour
        }
        return token

    def reset_password(self, token: str, new_password: str) -> bool:
        record = self.reset_tokens.get(token)
        if not record or time.time() > record["expires_at"]:
            raise ValueError("Invalid or expired password reset link.")

        email = record["email"]
        user_record = self.users.get(email)
        if not user_record:
            raise ValueError("User not found.")

        new_hash, new_salt = self._hash_password(new_password)
        user_record["password_hash"] = new_hash
        user_record["salt"] = new_salt
        del self.reset_tokens[token]
        return True

    def get_all_users_for_admin(self) -> List[Dict[str, Any]]:
        res = []
        for u in self.users.values():
            res.append({
                "id": u["id"],
                "full_name": u["full_name"],
                "email": u["email"],
                "role": u["role"],
                "created_at": u["created_at"]
            })
        return res

auth_service = AuthService()
