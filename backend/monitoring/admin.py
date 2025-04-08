from django.contrib import admin
from django.contrib.admin.models import LogEntry

# Register your models here.

class LogEntryAdmin(admin.ModelAdmin):
    list_display = ['action_time', 'user', 'content_type', 'object_repr', 'action_flag']
    list_filter = ['action_time', 'user', 'content_type']
    search_fields = ['object_repr', 'change_message']
    readonly_fields = LogEntry._meta.get_fields()

admin.site.register(LogEntry, LogEntryAdmin)
