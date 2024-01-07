# Silicon Labs firmware builder repository

This repository contains Dockerfiles and GitHub actions which build Silicon Labs
firmware.

Supported hardware:
* Sonoff ZBDongle-E
* Sonoff iHost (use ZBDongle-E firmwares)
* EasyIot ZB-GW04 v1.1 and v1.2
* Elelabs ELU013 and Raspi Shield
* Smlight SLZB-07 (may require unlocked [bootloader](https://github.com/darkxst/silabs-firmware-builder/raw/main/firmware_builds/slzb-07/BTL_SLZB07.gbl) first)
* Sparkfun Things Matter MGM240P (requires [bootloader](https://github.com/darkxst/silabs-firmware-builder/blob/main/firmware_builds/mgm240p/bootloader-uart-xmodem_NCP.hex) to be flashed first using Silabs [Simplicity Commander](https://community.silabs.com/s/article/simplicity-commander?language=en_US))

It uses the Silicon Labs Gecko SDK and proprietary Silicon Labs tools such as
the Silicon Labs Configurator (slc) and the Simplicity Commander standalone
utility. This is a fork of the [NabuCasa](https://github.com/NabuCasa/silabs-firmware-builder) silabs firmware builder, adding support for additional hardware.

Three firmware variants are available:
* EmberZNet NCP for Zigbee-only environments, for direct use with Zigbee2MQTT, ZHA or Zigpy or other Zigbee stacks
* RCP Multi-PAN firmware for concurrent communication over Zigbee and Thread
* OpenThread RCP firmware (experimental) Thread-only

RCP Multi-PAN firmware is for use with Home Assistant [SiliconLabs Multiprotocol add-on](https://github.com/home-assistant/addons/blob/master/silabs-multiprotocol/DOCS.md) and OpenThread RCP firmware is for [OpenThread Border Router add-on](https://github.com/home-assistant/addons/blob/master/openthread_border_router/DOCS.md)

## Web Flasher
Flash directly from your browser (only Chrome and Edge supported) [SL Web Flasher](https://darkxst.github.io/silabs-firmware-builder/)

Read this [blog post](https://dialedin.com.au/blog/sonoff-zbdongle-e-rcp-firmware) for more details and instructions for using RCP Multi-pan firmware.

## Home Assistant Add-on
**RCP MultiPan firmware ONLY**  
You can install this HA addon to keep your dongle up to date with latest the RCP  Multi-Pan firmware. This is only for use if you are using the [SiliconLabs Multiprotocol add-on](https://github.com/home-assistant/addons/blob/master/silabs-multiprotocol/DOCS.md).

[Multipan Flasher Addon](https://github.com/darkxst/multipan_flasher/tree/main)

It can also be used for the initial conversion to MultiPan firmware, however you will need to disable ZHA or Zigbee2MQTT while you do this initial flash. You can then install and configure the Silabs Multiprotocol Add-on.

## Pre-Compiled Firmware
Firmware builds can be found in the [firmware_builds](https://github.com/darkxst/silabs-firmware-builder/tree/main/firmware_builds) folder.

`ncp-uart-hw-` EmberZnet pure Zigbee  
`rcp-uart-802154-` RCP MultiPan  
`ot-rcp-` OpenThread Only  

ZBDongle-E and ZB-GW04 v1.1 do not support hardware flow control. Yellow, SkyConnect and ZB-GW04 v1.2 are built with hardware flow control. Various baudrates are available as listed at end of filename.

Use NabuCasa's [Universal-Silabs-Flasher](https://github.com/NabuCasa/universal-silabs-flasher) to flash the `.gbl` files.


## Building locally

To build a firmware locally the build container can be reused. If you use VSCode then simply open the included devcontainer. Or you can manually start the
container locally using Docker, with a build directory bind-mounted, e.g.

```sh
docker run --rm -it \
  --user builder \
  -v $(pwd)/build:/build \
  ghcr.io/darkxst/silabs-firmware-builder:4.2.2
```

To generate a project, use `slc generate`. To replicate/debug build issues in
an existing GitHub action, it is often helpful to just copy the command from
the "Generate Firmware Project" step.

```sh
  slc generate \
      --with="MGM210PA32JIA,simple_led:board_activity" \
      --project-file="/gecko_sdk/protocol/openthread/sample-apps/ot-ncp/rcp-uart-802154.slcp" \
      --export-destination=rcp-uart-802154-yellow \
      --copy-proj-sources --new-project --force \
      --configuration=""
```

Then build it using commands from the "Build Firmware" step:

```sh
cd rcp-uart-802154-yellow
make -f rcp-uart-802154.Makefile release
```

## Support

If you would like to help support further development of my `Silabs firmware` projects consider buying me a coffee!

<a href="https://www.buymeacoffee.com/darkxst" target="_blank"><img src="img/blue-button.png" alt="Buy Me A Coffee" height="41" width="174"></a>
