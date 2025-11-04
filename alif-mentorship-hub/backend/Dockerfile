# Use Python 3.11 slim for smaller image size
FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install postgresql-client in case we switch from SQLite later
RUN apt-get update \
    && apt-get install -y postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker's build cache
# If requirements don't change, this layer is reused
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run as non-root user for security
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Run migrations and start server
# Use 0.0.0.0 to make accessible outside container
CMD python manage.py migrate && \
    python manage.py collectstatic --noinput && \
    python manage.py runserver 0.0.0.0:8000

