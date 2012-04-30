#!/bin/bash

echo "Adding users..."

USERS=( "nick=miki&gravatarUsername=mileskin" "nick=jill" "nick=mrfoobar" )
for USER in ${USERS[@]}
do
  echo $USER
  curl -d $USER http://localhost:8085/users
  echo ""
  sleep 1 # Sleep, because the browser client can't keep up with near-concurrent updates
done
echo "Done!"
