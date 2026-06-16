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

ENV PATH="${SRC_DIR}/.venv/bin:${PATH}"
ENV PYTHONPATH="${SRC_DIR}"
ENV PYTHONUNBUFFERED="1"
ENV PYTHONUTF8="1"
