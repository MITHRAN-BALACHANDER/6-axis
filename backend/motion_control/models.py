from django.db import models

class RobotSettings(models.Model):
    speed_percentage = models.FloatField(default=50.0)
    acceleration_percentage = models.FloatField(default=50.0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Robot Settings (Speed: {self.speed_percentage}%, Accel: {self.acceleration_percentage}%)"

    class Meta:
        verbose_name_plural = "Robot Settings"
        get_latest_by = "timestamp"
