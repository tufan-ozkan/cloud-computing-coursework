## 🧱 Requirements

- Python 3.12+
- Poetry (for environment & dependency management)
- Docker (to run Redis)
- Redis server (as Celery broker)

---

## 🚀 How to Run the Project

### 1. 📦 Install Poetry (if not already installed)
```
curl -sSL https://install.python-poetry.org | python3 -
```
2. 📂 Install Dependencies
poetry install

3. 🧪 Activate the Virtual Environment
poetry shell

4. 🐳 Run Redis via Docker
docker run -d --name cloud-hw3-redis -p 6379:6379 redis

5. ⚙️ Start Celery Workers (in separate terminals)
poetry run celery -A cloud_hw3.app worker --loglevel=INFO --concurrency=2 --hostname=worker1@%h
poetry run celery -A cloud_hw3.app worker --loglevel=INFO --concurrency=2 --hostname=worker2@%h

6. ▶️ Run the Main Script (in another terminal)
poetry run python src/cloud_hw3/main.py


This will:
Stream and process the dataset
Dispatch distributed tasks to workers
Save the final results to results/results.json
