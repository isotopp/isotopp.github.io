---
author: isotopp
date: "2025-08-12T01:02:03Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- iot
- home automation
title: Athom CO2 Sensors
---

Cheap and integrated CO2 sensors are finally available.
I got mine from [Athom](https://www.athom.tech/blank-1/co2-sensor).
They cost $25 per device.

The device uses an ESC32C3 (4M) as a foundation and sports a Sensirion SCD 40.
It does measure CO2 in range from 400-2000 ppm with 5% accuracy (that's the Sensirion Spec),
and also acts as a Bluetooth Proxy (because the ESP32 can do that).

Unpacking is easy enough.
Connecting to the Wifi AP offered by the unconfigured device with an iPhone did not work
("Cannot join ..."), but configuration via Bluetooth is even easier and better.

For this you need to run the Home Assistant App with an Admin account,
on a device with Bluetooth support, for example an iPhone, or in my case, a Mac mini Desktop.

The new device is autodetected in Bluetooth, and you can select it in Settings->Devices.
Enter the Wifi Credentials, and it joins the Wifi and will be autodetected as a new ESPHome Device.
It can then be integrated, and delivers measurements.

![](/uploads/2025/08/athom-01.png)
*Athom Device delivering CO2 measurements as a graph and a PPM display.*

{{< reveal question="Code for the display shown above (Yaml Fragment in Home Assistant)." >}}
```yaml
type: vertical-stack
cards:
  - chart_type: line
    period: 5minute
    type: statistics-graph
    entities:
      - entity: sensor.athom_co2_sensor_b33722_co2
        name: Bibliothek CO2
    stat_types:
      - mean
      - max
      - min
    hide_legend: false
    title: Bibliothek CO2
    days_to_show: 2
    logarithmic_scale: false
  - show_name: true
    show_icon: true
    show_state: true
    type: glance
    entities:
      - entity: sensor.athom_co2_sensor_b33722_co2
        name: Bibliothek
    state_color: false
```
{{< /reveal >}}

The device has an Air Quality LED.
This one has an entity, and you can turn it off or dim it – for 5 seconds.
The LED is also controlled by the firmware, and your settings will be overwritten within a few seconds.
This means the LED is always on at 50% in green, yellow or red, depending on CO2 level.
This is less bad than it sounds, because the dark see-through case dims the LED.

The entire assembly of "USB Power Supply" plus "Stick with the sensor on top" is rather large.
You will need to find a safe wall socket to stick it into,
so that nobody catches the device and breaks it off.
Or find a USB power Supply with an angled USB Socket.

![](/uploads/2025/08/athom-02.png)
*[Athom](https://www.athom.tech/blank-1/co2-sensor) order page with technical data.*
