# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_helloworld_session',
  :secret      => '89a073ab94cd9d78a025d1b92a12ec31568881e31c8d34b0644040004f63d180f52cd81f9aaabf3598ff2c52e6f2f2cc29ef6838390b7913ea76d9ed4d38476d'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
