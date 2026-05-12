FROM python:3.11-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.11-slim

WORKDIR /app
COPY --from=builder /install /usr/local
COPY . .

EXPOSE 8090
CMD ["gunicorn", "evently.wsgi:application", "--bind", "0.0.0.0:8090", "--workers", "4", "--timeout", "30"]