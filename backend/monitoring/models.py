from django.db import models

# Create your models here.
class ButtonLog(models.Model):
    button = models.CharField(max_length=50)  # Button Name
    message = models.TextField()  # Log Message
    timestamp = models.DateTimeField(auto_now_add=True)  # Time of action

    def __str__(self):
        return f"{self.button} - {self.timestamp}"