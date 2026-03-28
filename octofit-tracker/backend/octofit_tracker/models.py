from djongo import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=50, unique=True)
    members = models.JSONField(default=list)  # list of user emails
    def __str__(self):
        return self.name

class Activity(models.Model):
    user_email = models.EmailField()
    activity = models.CharField(max_length=100)
    duration = models.PositiveIntegerField()  # in minutes
    def __str__(self):
        return f"{self.user_email} - {self.activity}"

class Leaderboard(models.Model):
    team = models.CharField(max_length=50)
    points = models.PositiveIntegerField()
    def __str__(self):
        return f"{self.team}: {self.points}"

class Workout(models.Model):
    user_email = models.EmailField()
    workout = models.CharField(max_length=100)
    reps = models.PositiveIntegerField()
    def __str__(self):
        return f"{self.user_email} - {self.workout}"
