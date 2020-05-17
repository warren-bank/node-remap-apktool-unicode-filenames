### [rauf - remap apktool unicode filenames](https://github.com/warren-bank/node-remap-apktool-unicode-filenames)

#### Purpose:

* [apktool](https://github.com/iBotPeaches/Apktool) is _brilliant_
  - it works flawlessly 99.9% of the time
* having said that, there is one situation that it doesn't handle brilliantly
  - sometimes it can produce smali filenames that contain unicode
  - Android aapt [only permits ascii](https://github.com/android/platform_frameworks_base/blob/master/tools/aapt/AaptAssets.cpp#L27)
  - when this occurs, the apk cannot be rebuilt
    * [v2.4.1](https://github.com/iBotPeaches/Apktool/releases/tag/v2.4.1) does not produce an apk
    * [v2.2.2](https://github.com/iBotPeaches/Apktool/releases/tag/v2.2.2) produces an apk that doesn't work
      - issue tracker implies this was fixed:
        * https://github.com/iBotPeaches/Apktool/issues/885
        * https://github.com/iBotPeaches/Apktool/pull/1390/files
        * https://connortumbleson.com/2017/01/23/apktool-v2-2-2-released/
      - real world testing (both Windows and Linux) proved that it wasn't
* the purpose of this command-line utility is to:
  - walk the file tree
  - detect .smali filenames that contain unicode
  - rename the file
  - perform search/replace to remap all references from the old name to the new
    * class references in smali files
    * package names in xml files

#### Installation:

```bash
npm install --global @warren-bank/node-remap-apktool-unicode-filenames
```

#### Usage:

```bash
rauf /path/to/decoded/apk/directory
```

#### Example:

```bash
apktool d /path/to/app.apk
rauf /path/to/app

apktool b /path/to/app -o /path/to/new_app.apk
```

#### Requirements:

* Node version: v10.16.0+ or v11.13.0+
  * [`events.once`](https://nodejs.org/api/events.html#events_events_once_emitter_name)

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
