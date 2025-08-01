from cloud_hw3.app   import app
from cloud_hw3.utils import parse_length, parse_year

# Task 1 
@app.task
def map_total_duration(chunk):
    result = sum(parse_length(song.get("Length", "0:00")) for song in chunk)
    return result

@app.task
def reduce_total_duration(results):
    return sum(results)

# Task 3
@app.task
def map_artist_popularity(chunk_data):
    song_counts = {}
    artist_popularities = {}

    for song in chunk_data:
        try:
            artist_str = song.get('Artist(s)', '').strip()

            if not artist_str or ',' in artist_str:
                continue

            popularity = int(song.get('Popularity', 0))

            if artist_str not in song_counts:
                song_counts[artist_str] = 0
                artist_popularities[artist_str] = []

            song_counts[artist_str] += 1
            artist_popularities[artist_str].append(popularity)

        except Exception:
            continue

    return song_counts, artist_popularities


@app.task
def reduce_artist_popularity(mapped_results):
    all_song_counts = {}
    all_artist_popularities = {}

    for song_counts, artist_popularities in mapped_results:
        for artist, count in song_counts.items():

            if artist not in all_song_counts:
                all_song_counts[artist] = 0
                all_artist_popularities[artist] = []

            all_song_counts[artist] += count
            all_artist_popularities[artist].extend(artist_popularities[artist])

    top_artists = sorted(all_song_counts.items(), key=lambda x: x[1], reverse=True)[:100]

    result = {}
    for artist, _ in top_artists:
        pops = all_artist_popularities.get(artist, [])
        result[artist] = sum(pops) / len(pops)

    return result

#Task 4
@app.task
def map_explicit_popularity(chunk_data):
    result = {'yes': [], 'no': []}
    
    for song in chunk_data:
        try:
            explicity_str = str(song.get('Explicit', '')).strip().lower()
            popularity    = int(song.get('Popularity', 0))
            
            if explicity_str in ['yes', 'true', '1']:
                result['yes'].append(popularity)
            else:
                result['no'].append(popularity)
                
        except Exception:
            continue

    return result

@app.task
def reduce_explicit_popularity(results):
    yeses = []
    noes = []

    for result in results:
        yeses.extend(result.get('yes', []))
        noes.extend(result.get('no', []))

    avg_yes = sum(yeses) / len(yeses) 
    avg_no  = sum(noes)  / len(noes) 

    return {
        'yes': avg_yes,
        'no' : avg_no
    }

#Task 5
@app.task
def map_danceability_by_year(chunk_data):
    year_data = {
        'before-2001': [],
        '2001-2012': [],
        'after-2012': []
    }
    for song in chunk_data:
        try:
            year = parse_year(song.get("Release Date", ""))
            danceability = int(song.get("Danceability", 0))

            if year <= 2001:
                year_data['before-2001'].append(danceability)
            elif year <= 2012:
                year_data['2001-2012'].append(danceability)
            else:
                year_data['after-2012'].append(danceability)

        except Exception:
            continue

    return year_data

@app.task
def reduce_danceability_by_year(mapped_results):
    combined = {'before-2001': [], '2001-2012': [], 'after-2012': []}

    for result in mapped_results:
        for key in combined:
            combined[key].extend(result.get(key, []))

    return {
        key: sum(vals) / len(vals) 
        for key, vals in combined.items()
    }
