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

# TODO detecter album lus entier

# TODO proportion de love des albums >= 50

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
      if t.get_name().lower() == tag:
        found = True
        break
  return found

def recommended_tracks_for_top10(artist):

    top_10 = artist.get_top_tracks(limit=10)

    recommended_tracks = {};
    for track in top_10:
      track_tags = track.item.get_tags()
      #print "Track: " + track.item.get_title()
      if not has_tag(missing_tag, track_tags):
        #print "adding " + track.item.get_title()
        recommended_tracks[track.item.get_title()] = track.item
      else:
        print missing_tag + "Found"
        break

    #print recommended_tracks.keys()

    if len(recommended_tracks) > 0:
      print "looking for listened tracks "
      user_tracks = library.get_tracks(artist=artist)
      for user_track in user_tracks:
        #print "found " + user_track.item.get_title()
        if user_track.item.get_title()  in recommended_tracks.keys():
          #print "match " + user_track.item.get_title()
          if user_track.playcount > 0:
            #print "removing " + user_track.item.get_title()
            del recommended_tracks[user_track.item.get_title()]

    print "remaining " + str(len(recommended_tracks))
    return recommended_tracks

def recommended_tracks_for_album(artist, album):
    recommended_tracks = {};

    album_tags = album.item.get_tags()
    if has_tag(marker_tag, album_tags):
        print "Found " + marker_tag
    else:
        album_tracks = album.item.get_tracks()
        for track in album_tracks:
          track_tags = track.get_tags()
          #print "Track: " + track.get_title()
          if not has_tag(missing_tag, track_tags):
            #print "adding " + track.get_title()
            recommended_tracks[track.get_title()] = track
          else:
            print missing_tag + "Found"
            break

        #print "=== candidate album tracks ==="
        #print recommended_tracks_album.keys()

        user_tracks = library.get_tracks(artist=artist, album=top_album.item.get_title())
        for user_track in user_tracks:
          if user_track.item.get_title()  in recommended_tracks.keys():
            if user_track.playcount > 0:
              #print "removing " + user_track.item.get_title()
              del recommended_tracks[user_track.item.get_title()]
          else:
            print "inconsistency on " +  user_track.item.get_title()

    print "remaining " + str(len(recommended_tracks))
    return recommended_tracks

## Parameters

missing_tag = "missing track"
marker_tag = "albums i have listened"

artist_name =  "Portishead"

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



  # now you can use that object every where
  artist = network.get_artist(artist_name)
  #artist.shout("<3")
  print "Artist: " + artist.name

  print "=== TOP 10 ==="
  reco_top_tracks = recommended_tracks_for_top10(artist)


  if len(reco_top_tracks) < 1:
    print "=== TOP ALBUM ==="
    top_albums = artist.get_top_albums(limit=5)
    for top_album in top_albums:
      print "Album: " + top_album.item.get_title()
      reco_album_tracks = recommended_tracks_for_album(artist, top_album)
      if (len(reco_album_tracks) > 0):
        break


  print "=== Tagging one ==="
  if len(reco_top_tracks) > 0:
     #print reco_top_tracks
     reco = reco_top_tracks[reco_top_tracks.keys()[0]]
     print "tagging in top 10 " + reco.get_title()
     reco.add_tag(missing_tag)
  else:
     if len(reco_album_tracks) > 0:
       reco = reco_album_tracks[reco_album_tracks.keys()[0]]
       print "tagging in album " + reco.get_title()
       reco.add_tag(missing_tag)
     else:
       print "no tag"



#track = network.get_track("Iron Maiden", "The Nomad")
#track.love()
#track.add_tags(("awesome", "favorite"))

# type help(pylast.LastFMNetwork) or help(pylast) in a python interpreter to get more help
# about anything and see examples of how it works

