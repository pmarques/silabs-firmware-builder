# Silicon Labs firmware builder repository

This repository contains Dockerfiles and GitHub actions which build Silicon Labs
firmware for Home Assistant Yellow, SkyConnect, ZB-GW04 v1.1, ZB-GW04 v1.2, and Sonoff ZBDongle-E.
The current build process generates only RCPMultiPAN firmware files. Optional firmware files for dongles supporting RTC/CTS hardware flow control with 230400 baud are also generated.

It uses the Silicon Labs Gecko SDK and proprietary Silicon Labs tools such as
the Silicon Labs Configurator (slc) and the Simplicity Commander standalone
utility.

## Building locally

To build a firmware locally the build container can be reused. Simply start the
container local with a build directory bind-mounted, e.g.

```sh
docker run --rm -it \
  --user builder \
  -v $(pwd)/build:/build \
  ghcr.io/ksjh/silabs-firmware-builder:4.2.2
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

## Pre-compiled firmware files
Pre-compiled firmware files are available on github. The github actions build them automatically after commits to the repo. On the top of the github page, under "Actions", you can find previous runs and "Artifacts" (lower part of the page of one run). 

## Naming convention of pre-build firmware
The names of the resulting files are not completely self-explanatory. The file ``rcp-uart-802154-zbdonglee.zip`` is the right one for a Sonoff ZBDongle-E with RTS-CTS handshaking with 115200 baud. Among other things, it contains the required firmware file ``build/release/rcp-uart-802154.gbl``. The naming convention is similar for other hardware.

The ZB-GW04 v1.1 is the only firmware file that does **not** use hardware (RTS-CTS) handshaking.
