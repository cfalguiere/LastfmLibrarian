import os
import sys
import time

import pylast

# You have to have your own unique two values for API_KEY and API_SECRET
# Obtain yours from http://www.last.fm/api/account for Last.fm
# In order to perform a write operation you need to authenticate yourself
#password_hash = pylast.md5("YOUR_PASSWORD")


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

secrets = None
secrets = load_secrets_from_env()
username = secrets["username"]
print username

network = login(secrets)

library = pylast.Library(user=username, network=network)


# now you can use that object every where
artist = network.get_artist("System of a Down")
#artist.shout("<3")
print artist

top_albums = artist.get_top_albums(limit=1)
for top_album in top_albums:
  print top_album.item
#  album = network.get_album(artist, top_album)
  album_tracks = top_album.item.get_tracks()
  for track1 in album_tracks:
    print track1.get_title()
  print "=== listened ==="
  listened_tracks = library.get_tracks(artist=artist, album=top_album.item.get_title())
  for track2 in listened_tracks:
    print track2.item.get_title()
    print track2.playcount
    #count = track2.item.get_userplaycount()
    #print count

#track = network.get_track("Iron Maiden", "The Nomad")
#track.love()
#track.add_tags(("awesome", "favorite"))

# type help(pylast.LastFMNetwork) or help(pylast) in a python interpreter to get more help
# about anything and see examples of how it works
