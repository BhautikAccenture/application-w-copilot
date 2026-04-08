from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout
from django.db import connection
from bson import ObjectId


class BaseMongoDBSerializer(serializers.ModelSerializer):
    """Base serializer that properly handles MongoDB ObjectId to id conversion"""
    id = serializers.SerializerMethodField()
    
    def get_id(self, obj):
        """Extract the MongoDB _id and convert to string"""
        try:
            # Query the raw collection to get the _id
            table_name = obj._meta.db_table
            with connection.cursor() as cursor:
                collection = cursor.db_conn[table_name]
                
                # Build a query to find this specific document
                # Use a combination of unique fields to identify the document
                query = {}
                
                # For User, use email (unique)
                if isinstance(obj, User) and hasattr(obj, 'email'):
                    query = {'email': obj.email}
                # For Team, use name (unique)
                elif isinstance(obj, Team) and hasattr(obj, 'name'):
                    query = {'name': obj.name}
                # For Activity, use user_email + activity
                elif isinstance(obj, Activity) and hasattr(obj, 'user_email') and hasattr(obj, 'activity'):
                    query = {'user_email': obj.user_email, 'activity': obj.activity}
                # For Leaderboard, use team (unique typically)
                elif isinstance(obj, Leaderboard) and hasattr(obj, 'team'):
                    query = {'team': obj.team}
                # For Workout, use user_email + workout
                elif isinstance(obj, Workout) and hasattr(obj, 'user_email') and hasattr(obj, 'workout'):
                    query = {'user_email': obj.user_email, 'workout': obj.workout}
                
                if query:
                    mongo_doc = collection.find_one(query)
                    if mongo_doc and '_id' in mongo_doc:
                        return str(mongo_doc['_id'])
        except:
            pass
        return None


class UserSerializer(BaseMongoDBSerializer):
    class Meta:
        model = User
        fields = '__all__'


class TeamSerializer(BaseMongoDBSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class ActivitySerializer(BaseMongoDBSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class LeaderboardSerializer(BaseMongoDBSerializer):
    class Meta:
        model = Leaderboard
        fields = '__all__'


class WorkoutSerializer(BaseMongoDBSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
