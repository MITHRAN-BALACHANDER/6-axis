import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'robotics.settings')
django.setup()

from monitoring.models import Feedback

def seed_feedback():
    Feedback.objects.all().delete()
    Feedback.objects.create(type='HARDWARE', message='Hardware initialized successfully.')
    Feedback.objects.create(type='SOFTWARE', message='Software is running.')
    Feedback.objects.create(type='HARDWARE', message='Motor 1 is online.')
    Feedback.objects.create(type='SOFTWARE', message='API is responsive.')

if __name__ == '__main__':
    seed_feedback()
