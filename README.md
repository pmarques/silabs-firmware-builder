# Silicon Labs firmware builder repository

This repository contains Dockerfiles and GitHub actions which build Silicon Labs
firmware for Home Assistant Yellow, SkyConnect, ZB-GW04 v1.1, ZB-GW04 v1.2, and Sonoff ZBDongle-E.

It is a fork of the [NabuCasa silabs firmware builder](https://github.com/NabuCasa/silabs-firmware-builder), all credits go to [NabuCasa](https://github.com/NabuCasa) and [agners](https://github.com/agners). I just extended their work for other hardware. 

It uses the Silicon Labs Gecko SDK and proprietary Silicon Labs tools such as
the Silicon Labs Configurator (slc) and the Simplicity Commander standalone
utility.

Both **RCP Multi-PAN** firmware for use concurrent communication over Zigbee and Thread and **EmberZNet NCP** firmware are built. The **RCP Multi-PAN** firmware can be used with the Home Assistant [SiliconLabs Zigbee/OpenThread Multiprotocol](https://github.com/home-assistant/addons/tree/master/silabs-multiprotocol) add-on, whereas the **EmberZNet NCP** version is used in pure Zigbee environments. 

## Building locally

To build a firmware locally, the build container can be reused. The page for the **package** ``silabs-firmware-builder`` 
on the right-hand side of the github page shows how to reuse the pre-built docker container. You can then start the
container locally with a build directory bind-mounted, e.g.,

```sh
docker run --rm -it \
  --user builder \
  -v $(pwd)/build:/build \
  ghcr.io/ksjh/silabs-firmware-builder:4.2.2
```

To generate a project, use `slc generate`. To replicate/debug build issues in
an existing GitHub action, it is often helpful to just copy the command from
the "Generate Firmware Project" step.

To generate a project for the RCP Multi-PAN firmware for a ZBDongle-E, you can use:

```sh
slc generate \
  --with="EFR32MG21A020F768IM32,cpc_security_secondary_none" \
  --project-file="/gecko_sdk/protocol/openthread/sample-apps/ot-ncp/rcp-uart-802154.slcp" \
  --export-destination=rcp-uart-802154-zbdonglee \
  --copy-proj-sources --new-project --force \
  --configuration=""
```

Building the project requires some more steps:

```sh
cd rcp-uart-802154-zbdonglee

for patch in "../RCPMultiPAN/ZBDongleE"/*.patch
do
  echo "Applying ${patch}"
  patch -p1 < $patch
done

make -f rcp-uart-802154.Makefile release

jq --null-input \
 --arg sdk_version "4.2.2" \
 --argjson metadata_extra 'null' \
 '{
    "metadata_version": 1,
    "sdk_version": $sdk_version,
    "fw_type": "rcp-uart-802154"
  } + $metadata_extra' >  version.json

commander gbl create build/release/rcp-uart-802154.gbl \
  --app build/release/rcp-uart-802154.out \
  --device EFR32MG21A020F768IM32 --metadata version.json
```

## Pre-compiled firmware files
Pre-compiled firmware files are available on github. The github actions build them automatically after commits to the repo. On the top of the github page, under "Actions", you can find previous runs and "Artifacts" (lower part of the page of one run). 

## Naming convention of pre-build firmware
The names of the resulting files are not completely self-explanatory. The file ``rcp-uart-802154-zbdonglee.zip`` is the RCP Multi-PAN version for a Sonoff ZBDongle-E with RTS-CTS handshaking with 115200 baud, whereas the file ``ncp-uart-hw-zb-gw04-1v2-230.zip`` contains EmberZNet firmware for the ZB-GW04 hardware version 1.2 with RTS-CTS handshaking with 230400 baud. The naming convention is similar for other hardware. 

The firmware for the ZB-GW04 v1.1 and variants ending in ``-none`` for other hardware are firmware files that do **not** use hardware (RTS-CTS) handshaking, all other do.

All these zip files contain the required gbl firmware files in ``build/release/``.

### Attention:
The ``ot-rcp-`` files are **experimental** pure OpenThread RCP builds without Zigbee support. **Please use them with extreme care**, as with some hardware, there might be currently **no easy way to flash other firmware** after having flashed the ot-rcp firmware. **Please use these files only when you know what you are doing.**
