from web import app
import os

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('WEB_PORT', 80))
