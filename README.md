# immich-slideshow
Custom card for Home Assistant's UI LoveLace which will display images slideshow from Immich server. Card is designed for Chromium web browser running in kiosk mode.

![Screenshot](https://github.com/mulder82/immich-slideshow/raw/master/screenshots/preview.gif)

![Screenshot](https://github.com/mulder82/immich-slideshow/raw/master/screenshots/preview2.gif)

# Plugin installation
1. Download immich-slideshow.js and placeholder.png files,
2. Install plugin (For more details, see [Thomas Loven's Install Guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins))

# Immich server configuration
1. Login into your immich server and create new apiKey

![Screenshot](https://github.com/mulder82/immich-slideshow/raw/master/screenshots/apikey.jpg)

# HomeAssistant configuration
1. Login into HomeAssistant server and add new custom card to the dashboard with the fallowing configuration parameters:

Parameter name | Required | Default value | Description
--- | --- | ---- | ---
host | YES | - | xxx
apikey | YES | - | xxx
slideshow_interval | NO | 6 | Time (in seconds) after new image is loaded
height| NO | auto | Card height (eg. 500px)

# Preview in chromium browser
Run chromium browser using fallowing commands:

1. Linux:

```console
/usr/bin/chromium-browser --noerrdialogs --disable-infobars --ignore-certificate-errors --allow-running-insecure-content --disable-web-security --user-data-dir=<<PATH TO PROFILE DIRECORY>> --kiosk <<DASHBOARD URL>>
```

2. Windows:
```console
start "C:\Program Files\Google\Chrome\Application\" chrome.exe --allow-running-insecure-content --disable-web-security --disable-gpu --user-data-dir=<<PATH TO PROFILE DIRECORY>> --kiosk <<DASHBOARD URL>> &
```
> [!TIP]
> Replace <<PATH TO PROFILE DIRECORY>> and <<DASHBOARD URL>> with valid values.