import django
import pymongo
try:
    from importlib.metadata import version
    print(f"Djongo: {version('djongo')}")
    print(f"PyMongo: {version('pymongo')}")
    print(f"Django: {version('django')}")
except Exception as e:
    print(f"Error getting versions: {e}")
