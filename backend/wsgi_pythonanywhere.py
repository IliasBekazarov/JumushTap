import sys
import os

# ✅ jumushtap001 — сиздин username
path = '/home/jumushtap001/JumushTap/backend'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
