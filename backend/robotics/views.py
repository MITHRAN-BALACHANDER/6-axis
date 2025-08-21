from django.http import JsonResponse
from django.urls import get_resolver

def home(request):
    url_patterns = get_resolver().url_patterns
    url_list = []
    for pattern in url_patterns:
        if hasattr(pattern, 'url_patterns'):
            for sub_pattern in pattern.url_patterns:
                url_list.append({
                    'path': str(pattern.pattern) + str(sub_pattern.pattern),
                    'name': sub_pattern.name
                })
        else:
            url_list.append({
                'path': str(pattern.pattern),
                'name': pattern.name
            })
    return JsonResponse({'urls': url_list})
