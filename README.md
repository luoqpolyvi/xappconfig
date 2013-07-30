xappconfig
==========

xface app configuration file auto-generator

###Usage
* Install it with npm 

    npm install xappconfig -g

* To create an app.xml with default template

    xappconfig -c

* To update one or more preferences, run
    
    xappconfig -u -i myappid -v 1.0.2
    
###Options
* -c create
* -u update
* -i appid
* -n app name
* -t app type
* -v version
* -icon
* -content source for content
* -m app mode
* -r remote url for native app
* -d description
* -a author
* -s site
* -mail email of author
* -l license
* -f path for app.xml