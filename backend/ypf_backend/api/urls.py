from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ypf_backend.api.auth_views import CookieTokenObtainPairView, CookieTokenRefreshView, CookieLogoutView
from ypf_backend.api.views import (
    UserViewSet, FarmViewSet, FieldViewSet, CropViewSet,
    CropPlantingViewSet, YieldRecordViewSet, WeatherDataViewSet,
    YieldPredictionViewSet, RecommendationViewSet, InputUsageViewSet,
    PestDiseaseAlertViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'farms', FarmViewSet, basename='farm')
router.register(r'fields', FieldViewSet, basename='field')
router.register(r'crops', CropViewSet, basename='crop')
router.register(r'plantings', CropPlantingViewSet, basename='planting')
router.register(r'yields', YieldRecordViewSet, basename='yield')
router.register(r'weather', WeatherDataViewSet, basename='weather')
router.register(r'predictions', YieldPredictionViewSet, basename='prediction')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')
router.register(r'input-usages', InputUsageViewSet, basename='input-usage')
router.register(r'pest-alerts', PestDiseaseAlertViewSet, basename='pest-alert')

urlpatterns = [
    # JWT Token endpoints
    path('auth/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', CookieLogoutView.as_view(), name='token_logout'),
    
    # API routes
    path('', include(router.urls)),
]
