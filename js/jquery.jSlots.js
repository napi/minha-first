/*
 * jQuery jSlots Plugin
 * http://matthewlein.com/jslot/
 * Copyright (c) 2011 Matthew Lein
 * Version: 1.0.2 (7/26/2012)
 * Dual licensed under the MIT and GPL licenses
 * Requires: jQuery v1.4.1 or later
 */
(function (a) {
    a.jSlots = function (c, b) {
        var d = this;
        d.$el = a(c);
        d.el = c;
        d.$el.data("jSlots", d);
        d.init = function () {
            d.options = a.extend({}, a.jSlots.defaultOptions, b);
            d.setup();
            d.bindEvents();
        };
        a.jSlots.defaultOptions = {
            number: 3,
            winnerNumber: 1,
            spinner: "",
            spinEvent: "click",
            onStart: a.noop,
            onEnd: a.noop,
            onWin: a.noop,
            easing: "swing",
            time: 7000,
            loops: 6
        };
        d.randomRange = function (e, f) {
            return Math.floor(Math.random() * (1 + f - e)) + e;
        };
        d.isSpinning = false;
        d.spinSpeed = 0;
        d.winCount = 0;
        d.doneCount = 0;
        d.$liHeight = 0;
        d.$liWidth = 0;
        d.winners = [];
        d.allSlots = [];
        d.setup = function () {
            var e = d.$el;
            var g = e.find("li").first();
            d.$liHeight = g.outerHeight();
            d.$liWidth = g.outerWidth();
            d.liCount = d.$el.children().length;
            d.listHeight = d.$liHeight * d.liCount;
            d.increment = (d.options.time / d.options.loops) / d.options.loops;
            e.css("position", "relative");
            g.clone().appendTo(e);
            d.$wrapper = e.parent();
            d.$el.remove();

            //for (var f = d.options.number - 1; f >= 0; f--) {
                d.allSlots.push(new d.Slot());
            //}
        };
        d.bindEvents = function () {
            if (!d.isSpinning) {
                d.playSlots();
            }
        };
        d.Slot = function () {
            this.spinSpeed = 0;
            this.el = d.$el.clone().appendTo(d.$wrapper)[0];
            this.$el = a(this.el);
            this.loopCount = 0;
            this.number = 0;
        };
        d.Slot.prototype = {
            spinEm: function () {
                var e = this;
                e.$el.css("top", -d.listHeight).animate({
                    top: "0px"
                }, e.spinSpeed, "linear", function () {
                    e.lowerSpeed();
                });
            },
            lowerSpeed: function () {
                this.spinSpeed += d.increment;
                this.loopCount++;
                if (this.loopCount < d.options.loops) {
                    this.spinEm();
                } else {
                    this.finish();
                }
            },
            finish: function () {
                var e = this;
                if("" == d.options.endNo1 && "" == d.options.endNo2) {
                    var g = d.randomRange(1, d.liCount);
                } else {
                    if("0" == e.$el.index()) {
                        var g = parseInt(d.options.endNo1) + 1;
                    } else if("1" == e.$el.index()) {
                        var g = parseInt(d.options.endNo2) + 1;
                    }
                }

                var f = -((d.$liHeight * g) - d.$liHeight);
                var h = ((this.spinSpeed * 0.5) * (d.liCount)) / g;

                e.$el.css("top", -d.listHeight).animate({
                    top: f
                }, h, d.options.easing, function () {
                    d.checkWinner(g, e);
                });

                dDaying = false;
            }
        };
        d.checkWinner = function (f, g) {
            d.doneCount++;
            g.number = f;
            if ((a.isArray(d.options.winnerNumber) && d.options.winnerNumber.indexOf(f) > -1) || f === d.options.winnerNumber) {
                d.winCount++;
                d.winners.push(g.$el);
            }
            if (d.doneCount === d.options.number) {
                var e = [];
                a.each(d.allSlots, function (h, i) {
                    e[h] = i.number;
                });
                if (a.isFunction(d.options.onEnd)) {
                    d.options.onEnd(e);
                }
                if (d.winCount && a.isFunction(d.options.onWin)) {
                    d.options.onWin(d.winCount, d.winners, e);
                }
                d.isSpinning = false;
            }
        };
        d.playSlots = function () {
            d.isSpinning = true;
            d.winCount = 0;
            d.doneCount = 0;
            d.winners = [];
            if (a.isFunction(d.options.onStart)) {
                d.options.onStart();
            }
            a.each(d.allSlots, function (e, f) {
                this.spinSpeed = 0;
                this.loopCount = 0;
                this.spinEm();
            });
        };
        d.onWin = function () {
            if (a.isFunction(d.options.onWin)) {
                d.options.onWin();
            }
        };
        d.init();
    };
    a.fn.jSlots = function (b) {
        if (this.length) {
            return this.each(function () {
                (new a.jSlots(this, b));
            });
        }
    };
})(jQuery);