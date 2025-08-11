from django.core.management.base import BaseCommand
from monitoring.models import RobotLog, SystemEvent, Feedback

class Command(BaseCommand):
    help = 'Clears all logs from the database'

    def handle(self, *args, **kwargs):
        robot_logs_deleted = RobotLog.objects.all().delete()
        system_events_deleted = SystemEvent.objects.all().delete()
        feedback_deleted = Feedback.objects.all().delete()

        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {robot_logs_deleted[0]} robot logs.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {system_events_deleted[0]} system events.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {feedback_deleted[0]} feedback entries.'))
