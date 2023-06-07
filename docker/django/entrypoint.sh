#!/bin/sh

echo 'Waiting for postgres...'

while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
    sleep 0.1
done

echo 'PostgreSQL started'

echo 'Running migrations...'
python manage.py makemigrations
python manage.py makemigrations authentication
python manage.py makemigrations crm
python manage.py migrate

echo 'Checking for admin account...'
cat <<EOF | python manage.py shell
from django.contrib.auth import get_user_model

User = get_user_model()  # get the currently active user model,

User.objects.filter(username='admin').exists() or \
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
EOF


#echo 'Collecting static files...'
#python manage.py collectstatic --no-input

exec "$@"