from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from ypf_backend.api.views import (
    UserViewSet, FarmViewSet, FieldViewSet, CropViewSet,
    CropPlantingViewSet, YieldRecordViewSet, WeatherDataViewSet,
    YieldPredictionViewSet, RecommendationViewSet
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

urlpatterns = [
    # JWT Token endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API routes
    path('', include(router.urls)),
]
