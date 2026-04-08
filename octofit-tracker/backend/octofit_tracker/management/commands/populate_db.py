from django.core.management.base import BaseCommand
from django.db import connection
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Deleting old data...'))
        # Clear all collections
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Inserting test data...'))
        
        # Users
        User.objects.create(name='Tony Stark', email='ironman@marvel.com', team='marvel')
        User.objects.create(name='Steve Rogers', email='cap@marvel.com', team='marvel')
        User.objects.create(name='Bruce Wayne', email='batman@dc.com', team='dc')
        User.objects.create(name='Clark Kent', email='superman@dc.com', team='dc')

        # Teams
        Team.objects.create(name='marvel', members=['ironman@marvel.com', 'cap@marvel.com'])
        Team.objects.create(name='dc', members=['batman@dc.com', 'superman@dc.com'])

        # Activities
        Activity.objects.create(user_email='ironman@marvel.com', activity='Running', duration=30)
        Activity.objects.create(user_email='cap@marvel.com', activity='Cycling', duration=45)
        Activity.objects.create(user_email='batman@dc.com', activity='Swimming', duration=25)
        Activity.objects.create(user_email='superman@dc.com', activity='Flying', duration=60)

        # Leaderboard
        Leaderboard.objects.create(team='marvel', points=75)
        Leaderboard.objects.create(team='dc', points=85)

        # Workouts
        Workout.objects.create(user_email='ironman@marvel.com', workout='Pushups', reps=100)
        Workout.objects.create(user_email='cap@marvel.com', workout='Situps', reps=150)
        Workout.objects.create(user_email='batman@dc.com', workout='Pullups', reps=80)
        Workout.objects.create(user_email='superman@dc.com', workout='Squats', reps=200)

        self.stdout.write(self.style.SUCCESS('Database populated with test data!'))
