from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # Temporarily disable CSRF for testing
def test_api(request):
    return JsonResponse({"message": "Django Backend Connected!"})
