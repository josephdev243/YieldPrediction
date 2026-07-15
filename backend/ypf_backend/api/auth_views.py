from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class CookieTokenObtainPairView(TokenObtainPairView):
    """Issue JWT pair and persist refresh token in an httpOnly cookie."""

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh = response.data.get("refresh")
        if refresh:
            response.set_cookie(
                "refresh_token",
                refresh,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=60 * 60 * 24 * 7,
            )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    """Allow refresh token to be sourced from the httpOnly cookie."""

    def post(self, request, *args, **kwargs):
        refresh = request.data.get("refresh") or request.COOKIES.get("refresh_token")
        if not refresh:
            return Response({"detail": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={"refresh": refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        if "refresh" in serializer.validated_data:
            response.set_cookie(
                "refresh_token",
                serializer.validated_data["refresh"],
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=60 * 60 * 24 * 7,
            )
        return response


class CookieLogoutView(APIView):
    """Invalidate refresh token and clear auth cookie."""

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token") or request.data.get("refresh")
        if refresh:
            try:
                token = RefreshToken(refresh)
                token.blacklist()
            except Exception:
                # Token may already be invalid/expired; still clear cookie for client state.
                pass

        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie("refresh_token")
        return response
