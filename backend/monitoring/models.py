from django.db import models

class RobotLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    joint1 = models.FloatField()
    joint2 = models.FloatField()
    joint3 = models.FloatField()
    joint4 = models.FloatField()
    joint5 = models.FloatField()
    joint6 = models.FloatField()

    def __str__(self):
        return f"Log at {self.timestamp}"

class SystemEvent(models.Model):
    EVENT_TYPES = [
        ('LOGIN', 'User Login'),
        ('LOGOUT', 'User Logout'),
        ('APP_ERROR', 'Application Error'),
        ('ROBOT_ERROR', 'Robot Error'),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    message = models.TextField()

    def __str__(self):
        return f"{self.get_event_type_display()} at {self.timestamp}"

class Feedback(models.Model):
    FEEDBACK_TYPE = [
        ('HARDWARE', 'Hardware'),
        ('SOFTWARE', 'Software'),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=FEEDBACK_TYPE)
    message = models.TextField()

    def __str__(self):
        return f"{self.get_type_display()} at {self.timestamp}"
