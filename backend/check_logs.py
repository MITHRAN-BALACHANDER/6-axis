from pymongo import MongoClient
import certifi

uri = "mongodb+srv://muralis:Msk%402006@6-axis-cluster.shly9bz.mongodb.net/?retryWrites=true&w=majority&appName=6-axis-Cluster"
client = MongoClient(uri, tlsCAFile=certifi.where())
db = client['6-axis-db']

print("Last 20 System Events:")
events = list(db.monitoring_systemevent.find().sort('timestamp', -1).limit(20))
for event in events:
    print(f"Time: {event.get('timestamp')} | Type: {event.get('event_type')} | Msg: {event.get('message')}")
