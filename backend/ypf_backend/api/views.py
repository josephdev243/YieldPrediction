from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.db.models import Q, Count, Sum, Avg
from ypf_backend.farms.models import (
    Farm, Field, Crop, CropPlanting, YieldRecord, WeatherData, 
    YieldPrediction, Recommendation
)
from ypf_backend.api.serializers import (
    UserSerializer, UserRegistrationSerializer, FarmSerializer, FieldSerializer,
    CropSerializer, CropPlantingSerializer, YieldRecordSerializer, WeatherDataSerializer,
    YieldPredictionSerializer, RecommendationSerializer, FarmDashboardSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """User management endpoints."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """User registration endpoint."""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Get current user profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class FarmViewSet(viewsets.ModelViewSet):
    """Farm management endpoints."""
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['user', 'climate_zone']
    search_fields = ['name', 'location']
    
    def get_queryset(self):
        return Farm.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        """Get farm dashboard summary."""
        farm = self.get_object()
        active_crops = CropPlanting.objects.filter(
            field__farm=farm,
            status__in=['planned', 'growing']
        ).count()
        recent_yield = YieldRecord.objects.filter(
            planting__field__farm=farm
        ).aggregate(avg_yield=Avg('yield_per_hectare'))['avg_yield']
        pending_recommendations = Recommendation.objects.filter(
            farm=farm,
            is_read=False
        ).count()
        current_weather = WeatherData.objects.filter(farm=farm).latest('date')
        
        data = {
            'farm_id': farm.id,
            'farm_name': farm.name,
            'total_area': farm.total_area_hectares,
            'active_crops': active_crops,
            'total_fields': farm.fields.count(),
            'recent_yield': recent_yield,
            'pending_recommendations': pending_recommendations,
            'current_weather': WeatherDataSerializer(current_weather).data
        }
        return Response(data)


class FieldViewSet(viewsets.ModelViewSet):
    """Field management endpoints."""
    queryset = Field.objects.all()
    serializer_class = FieldSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['farm']
    
    def get_queryset(self):
        return Field.objects.filter(farm__user=self.request.user)


class CropViewSet(viewsets.ReadOnlyModelViewSet):
    """Crop information endpoints (read-only)."""
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name', 'scientific_name']


class CropPlantingViewSet(viewsets.ModelViewSet):
    """Crop planting management."""
    queryset = CropPlanting.objects.all()
    serializer_class = CropPlantingSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['field', 'crop', 'status']
    
    def get_queryset(self):
        return CropPlanting.objects.filter(field__farm__user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_harvested(self, request, pk=None):
        """Mark a crop planting as harvested."""
        planting = self.get_object()
        planting.status = 'harvested'
        planting.save()
        return Response({'status': 'marked as harvested'})


class YieldRecordViewSet(viewsets.ModelViewSet):
    """Yield record management."""
    queryset = YieldRecord.objects.all()
    serializer_class = YieldRecordSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['planting', 'quality_grade']
    
    def get_queryset(self):
        return YieldRecord.objects.filter(planting__field__farm__user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get yield analytics."""
        yields = self.get_queryset()
        stats = {
            'total_harvested_kg': yields.aggregate(Sum('quantity_harvested_kg'))['quantity_harvested_kg__sum'] or 0,
            'average_yield_per_hectare': yields.aggregate(Avg('yield_per_hectare'))['yield_per_hectare__avg'] or 0,
            'total_records': yields.count(),
        }
        return Response(stats)


class WeatherDataViewSet(viewsets.ReadOnlyModelViewSet):
    """Weather data endpoints."""
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['farm', 'date']
    ordering = ['-date']
    
    def get_queryset(self):
        return WeatherData.objects.filter(farm__user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def forecast(self, request):
        """Get weather forecast for farms."""
        # This would integrate with external weather API
        farm_id = request.query_params.get('farm_id')
        if farm_id:
            farm = Farm.objects.get(id=farm_id, user=request.user)
            # Call weather API here and return forecast data
            return Response({'forecast': []})
        return Response({'error': 'farm_id required'}, status=status.HTTP_400_BAD_REQUEST)


class YieldPredictionViewSet(viewsets.ReadOnlyModelViewSet):
    """Yield prediction endpoints."""
    queryset = YieldPrediction.objects.all()
    serializer_class = YieldPredictionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['planting']
    
    def get_queryset(self):
        return YieldPrediction.objects.filter(planting__field__farm__user=self.request.user)


class RecommendationViewSet(viewsets.ModelViewSet):
    """Recommendation endpoints."""
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['farm', 'category', 'priority', 'is_read']
    
    def get_queryset(self):
        return Recommendation.objects.filter(farm__user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a recommendation as read."""
        recommendation = self.get_object()
        recommendation.is_read = True
        recommendation.save()
        return Response({'status': 'marked as read'})
