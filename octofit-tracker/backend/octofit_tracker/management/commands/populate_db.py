from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import connection
from djongo import models as djongo_models


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Deleting old data...'))
        # Drop all collections (both old and new names)
        with connection.cursor() as cursor:
            for collection in ['users', 'teams', 'activities', 'leaderboard', 'workouts',
                             'octofit_tracker_user', 'octofit_tracker_team', 
                             'octofit_tracker_activity', 'octofit_tracker_leaderboard',
                             'octofit_tracker_workout']:
                try:
                    cursor.db_conn.drop_collection(collection)
                except:
                    pass

        self.stdout.write(self.style.SUCCESS('Inserting test data...'))
        # Users
        users = [
            {'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'team': 'marvel'},
            {'name': 'Steve Rogers', 'email': 'cap@marvel.com', 'team': 'marvel'},
            {'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'team': 'dc'},
            {'name': 'Clark Kent', 'email': 'superman@dc.com', 'team': 'dc'},
        ]
        with connection.cursor() as cursor:
            cursor.db_conn['octofit_tracker_user'].insert_many(users)
            cursor.db_conn['octofit_tracker_user'].create_index('email', unique=True)

        # Teams
        teams = [
            {'name': 'marvel', 'members': ['ironman@marvel.com', 'cap@marvel.com']},
            {'name': 'dc', 'members': ['batman@dc.com', 'superman@dc.com']},
        ]
        with connection.cursor() as cursor:
            cursor.db_conn['octofit_tracker_team'].insert_many(teams)

        # Activities
        activities = [
            {'user_email': 'ironman@marvel.com', 'activity': 'Running', 'duration': 30},
            {'user_email': 'cap@marvel.com', 'activity': 'Cycling', 'duration': 45},
            {'user_email': 'batman@dc.com', 'activity': 'Swimming', 'duration': 25},
            {'user_email': 'superman@dc.com', 'activity': 'Flying', 'duration': 60},
        ]
        with connection.cursor() as cursor:
            cursor.db_conn['octofit_tracker_activity'].insert_many(activities)

        # Leaderboard
        leaderboard = [
            {'team': 'marvel', 'points': 75},
            {'team': 'dc', 'points': 85},
        ]
        with connection.cursor() as cursor:
            cursor.db_conn['octofit_tracker_leaderboard'].insert_many(leaderboard)

        # Workouts
        workouts = [
            {'user_email': 'ironman@marvel.com', 'workout': 'Pushups', 'reps': 100},
            {'user_email': 'cap@marvel.com', 'workout': 'Situps', 'reps': 150},
            {'user_email': 'batman@dc.com', 'workout': 'Pullups', 'reps': 80},
            {'user_email': 'superman@dc.com', 'workout': 'Squats', 'reps': 200},
        ]
        with connection.cursor() as cursor:
            cursor.db_conn['octofit_tracker_workout'].insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('Database populated with test data!'))
