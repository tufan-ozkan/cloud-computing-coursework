import json
from celery import chord, group
from cloud_hw3.utils import stream_chunks
from cloud_hw3.config import FILE_PATH, RESULT_PATH, CHUNK_SIZE
from cloud_hw3.tasks import ( 
    map_total_duration,       reduce_total_duration,
    map_artist_popularity,    reduce_artist_popularity,
    map_explicit_popularity,  reduce_explicit_popularity,
    map_danceability_by_year, reduce_danceability_by_year
)

def main():
    # Stream data in chunks
    chunks = list(stream_chunks(FILE_PATH, chunk_size=CHUNK_SIZE))

    # Task 1: Total Duration
    task1_flow = chord(
        group(map_total_duration.s(chunk) for chunk in chunks),
        reduce_total_duration.s()
    )
    total_duration = task1_flow.apply_async().get()

    # Task 2: Average Duration
    total_lines = sum(len(chunk) for chunk in chunks)
    average_duration = total_duration / total_lines

    # Task 3: Artist Popularity
    task3_flow = chord(
        group(map_artist_popularity.s(chunk) for chunk in chunks),
        reduce_artist_popularity.s()
    )
    artist_popularity = task3_flow.apply_async().get()

    # Task 4: Explicit Popularity
    task4_flow = chord(
        group(map_explicit_popularity.s(chunk) for chunk in chunks),
        reduce_explicit_popularity.s()
    )
    explicit_popularity = task4_flow.apply_async().get()

    # Task 5: Danceability by Year
    task5_flow = chord(
        group(map_danceability_by_year.s(chunk) for chunk in chunks),
        reduce_danceability_by_year.s()
    )
    dancebyyear = task5_flow.apply_async().get()

    # Save to json
    with open(RESULT_PATH, "w") as f:
        json.dump({
            "total"              : total_duration,
            "average"            : average_duration,
            "artist-popularity"  : artist_popularity,
            "explicit-popularity": explicit_popularity,
            "dancebyyear"        : dancebyyear
        }, f, indent=4)

if __name__ == "__main__":
    main()
