import os
import sys
import time

import pylast

# You have to have your own unique two values for API_KEY and API_SECRET
# Obtain yours from http://www.last.fm/api/account for Last.fm
# In order to perform a write operation you need to authenticate yourself
#password_hash = pylast.md5("YOUR_PASSWORD")

# TODO limiter le nombre a 1
# faire attention aux missing deja poses

# TODO ignorer les morceaux qui n'existent pas sur spotify

# TODO loved pas sur spotify ?


#def load_secrets_from_yaml():
#    secrets_file = "pylast.yaml"
#    if os.path.isfile(secrets_file):
#        import yaml  # pip install pyyaml
#        with open(secrets_file, "r") as f:  # see example_test_pylast.yaml
#            doc = yaml.load(f)

def load_secrets_from_env():
        doc = {}
        try:
            doc["username"] = os.environ['PYLAST_USERNAME'].strip()
            doc["password_hash"] = os.environ['PYLAST_PASSWORD_HASH'].strip()
            doc["api_key"] = os.environ['PYLAST_API_KEY'].strip()
            doc["api_secret"] = os.environ['PYLAST_API_SECRET'].strip()
        except KeyError:
            pytest.skip("Missing environment variables: PYLAST_USERNAME etc.")
        return doc

def login(secrets):
      USERNAME = secrets["username"]
      PASSWORD_HASH = secrets["password_hash"]

      API_KEY = secrets["api_key"]
      API_SECRET = secrets["api_secret"]

      network = pylast.LastFMNetwork(
        api_key=API_KEY, api_secret=API_SECRET,
        username=USERNAME, password_hash=PASSWORD_HASH)
      return network

def has_tag(tag, tags):
  found = False
  if len(tags) > 0:
    for t in tags:
      if t.name == tag:
        found = True
        break
  return found

## Parameters


## Main

if __name__ == '__main__':
  if (sys.stdout.encoding is None):
        print >> sys.stderr, "please set python env PYTHONIOENCODING=UTF-8, example: export PYTHONIOENCODING=UTF-8, when write to stdout."
        exit(1)

  secrets = None
  secrets = load_secrets_from_env()
  username = secrets["username"]
  print "User: " + username

  network = login(secrets)
  library = pylast.Library(user=username, network=network)


  artist_name =  "The Last Shadow Puppets"

  # now you can use that object every where
  artist = network.get_artist(artist_name)
  #artist.shout("<3")
  print "Artist: " + artist.name

  marker_tag = "albums i have listened"
  missing_tag = "missing track"
  missing_top_tag = "missing top track"

  print "=== TOP 10 ==="
  top_10 = artist.get_top_tracks(limit=10)
  recommended_tracks = {};
  for track in top_10:
    track_tags = track.item.get_tags()
    print "Track: " + track.item.get_title()
    if not has_tag(missing_top_tag, track_tags):
      recommended_tracks[track.item.get_title()] = track.item

  print "=== candidate tracks ==="
  print recommended_tracks.keys()

  print "=== listened ==="
  user_tracks = library.get_tracks(artist=artist)
  for user_track in user_tracks:
      #try:
        print "user track " + user_track.item.get_title()
        if user_track.item.get_title()  in recommended_tracks:
          if user_track.playcount > 0:
              print "removing " + user_track.item.get_title()
              del recommended_tracks[user_track.item.get_title()]
      #except:
        #print "error"
        #print user_track.item

  print "=== recommended ==="
  print recommended_tracks.keys()

  print "=== tagging ==="
  for rec_title, rec_track in recommended_tracks.iteritems():
    print "tagging " + rec_track.get_title()
    rec_track.add_tag(missing_top_tag)

  print "=== TOP ALBUM ==="
  top_albums = artist.get_top_albums(limit=1)
  for top_album in top_albums:
    print "Album: " + top_album.item.get_title()
    album_tags = top_album.item.get_tags()
    if has_tag(marker_tag, album_tags):
        print "Found " + marker_tag
    else:
        album_tracks = top_album.item.get_tracks()
        recommended_tracks = {};
        for track in album_tracks:
          track_tags = track.get_tags()
          print "Track: " + track.get_title()
          if not has_tag(missing_tag, track_tags):
            recommended_tracks[track.get_title()] = track

        print "=== candidate album tracks ==="
        print recommended_tracks.keys()

        print "=== listened ==="
        user_tracks = library.get_tracks(artist=artist, album=top_album.item.get_title())
        for user_track in user_tracks:
          if user_track.item.get_title()  in recommended_tracks:
            if user_track.playcount > 0:
              print "removing " + user_track.item.get_title()
              del recommended_tracks[user_track.item.get_title()]
          else:
            print "inconsistency on " +  user_track.item.get_title()

        print "=== recommended ==="
        print recommended_tracks.keys()
        print "=== tagging ==="
        for rec_title, rec_track in recommended_tracks.iteritems():
          print "tagging " + rec_track.get_title()
          rec_track.add_tag(missing_tag)

#track = network.get_track("Iron Maiden", "The Nomad")
#track.love()
#track.add_tags(("awesome", "favorite"))

# type help(pylast.LastFMNetwork) or help(pylast) in a python interpreter to get more help
# about anything and see examples of how it works

