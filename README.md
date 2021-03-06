Koken Photoswipe Plugin
=======================

Usage limitations
-----------------
- This plugin is originally developped for the Axis Theme. It should work fine on Axis2 too. On other Themes, the result can be totally unpredictable.
It makes only sense on pages with a thumnail-grid layout and with the ability to link the images to Lightbox (lens templates using `<koken:link lightbox="true" ><koken:img /></koken:link>`).
- `<koken:img />` lens tags must not have a fixed preset. The plugin is expecting the *data-presets* attribute to get all avalaible sizes.
- Support for other Themes as Axis was added in V1.2.
- Since V1.3, the plugin now works on any page, as long as the DOM is structured as expected.

Demo
----
Check out http://daniel.mesphotos.ch to see it in action

Installation
------------
[Photoswipe](https://github.com/dimsemenov/photoswipe) files are included as static inside the *vendor* folder.
To install, execute on the server (or locally and copy to the server):
```bash
git clone https://github.com/DanielMuller/koken-plugin-photoswipe.git path/to/koken/storage/plugins/photoswipe
```

Enable plugin in Settings/Plugins.

Configuration
-------------
You can choose which sharing services are available.

You can define which DOM Elements will trigger Photoswipe. by leaving the option empty, the default element for the current Theme is used.

It advised to clear *System Caches* after inabling it.

Layout
------
By default, the default layout from Photoswipe is used:
- pswp/photoswipe.css
- pswp/default-skin/default-skin.css
- pswp/photoswipe.min.js
- pswp/photoswipe-ui-default.min.js
- pswp.min.js

You can replace any of this files, by creating a file with same name inside the `custom` folder:
- custom/photoswipe.css
- custom/default-skin/default-skin.css
- custom/photoswipe.min.js
- custom/photoswipe-ui-default.min.js
- custom/pswp.min.js

Todo
----
- Ajax/PHP calls for image details

Credits
-------
All the heavy lifting is done using [Photoswipe](http://photoswipe.com) by [Code computerlove](http://www.codecomputerlove.com/) and [Dmitry Semenov](http://dimsemenov.com/).
This plugin just integrates the relevant code into [Koken](http://koken.me/).
The version used in this plugin is [e5daa...](https://github.com/dimsemenov/PhotoSwipe/tree/e5daa8ab462697f3cb211715b788d8e1de78d98f)
