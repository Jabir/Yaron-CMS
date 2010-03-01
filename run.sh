#!/bin/sh
#export TZ=UTC
# set
cd /var/www/YP-CMS/
thin -C thin.yml restart

