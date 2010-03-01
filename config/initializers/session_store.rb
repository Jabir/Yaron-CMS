# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_adva_avans_session',
  :secret      => 'fc832968b975607f38d37b6e0a20b7d33372014f80c068b0050ecca03d5930c494dae044e0797178aa29d0e5586483b7e175b1ead1191785b89351d3a95658eb'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
