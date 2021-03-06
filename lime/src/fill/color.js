goog.provide('lime.fill.Color');

goog.require('goog.color');

goog.require('goog.color.alpha');
goog.require('lime.fill.Fill');

/**
* Color fill
* @param {mixed} clr Color value.
* @constructor
* @extends lime.fill.Fill
*/
lime.fill.Color = function(clr) {
    lime.fill.Fill.call(this);

    this.a = 1;

    this.setColor(clr);

};
goog.inherits(lime.fill.Color, lime.fill.Fill);

/**
 * Common name for color objects
 * @type {string}
 * @const
 */
lime.fill.Color.prototype.id = 'color';

/**
* @inheritDoc
*/
lime.fill.Color.prototype.initForSprite = function(sprite) {

    this.sprite_ = sprite;
    sprite.setDirty(lime.Dirty.CONTENT);

};

/**
* Gets color as RGB array.
* @return {null|Array.<number>} RGB array.
*/
lime.fill.Color.prototype.getRgb = function() {
    var out = null;

    if (goog.isNumber(this.r) && goog.isNumber(this.g) &&
        goog.isNumber(this.b)) {
        out = [this.r, this.g, this.b];

    } else if (goog.isString(this.str)) {
        var color = goog.color.parse(this.str);
        if (color.type != 'named') {
            out = goog.color.hexToRgb(color.hex);
        }
    }

    return out;
};

/**
 * Make color lighter
 * @param {number} value Brightness factor.
 * @return {lime.fill.Color} object itself.
 */
lime.fill.Color.prototype.addBrightness = function(value) {
    return this.modifyColor(2, value);
};

/**
 * Modify color value
 * @param {number} mode Settings to change.
 * @param {value} value Amount factor.
 * @return {lime.fill.Color} object itself.
 */
lime.fill.Color.prototype.modifyColor = function(mode, value) {
    var add = value || .1;

    var rgb = this.getRgb();
    if (!rgb) return this;

    var hsl = goog.color.rgbArrayToHsl(rgb);
    hsl[mode] += add;
    if (hsl[mode] > 1) hsl[mode] = 1;

    rgb = goog.color.hslArrayToRgb(hsl);
    return this.setColor(rgb);
};

/**
 * Make color more saturated
 * @param {number} value Saturation factor.
 * @return {lime.fill.Color} ibject itself.
 */
lime.fill.Color.prototype.addSaturation = function(value) {
    return this.modifyColor(1, value);
};

/**
* Set color value of the object. Accepts raw RGB(A) values and strings.
* @param {mixed} clr New color value.
* @return {lime.fill.Color} object itself.
*/
lime.fill.Color.prototype.setColor = function(clr) {
    var color = clr;

    if (goog.isString(clr)) {
        this.str = clr;
        return this;
    }

    if (arguments.length > 2) {
        color = arguments;
    }
    if (color.length >= 3) {
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
    }
    if (color.length == 4) {
        this.a = color[3];
    }

    this.str = this.a == 1 ?
    'rgb(' + this.r + ',' + this.g + ',' + this.b + ')' :
    'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    return this;
};

/** @inheritDoc */
lime.fill.Color.prototype.setDOMStyle = function(domEl) {
    domEl.style['background'] = this.str;
};

/** @inheritDoc */
lime.fill.Color.prototype.setCanvasStyle = function(context) {
    context.fillStyle = this.str;
};

/**
 * Clone the color
 * @return {lime.fill.Color} New cloned color.
 */
lime.fill.Color.prototype.clone = function() {
    var c = new lime.fill.Color('');
    c.r = this.r;
    c.g = this.g;
    c.b = this.b;
    c.a = this.a;
    c.str = this.str;
    return c;
};
