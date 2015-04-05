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

def has_tag(tag, tags):
  found = False
  if len(tags) > 0:
    for t in tags:
      if t.get_name().lower() == tag:
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


  artists = library.get_artists(limit=None)
  for artist in artists:
      print artist

