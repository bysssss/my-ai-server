ARG SRC_DIR="/src"

FROM python:3.12-slim AS build-image

ARG SRC_DIR
WORKDIR ${SRC_DIR}

COPY --from=ghcr.io/astral-sh/uv:0.11.19 /uv /bin/uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

FROM python:3.12-slim

ARG SRC_DIR
WORKDIR ${SRC_DIR}

COPY --from=build-image ${SRC_DIR} ${SRC_DIR}
COPY src/app ${SRC_DIR}/app

ENV PATH="${SRC_DIR}/.venv/bin:${PATH}"
ENV PYTHONPATH="${SRC_DIR}"
ENV PYTHONUNBUFFERED="1"
ENV PYTHONUTF8="1"

EXPOSE 8080

# Cloud Run이 주입하는 $PORT에 바인딩(기본 8080). shell form + exec = 환경변수 확장 + SIGTERM이 서버에 직접 전달.
CMD exec fastapi run app/main_api.py --app my_fastapi --host 0.0.0.0 --port ${PORT:-8080} --workers 2
