from djongo import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.CharField(max_length=50)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=50, unique=True)
    members = models.JSONField(default=list)  # list of user emails
    
    class Meta:
        db_table = 'teams'
    
    def __str__(self):
        return self.name

class Activity(models.Model):
    user_email = models.EmailField()
    activity = models.CharField(max_length=100)
    duration = models.PositiveIntegerField()  # in minutes
    
    class Meta:
        db_table = 'activities'
    
    def __str__(self):
        return f"{self.user_email} - {self.activity}"

class Leaderboard(models.Model):
    team = models.CharField(max_length=50)
    points = models.PositiveIntegerField()
    
    class Meta:
        db_table = 'leaderboard'
    
    def __str__(self):
        return f"{self.team}: {self.points}"

class Workout(models.Model):
    user_email = models.EmailField()
    workout = models.CharField(max_length=100)
    reps = models.PositiveIntegerField()
    
    class Meta:
        db_table = 'workouts'
    
    def __str__(self):
        return f"{self.user_email} - {self.workout}"
