/**
 * Created by mpio on 13/05/16.
 */
require('./ctrl/dh.js');

var bg = require('./ctrl/background.js');

bg.setupLocalStorageListener();
bg.setSendInterval();