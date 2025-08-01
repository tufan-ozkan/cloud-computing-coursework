import json
from cloud_hw3.config import CHUNK_SIZE

def stream_chunks(file_path, chunk_size=CHUNK_SIZE):
    chunk = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            try:
                song = json.loads(line.strip())
                chunk.append(song)
                if len(chunk) >= chunk_size:
                    yield chunk
                    chunk = []

            except Exception:
                continue
        if chunk:
            yield chunk
 
def parse_length(length_str):
    try:
        parts   = length_str.split(':')
        minutes = int(parts[0])
        seconds = int(parts[1])
        return minutes * 60 + seconds  
      
    except Exception:
        return 0

def parse_year(date_str):
    try:
        if '-' in date_str:
            return int(date_str.split('-')[0])  
              
    except Exception:
        return 0
