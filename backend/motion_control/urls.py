from django.urls import path
<<<<<<< Updated upstream
from .views import IK2DView, MotionProfileView

urlpatterns = [
    path('ik/', IK2DView.as_view(), name='ik-2d'),
    path('<str:profile_name>/', MotionProfileView.as_view(), name='motion-profile'),
=======
from .views import run_motion_profile, move_robot


urlpatterns = [
    path('motion/<str:profile_type>/', run_motion_profile),
    path('move_robot/', move_robot, name='move_robot'),
>>>>>>> Stashed changes
]
