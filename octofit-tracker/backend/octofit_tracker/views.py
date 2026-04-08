from rest_framework import viewsets, routers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
import os
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import UserSerializer, TeamSerializer, ActivitySerializer, LeaderboardSerializer, WorkoutSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

@api_view(['GET'])
def api_root(request, format=None):
    """
    API root endpoint.
    
    For Codespace:
    - Returns HTTPS URLs for endpoints accessed via $CODESPACE_NAME-8000.app.github.dev
    - Format: https://$CODESPACE_NAME-8000.app.github.dev/api/[component]/
    
    For localhost:
    - Returns HTTP URLs for local development
    """
    # Check if accessed via codespace domain
    host = request.get_host()
    is_codespace = 'app.github.dev' in host
    
    # Build base URL with proper protocol for codespace
    if is_codespace:
        base_url = f"https://{host}"
    else:
        base_url = request.build_absolute_uri('/').rstrip('/')
    
    return Response({
        'users': f"{base_url}/api/users/",
        'teams': f"{base_url}/api/teams/",
        'activities': f"{base_url}/api/activities/",
        'leaderboard': f"{base_url}/api/leaderboard/",
        'workouts': f"{base_url}/api/workouts/",
    })
