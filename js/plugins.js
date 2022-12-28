// Avoid `console` errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () {};
  var methods = [
    "assert",
    "clear",
    "count",
    "debug",
    "dir",
    "dirxml",
    "error",
    "exception",
    "group",
    "groupCollapsed",
    "groupEnd",
    "info",
    "log",
    "markTimeline",
    "profile",
    "profileEnd",
    "table",
    "time",
    "timeEnd",
    "timeline",
    "timelineEnd",
    "timeStamp",
    "trace",
    "warn",
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
})();

// Place any jQuery/helper plugins in here.

/**
 * Owl Carousel v2.2.1
 * Copyright 2013-2017 David Deutsch
 * Licensed under  ()
 */
!(function (a, b, c, d) {
  function e(b, c) {
    (this.settings = null),
      (this.options = a.extend({}, e.Defaults, c)),
      (this.$element = a(b)),
      (this._handlers = {}),
      (this._plugins = {}),
      (this._supress = {}),
      (this._current = null),
      (this._speed = null),
      (this._coordinates = []),
      (this._breakpoint = null),
      (this._width = null),
      (this._items = []),
      (this._clones = []),
      (this._mergers = []),
      (this._widths = []),
      (this._invalidated = {}),
      (this._pipe = []),
      (this._drag = {
        time: null,
        target: null,
        pointer: null,
        stage: { start: null, current: null },
        direction: null,
      }),
      (this._states = {
        current: {},
        tags: {
          initializing: ["busy"],
          animating: ["busy"],
          dragging: ["interacting"],
        },
      }),
      a.each(
        ["onResize", "onThrottledResize"],
        a.proxy(function (b, c) {
          this._handlers[c] = a.proxy(this[c], this);
        }, this)
      ),
      a.each(
        e.Plugins,
        a.proxy(function (a, b) {
          this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this);
        }, this)
      ),
      a.each(
        e.Workers,
        a.proxy(function (b, c) {
          this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) });
        }, this)
      ),
      this.setup(),
      this.initialize();
  }
  (e.Defaults = {
    items: 3,
    loop: !1,
    center: !1,
    rewind: !1,
    mouseDrag: !0,
    touchDrag: !0,
    pullDrag: !0,
    freeDrag: !1,
    margin: 0,
    stagePadding: 0,
    merge: !1,
    mergeFit: !0,
    autoWidth: !1,
    startPosition: 0,
    rtl: !1,
    smartSpeed: 250,
    fluidSpeed: !1,
    dragEndSpeed: !1,
    responsive: {},
    responsiveRefreshRate: 200,
    responsiveBaseElement: b,
    fallbackEasing: "swing",
    info: !1,
    nestedItemSelector: !1,
    itemElement: "div",
    stageElement: "div",
    refreshClass: "owl-refresh",
    loadedClass: "owl-loaded",
    loadingClass: "owl-loading",
    rtlClass: "owl-rtl",
    responsiveClass: "owl-responsive",
    dragClass: "owl-drag",
    itemClass: "owl-item",
    stageClass: "owl-stage",
    stageOuterClass: "owl-stage-outer",
    grabClass: "owl-grab",
  }),
    (e.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
    (e.Type = { Event: "event", State: "state" }),
    (e.Plugins = {}),
    (e.Workers = [
      {
        filter: ["width", "settings"],
        run: function () {
          this._width = this.$element.width();
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          a.current = this._items && this._items[this.relative(this._current)];
        },
      },
      {
        filter: ["items", "settings"],
        run: function () {
          this.$stage.children(".cloned").remove();
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this.settings.margin || "",
            c = !this.settings.autoWidth,
            d = this.settings.rtl,
            e = {
              width: "auto",
              "margin-left": d ? b : "",
              "margin-right": d ? "" : b,
            };
          !c && this.$stage.children().css(e), (a.css = e);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b =
              (this.width() / this.settings.items).toFixed(3) -
              this.settings.margin,
            c = null,
            d = this._items.length,
            e = !this.settings.autoWidth,
            f = [];
          for (a.items = { merge: !1, width: b }; d--; )
            (c = this._mergers[d]),
              (c =
                (this.settings.mergeFit && Math.min(c, this.settings.items)) ||
                c),
              (a.items.merge = c > 1 || a.items.merge),
              (f[d] = e ? b * c : this._items[d].width());
          this._widths = f;
        },
      },
      {
        filter: ["items", "settings"],
        run: function () {
          var b = [],
            c = this._items,
            d = this.settings,
            e = Math.max(2 * d.items, 4),
            f = 2 * Math.ceil(c.length / 2),
            g = d.loop && c.length ? (d.rewind ? e : Math.max(e, f)) : 0,
            h = "",
            i = "";
          for (g /= 2; g--; )
            b.push(this.normalize(b.length / 2, !0)),
              (h += c[b[b.length - 1]][0].outerHTML),
              b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)),
              (i = c[b[b.length - 1]][0].outerHTML + i);
          (this._clones = b),
            a(h).addClass("cloned").appendTo(this.$stage),
            a(i).addClass("cloned").prependTo(this.$stage);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          for (
            var a = this.settings.rtl ? 1 : -1,
              b = this._clones.length + this._items.length,
              c = -1,
              d = 0,
              e = 0,
              f = [];
            ++c < b;

          )
            (d = f[c - 1] || 0),
              (e = this._widths[this.relative(c)] + this.settings.margin),
              f.push(d + e * a);
          this._coordinates = f;
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          var a = this.settings.stagePadding,
            b = this._coordinates,
            c = {
              width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
              "padding-left": a || "",
              "padding-right": a || "",
            };
          this.$stage.css(c);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this._coordinates.length,
            c = !this.settings.autoWidth,
            d = this.$stage.children();
          if (c && a.items.merge)
            for (; b--; )
              (a.css.width = this._widths[this.relative(b)]),
                d.eq(b).css(a.css);
          else c && ((a.css.width = a.items.width), d.css(a.css));
        },
      },
      {
        filter: ["items"],
        run: function () {
          this._coordinates.length < 1 && this.$stage.removeAttr("style");
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          (a.current = a.current ? this.$stage.children().index(a.current) : 0),
            (a.current = Math.max(
              this.minimum(),
              Math.min(this.maximum(), a.current)
            )),
            this.reset(a.current);
        },
      },
      {
        filter: ["position"],
        run: function () {
          this.animate(this.coordinates(this._current));
        },
      },
      {
        filter: ["width", "position", "items", "settings"],
        run: function () {
          var a,
            b,
            c,
            d,
            e = this.settings.rtl ? 1 : -1,
            f = 2 * this.settings.stagePadding,
            g = this.coordinates(this.current()) + f,
            h = g + this.width() * e,
            i = [];
          for (c = 0, d = this._coordinates.length; c < d; c++)
            (a = this._coordinates[c - 1] || 0),
              (b = Math.abs(this._coordinates[c]) + f * e),
              ((this.op(a, "<=", g) && this.op(a, ">", h)) ||
                (this.op(b, "<", g) && this.op(b, ">", h))) &&
                i.push(c);
          this.$stage.children(".active").removeClass("active"),
            this.$stage
              .children(":eq(" + i.join("), :eq(") + ")")
              .addClass("active"),
            this.settings.center &&
              (this.$stage.children(".center").removeClass("center"),
              this.$stage.children().eq(this.current()).addClass("center"));
        },
      },
    ]),
    (e.prototype.initialize = function () {
      if (
        (this.enter("initializing"),
        this.trigger("initialize"),
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
        this.settings.autoWidth && !this.is("pre-loading"))
      ) {
        var b, c, e;
        (b = this.$element.find("img")),
          (c = this.settings.nestedItemSelector
            ? "." + this.settings.nestedItemSelector
            : d),
          (e = this.$element.children(c).width()),
          b.length && e <= 0 && this.preloadAutoWidthImages(b);
      }
      this.$element.addClass(this.options.loadingClass),
        (this.$stage = a(
          "<" +
            this.settings.stageElement +
            ' class="' +
            this.settings.stageClass +
            '"/>'
        ).wrap('<div class="' + this.settings.stageOuterClass + '"/>')),
        this.$element.append(this.$stage.parent()),
        this.replace(this.$element.children().not(this.$stage.parent())),
        this.$element.is(":visible")
          ? this.refresh()
          : this.invalidate("width"),
        this.$element
          .removeClass(this.options.loadingClass)
          .addClass(this.options.loadedClass),
        this.registerEventHandlers(),
        this.leave("initializing"),
        this.trigger("initialized");
    }),
    (e.prototype.setup = function () {
      var b = this.viewport(),
        c = this.options.responsive,
        d = -1,
        e = null;
      c
        ? (a.each(c, function (a) {
            a <= b && a > d && (d = Number(a));
          }),
          (e = a.extend({}, this.options, c[d])),
          "function" == typeof e.stagePadding &&
            (e.stagePadding = e.stagePadding()),
          delete e.responsive,
          e.responsiveClass &&
            this.$element.attr(
              "class",
              this.$element
                .attr("class")
                .replace(
                  new RegExp(
                    "(" + this.options.responsiveClass + "-)\\S+\\s",
                    "g"
                  ),
                  "$1" + d
                )
            ))
        : (e = a.extend({}, this.options)),
        this.trigger("change", { property: { name: "settings", value: e } }),
        (this._breakpoint = d),
        (this.settings = e),
        this.invalidate("settings"),
        this.trigger("changed", {
          property: { name: "settings", value: this.settings },
        });
    }),
    (e.prototype.optionsLogic = function () {
      this.settings.autoWidth &&
        ((this.settings.stagePadding = !1), (this.settings.merge = !1));
    }),
    (e.prototype.prepare = function (b) {
      var c = this.trigger("prepare", { content: b });
      return (
        c.data ||
          (c.data = a("<" + this.settings.itemElement + "/>")
            .addClass(this.options.itemClass)
            .append(b)),
        this.trigger("prepared", { content: c.data }),
        c.data
      );
    }),
    (e.prototype.update = function () {
      for (
        var b = 0,
          c = this._pipe.length,
          d = a.proxy(function (a) {
            return this[a];
          }, this._invalidated),
          e = {};
        b < c;

      )
        (this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) &&
          this._pipe[b].run(e),
          b++;
      (this._invalidated = {}), !this.is("valid") && this.enter("valid");
    }),
    (e.prototype.width = function (a) {
      switch ((a = a || e.Width.Default)) {
        case e.Width.Inner:
        case e.Width.Outer:
          return this._width;
        default:
          return (
            this._width - 2 * this.settings.stagePadding + this.settings.margin
          );
      }
    }),
    (e.prototype.refresh = function () {
      this.enter("refreshing"),
        this.trigger("refresh"),
        this.setup(),
        this.optionsLogic(),
        this.$element.addClass(this.options.refreshClass),
        this.update(),
        this.$element.removeClass(this.options.refreshClass),
        this.leave("refreshing"),
        this.trigger("refreshed");
    }),
    (e.prototype.onThrottledResize = function () {
      b.clearTimeout(this.resizeTimer),
        (this.resizeTimer = b.setTimeout(
          this._handlers.onResize,
          this.settings.responsiveRefreshRate
        ));
    }),
    (e.prototype.onResize = function () {
      return (
        !!this._items.length &&
        this._width !== this.$element.width() &&
        !!this.$element.is(":visible") &&
        (this.enter("resizing"),
        this.trigger("resize").isDefaultPrevented()
          ? (this.leave("resizing"), !1)
          : (this.invalidate("width"),
            this.refresh(),
            this.leave("resizing"),
            void this.trigger("resized")))
      );
    }),
    (e.prototype.registerEventHandlers = function () {
      a.support.transition &&
        this.$stage.on(
          a.support.transition.end + ".owl.core",
          a.proxy(this.onTransitionEnd, this)
        ),
        this.settings.responsive !== !1 &&
          this.on(b, "resize", this._handlers.onThrottledResize),
        this.settings.mouseDrag &&
          (this.$element.addClass(this.options.dragClass),
          this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)),
          this.$stage.on(
            "dragstart.owl.core selectstart.owl.core",
            function () {
              return !1;
            }
          )),
        this.settings.touchDrag &&
          (this.$stage.on(
            "touchstart.owl.core",
            a.proxy(this.onDragStart, this)
          ),
          this.$stage.on(
            "touchcancel.owl.core",
            a.proxy(this.onDragEnd, this)
          ));
    }),
    (e.prototype.onDragStart = function (b) {
      var d = null;
      3 !== b.which &&
        (a.support.transform
          ? ((d = this.$stage
              .css("transform")
              .replace(/.*\(|\)| /g, "")
              .split(",")),
            (d = {
              x: d[16 === d.length ? 12 : 4],
              y: d[16 === d.length ? 13 : 5],
            }))
          : ((d = this.$stage.position()),
            (d = {
              x: this.settings.rtl
                ? d.left +
                  this.$stage.width() -
                  this.width() +
                  this.settings.margin
                : d.left,
              y: d.top,
            })),
        this.is("animating") &&
          (a.support.transform ? this.animate(d.x) : this.$stage.stop(),
          this.invalidate("position")),
        this.$element.toggleClass(
          this.options.grabClass,
          "mousedown" === b.type
        ),
        this.speed(0),
        (this._drag.time = new Date().getTime()),
        (this._drag.target = a(b.target)),
        (this._drag.stage.start = d),
        (this._drag.stage.current = d),
        (this._drag.pointer = this.pointer(b)),
        a(c).on(
          "mouseup.owl.core touchend.owl.core",
          a.proxy(this.onDragEnd, this)
        ),
        a(c).one(
          "mousemove.owl.core touchmove.owl.core",
          a.proxy(function (b) {
            var d = this.difference(this._drag.pointer, this.pointer(b));
            a(c).on(
              "mousemove.owl.core touchmove.owl.core",
              a.proxy(this.onDragMove, this)
            ),
              (Math.abs(d.x) < Math.abs(d.y) && this.is("valid")) ||
                (b.preventDefault(),
                this.enter("dragging"),
                this.trigger("drag"));
          }, this)
        ));
    }),
    (e.prototype.onDragMove = function (a) {
      var b = null,
        c = null,
        d = null,
        e = this.difference(this._drag.pointer, this.pointer(a)),
        f = this.difference(this._drag.stage.start, e);
      this.is("dragging") &&
        (a.preventDefault(),
        this.settings.loop
          ? ((b = this.coordinates(this.minimum())),
            (c = this.coordinates(this.maximum() + 1) - b),
            (f.x = ((((f.x - b) % c) + c) % c) + b))
          : ((b = this.settings.rtl
              ? this.coordinates(this.maximum())
              : this.coordinates(this.minimum())),
            (c = this.settings.rtl
              ? this.coordinates(this.minimum())
              : this.coordinates(this.maximum())),
            (d = this.settings.pullDrag ? (-1 * e.x) / 5 : 0),
            (f.x = Math.max(Math.min(f.x, b + d), c + d))),
        (this._drag.stage.current = f),
        this.animate(f.x));
    }),
    (e.prototype.onDragEnd = function (b) {
      var d = this.difference(this._drag.pointer, this.pointer(b)),
        e = this._drag.stage.current,
        f = (d.x > 0) ^ this.settings.rtl ? "left" : "right";
      a(c).off(".owl.core"),
        this.$element.removeClass(this.options.grabClass),
        ((0 !== d.x && this.is("dragging")) || !this.is("valid")) &&
          (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
          this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)),
          this.invalidate("position"),
          this.update(),
          (this._drag.direction = f),
          (Math.abs(d.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
            this._drag.target.one("click.owl.core", function () {
              return !1;
            })),
        this.is("dragging") &&
          (this.leave("dragging"), this.trigger("dragged"));
    }),
    (e.prototype.closest = function (b, c) {
      var d = -1,
        e = 30,
        f = this.width(),
        g = this.coordinates();
      return (
        this.settings.freeDrag ||
          a.each(
            g,
            a.proxy(function (a, h) {
              return (
                "left" === c && b > h - e && b < h + e
                  ? (d = a)
                  : "right" === c && b > h - f - e && b < h - f + e
                  ? (d = a + 1)
                  : this.op(b, "<", h) &&
                    this.op(b, ">", g[a + 1] || h - f) &&
                    (d = "left" === c ? a + 1 : a),
                d === -1
              );
            }, this)
          ),
        this.settings.loop ||
          (this.op(b, ">", g[this.minimum()])
            ? (d = b = this.minimum())
            : this.op(b, "<", g[this.maximum()]) && (d = b = this.maximum())),
        d
      );
    }),
    (e.prototype.animate = function (b) {
      var c = this.speed() > 0;
      this.is("animating") && this.onTransitionEnd(),
        c && (this.enter("animating"), this.trigger("translate")),
        a.support.transform3d && a.support.transition
          ? this.$stage.css({
              transform: "translate3d(" + b + "px,0px,0px)",
              transition: this.speed() / 1e3 + "s",
            })
          : c
          ? this.$stage.animate(
              { left: b + "px" },
              this.speed(),
              this.settings.fallbackEasing,
              a.proxy(this.onTransitionEnd, this)
            )
          : this.$stage.css({ left: b + "px" });
    }),
    (e.prototype.is = function (a) {
      return this._states.current[a] && this._states.current[a] > 0;
    }),
    (e.prototype.current = function (a) {
      if (a === d) return this._current;
      if (0 === this._items.length) return d;
      if (((a = this.normalize(a)), this._current !== a)) {
        var b = this.trigger("change", {
          property: { name: "position", value: a },
        });
        b.data !== d && (a = this.normalize(b.data)),
          (this._current = a),
          this.invalidate("position"),
          this.trigger("changed", {
            property: { name: "position", value: this._current },
          });
      }
      return this._current;
    }),
    (e.prototype.invalidate = function (b) {
      return (
        "string" === a.type(b) &&
          ((this._invalidated[b] = !0),
          this.is("valid") && this.leave("valid")),
        a.map(this._invalidated, function (a, b) {
          return b;
        })
      );
    }),
    (e.prototype.reset = function (a) {
      (a = this.normalize(a)),
        a !== d &&
          ((this._speed = 0),
          (this._current = a),
          this.suppress(["translate", "translated"]),
          this.animate(this.coordinates(a)),
          this.release(["translate", "translated"]));
    }),
    (e.prototype.normalize = function (a, b) {
      var c = this._items.length,
        e = b ? 0 : this._clones.length;
      return (
        !this.isNumeric(a) || c < 1
          ? (a = d)
          : (a < 0 || a >= c + e) &&
            (a = ((((a - e / 2) % c) + c) % c) + e / 2),
        a
      );
    }),
    (e.prototype.relative = function (a) {
      return (a -= this._clones.length / 2), this.normalize(a, !0);
    }),
    (e.prototype.maximum = function (a) {
      var b,
        c,
        d,
        e = this.settings,
        f = this._coordinates.length;
      if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
      else if (e.autoWidth || e.merge) {
        for (
          b = this._items.length,
            c = this._items[--b].width(),
            d = this.$element.width();
          b-- &&
          ((c += this._items[b].width() + this.settings.margin), !(c > d));

        );
        f = b + 1;
      } else
        f = e.center ? this._items.length - 1 : this._items.length - e.items;
      return a && (f -= this._clones.length / 2), Math.max(f, 0);
    }),
    (e.prototype.minimum = function (a) {
      return a ? 0 : this._clones.length / 2;
    }),
    (e.prototype.items = function (a) {
      return a === d
        ? this._items.slice()
        : ((a = this.normalize(a, !0)), this._items[a]);
    }),
    (e.prototype.mergers = function (a) {
      return a === d
        ? this._mergers.slice()
        : ((a = this.normalize(a, !0)), this._mergers[a]);
    }),
    (e.prototype.clones = function (b) {
      var c = this._clones.length / 2,
        e = c + this._items.length,
        f = function (a) {
          return a % 2 === 0 ? e + a / 2 : c - (a + 1) / 2;
        };
      return b === d
        ? a.map(this._clones, function (a, b) {
            return f(b);
          })
        : a.map(this._clones, function (a, c) {
            return a === b ? f(c) : null;
          });
    }),
    (e.prototype.speed = function (a) {
      return a !== d && (this._speed = a), this._speed;
    }),
    (e.prototype.coordinates = function (b) {
      var c,
        e = 1,
        f = b - 1;
      return b === d
        ? a.map(
            this._coordinates,
            a.proxy(function (a, b) {
              return this.coordinates(b);
            }, this)
          )
        : (this.settings.center
            ? (this.settings.rtl && ((e = -1), (f = b + 1)),
              (c = this._coordinates[b]),
              (c += ((this.width() - c + (this._coordinates[f] || 0)) / 2) * e))
            : (c = this._coordinates[f] || 0),
          (c = Math.ceil(c)));
    }),
    (e.prototype.duration = function (a, b, c) {
      return 0 === c
        ? 0
        : Math.min(Math.max(Math.abs(b - a), 1), 6) *
            Math.abs(c || this.settings.smartSpeed);
    }),
    (e.prototype.to = function (a, b) {
      var c = this.current(),
        d = null,
        e = a - this.relative(c),
        f = (e > 0) - (e < 0),
        g = this._items.length,
        h = this.minimum(),
        i = this.maximum();
      this.settings.loop
        ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += f * -1 * g),
          (a = c + e),
          (d = ((((a - h) % g) + g) % g) + h),
          d !== a &&
            d - e <= i &&
            d - e > 0 &&
            ((c = d - e), (a = d), this.reset(c)))
        : this.settings.rewind
        ? ((i += 1), (a = ((a % i) + i) % i))
        : (a = Math.max(h, Math.min(i, a))),
        this.speed(this.duration(c, a, b)),
        this.current(a),
        this.$element.is(":visible") && this.update();
    }),
    (e.prototype.next = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) + 1, a);
    }),
    (e.prototype.prev = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) - 1, a);
    }),
    (e.prototype.onTransitionEnd = function (a) {
      if (
        a !== d &&
        (a.stopPropagation(),
        (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))
      )
        return !1;
      this.leave("animating"), this.trigger("translated");
    }),
    (e.prototype.viewport = function () {
      var d;
      return (
        this.options.responsiveBaseElement !== b
          ? (d = a(this.options.responsiveBaseElement).width())
          : b.innerWidth
          ? (d = b.innerWidth)
          : c.documentElement && c.documentElement.clientWidth
          ? (d = c.documentElement.clientWidth)
          : console.warn("Can not detect viewport width."),
        d
      );
    }),
    (e.prototype.replace = function (b) {
      this.$stage.empty(),
        (this._items = []),
        b && (b = b instanceof jQuery ? b : a(b)),
        this.settings.nestedItemSelector &&
          (b = b.find("." + this.settings.nestedItemSelector)),
        b
          .filter(function () {
            return 1 === this.nodeType;
          })
          .each(
            a.proxy(function (a, b) {
              (b = this.prepare(b)),
                this.$stage.append(b),
                this._items.push(b),
                this._mergers.push(
                  1 *
                    b
                      .find("[data-merge]")
                      .addBack("[data-merge]")
                      .attr("data-merge") || 1
                );
            }, this)
          ),
        this.reset(
          this.isNumeric(this.settings.startPosition)
            ? this.settings.startPosition
            : 0
        ),
        this.invalidate("items");
    }),
    (e.prototype.add = function (b, c) {
      var e = this.relative(this._current);
      (c = c === d ? this._items.length : this.normalize(c, !0)),
        (b = b instanceof jQuery ? b : a(b)),
        this.trigger("add", { content: b, position: c }),
        (b = this.prepare(b)),
        0 === this._items.length || c === this._items.length
          ? (0 === this._items.length && this.$stage.append(b),
            0 !== this._items.length && this._items[c - 1].after(b),
            this._items.push(b),
            this._mergers.push(
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            ))
          : (this._items[c].before(b),
            this._items.splice(c, 0, b),
            this._mergers.splice(
              c,
              0,
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            )),
        this._items[e] && this.reset(this._items[e].index()),
        this.invalidate("items"),
        this.trigger("added", { content: b, position: c });
    }),
    (e.prototype.remove = function (a) {
      (a = this.normalize(a, !0)),
        a !== d &&
          (this.trigger("remove", { content: this._items[a], position: a }),
          this._items[a].remove(),
          this._items.splice(a, 1),
          this._mergers.splice(a, 1),
          this.invalidate("items"),
          this.trigger("removed", { content: null, position: a }));
    }),
    (e.prototype.preloadAutoWidthImages = function (b) {
      b.each(
        a.proxy(function (b, c) {
          this.enter("pre-loading"),
            (c = a(c)),
            a(new Image())
              .one(
                "load",
                a.proxy(function (a) {
                  c.attr("src", a.target.src),
                    c.css("opacity", 1),
                    this.leave("pre-loading"),
                    !this.is("pre-loading") &&
                      !this.is("initializing") &&
                      this.refresh();
                }, this)
              )
              .attr(
                "src",
                c.attr("src") || c.attr("data-src") || c.attr("data-src-retina")
              );
        }, this)
      );
    }),
    (e.prototype.destroy = function () {
      this.$element.off(".owl.core"),
        this.$stage.off(".owl.core"),
        a(c).off(".owl.core"),
        this.settings.responsive !== !1 &&
          (b.clearTimeout(this.resizeTimer),
          this.off(b, "resize", this._handlers.onThrottledResize));
      for (var d in this._plugins) this._plugins[d].destroy();
      this.$stage.children(".cloned").remove(),
        this.$stage.unwrap(),
        this.$stage.children().contents().unwrap(),
        this.$stage.children().unwrap(),
        this.$element
          .removeClass(this.options.refreshClass)
          .removeClass(this.options.loadingClass)
          .removeClass(this.options.loadedClass)
          .removeClass(this.options.rtlClass)
          .removeClass(this.options.dragClass)
          .removeClass(this.options.grabClass)
          .attr(
            "class",
            this.$element
              .attr("class")
              .replace(
                new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"),
                ""
              )
          )
          .removeData("owl.carousel");
    }),
    (e.prototype.op = function (a, b, c) {
      var d = this.settings.rtl;
      switch (b) {
        case "<":
          return d ? a > c : a < c;
        case ">":
          return d ? a < c : a > c;
        case ">=":
          return d ? a <= c : a >= c;
        case "<=":
          return d ? a >= c : a <= c;
      }
    }),
    (e.prototype.on = function (a, b, c, d) {
      a.addEventListener
        ? a.addEventListener(b, c, d)
        : a.attachEvent && a.attachEvent("on" + b, c);
    }),
    (e.prototype.off = function (a, b, c, d) {
      a.removeEventListener
        ? a.removeEventListener(b, c, d)
        : a.detachEvent && a.detachEvent("on" + b, c);
    }),
    (e.prototype.trigger = function (b, c, d, f, g) {
      var h = { item: { count: this._items.length, index: this.current() } },
        i = a.camelCase(
          a
            .grep(["on", b, d], function (a) {
              return a;
            })
            .join("-")
            .toLowerCase()
        ),
        j = a.Event(
          [b, "owl", d || "carousel"].join(".").toLowerCase(),
          a.extend({ relatedTarget: this }, h, c)
        );
      return (
        this._supress[b] ||
          (a.each(this._plugins, function (a, b) {
            b.onTrigger && b.onTrigger(j);
          }),
          this.register({ type: e.Type.Event, name: b }),
          this.$element.trigger(j),
          this.settings &&
            "function" == typeof this.settings[i] &&
            this.settings[i].call(this, j)),
        j
      );
    }),
    (e.prototype.enter = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b] === d && (this._states.current[b] = 0),
            this._states.current[b]++;
        }, this)
      );
    }),
    (e.prototype.leave = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b]--;
        }, this)
      );
    }),
    (e.prototype.register = function (b) {
      if (b.type === e.Type.Event) {
        if (
          (a.event.special[b.name] || (a.event.special[b.name] = {}),
          !a.event.special[b.name].owl)
        ) {
          var c = a.event.special[b.name]._default;
          (a.event.special[b.name]._default = function (a) {
            return !c ||
              !c.apply ||
              (a.namespace && a.namespace.indexOf("owl") !== -1)
              ? a.namespace && a.namespace.indexOf("owl") > -1
              : c.apply(this, arguments);
          }),
            (a.event.special[b.name].owl = !0);
        }
      } else
        b.type === e.Type.State &&
          (this._states.tags[b.name]
            ? (this._states.tags[b.name] = this._states.tags[b.name].concat(
                b.tags
              ))
            : (this._states.tags[b.name] = b.tags),
          (this._states.tags[b.name] = a.grep(
            this._states.tags[b.name],
            a.proxy(function (c, d) {
              return a.inArray(c, this._states.tags[b.name]) === d;
            }, this)
          )));
    }),
    (e.prototype.suppress = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          this._supress[b] = !0;
        }, this)
      );
    }),
    (e.prototype.release = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          delete this._supress[b];
        }, this)
      );
    }),
    (e.prototype.pointer = function (a) {
      var c = { x: null, y: null };
      return (
        (a = a.originalEvent || a || b.event),
        (a =
          a.touches && a.touches.length
            ? a.touches[0]
            : a.changedTouches && a.changedTouches.length
            ? a.changedTouches[0]
            : a),
        a.pageX
          ? ((c.x = a.pageX), (c.y = a.pageY))
          : ((c.x = a.clientX), (c.y = a.clientY)),
        c
      );
    }),
    (e.prototype.isNumeric = function (a) {
      return !isNaN(parseFloat(a));
    }),
    (e.prototype.difference = function (a, b) {
      return { x: a.x - b.x, y: a.y - b.y };
    }),
    (a.fn.owlCarousel = function (b) {
      var c = Array.prototype.slice.call(arguments, 1);
      return this.each(function () {
        var d = a(this),
          f = d.data("owl.carousel");
        f ||
          ((f = new e(this, "object" == typeof b && b)),
          d.data("owl.carousel", f),
          a.each(
            [
              "next",
              "prev",
              "to",
              "destroy",
              "refresh",
              "replace",
              "add",
              "remove",
            ],
            function (b, c) {
              f.register({ type: e.Type.Event, name: c }),
                f.$element.on(
                  c + ".owl.carousel.core",
                  a.proxy(function (a) {
                    a.namespace &&
                      a.relatedTarget !== this &&
                      (this.suppress([c]),
                      f[c].apply(this, [].slice.call(arguments, 1)),
                      this.release([c]));
                  }, f)
                );
            }
          )),
          "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c);
      });
    }),
    (a.fn.owlCarousel.Constructor = e);
})(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._interval = null),
        (this._visible = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoRefresh && this.watch();
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
      (e.prototype.watch = function () {
        this._interval ||
          ((this._visible = this._core.$element.is(":visible")),
          (this._interval = b.setInterval(
            a.proxy(this.refresh, this),
            this._core.settings.autoRefreshInterval
          )));
      }),
      (e.prototype.refresh = function () {
        this._core.$element.is(":visible") !== this._visible &&
          ((this._visible = !this._visible),
          this._core.$element.toggleClass("owl-hidden", !this._visible),
          this._visible &&
            this._core.invalidate("width") &&
            this._core.refresh());
      }),
      (e.prototype.destroy = function () {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._loaded = []),
        (this._handlers = {
          "initialized.owl.carousel change.owl.carousel resized.owl.carousel":
            a.proxy(function (b) {
              if (
                b.namespace &&
                this._core.settings &&
                this._core.settings.lazyLoad &&
                ((b.property && "position" == b.property.name) ||
                  "initialized" == b.type)
              )
                for (
                  var c = this._core.settings,
                    e = (c.center && Math.ceil(c.items / 2)) || c.items,
                    f = (c.center && e * -1) || 0,
                    g =
                      (b.property && b.property.value !== d
                        ? b.property.value
                        : this._core.current()) + f,
                    h = this._core.clones().length,
                    i = a.proxy(function (a, b) {
                      this.load(b);
                    }, this);
                  f++ < e;

                )
                  this.load(h / 2 + this._core.relative(g)),
                    h && a.each(this._core.clones(this._core.relative(g)), i),
                    g++;
            }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { lazyLoad: !1 }),
      (e.prototype.load = function (c) {
        var d = this._core.$stage.children().eq(c),
          e = d && d.find(".owl-lazy");
        !e ||
          a.inArray(d.get(0), this._loaded) > -1 ||
          (e.each(
            a.proxy(function (c, d) {
              var e,
                f = a(d),
                g =
                  (b.devicePixelRatio > 1 && f.attr("data-src-retina")) ||
                  f.attr("data-src");
              this._core.trigger("load", { element: f, url: g }, "lazy"),
                f.is("img")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          f.css("opacity", 1),
                            this._core.trigger(
                              "loaded",
                              { element: f, url: g },
                              "lazy"
                            );
                        }, this)
                      )
                      .attr("src", g)
                  : ((e = new Image()),
                    (e.onload = a.proxy(function () {
                      f.css({
                        "background-image": 'url("' + g + '")',
                        opacity: "1",
                      }),
                        this._core.trigger(
                          "loaded",
                          { element: f, url: g },
                          "lazy"
                        );
                    }, this)),
                    (e.src = g));
            }, this)
          ),
          this._loaded.push(d.get(0)));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Lazy = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._handlers = {
          "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (
            a
          ) {
            a.namespace && this._core.settings.autoHeight && this.update();
          },
          this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              "position" == a.property.name &&
              this.update();
          }, this),
          "loaded.owl.lazy": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              a.element.closest("." + this._core.settings.itemClass).index() ===
                this._core.current() &&
              this.update();
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
      (e.prototype.update = function () {
        var b = this._core._current,
          c = b + this._core.settings.items,
          d = this._core.$stage.children().toArray().slice(b, c),
          e = [],
          f = 0;
        a.each(d, function (b, c) {
          e.push(a(c).height());
        }),
          (f = Math.max.apply(null, e)),
          this._core.$stage
            .parent()
            .height(f)
            .addClass(this._core.settings.autoHeightClass);
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._videos = {}),
        (this._playing = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.register({
                type: "state",
                name: "playing",
                tags: ["interacting"],
              });
          }, this),
          "resize.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.video &&
              this.isInFullScreen() &&
              a.preventDefault();
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.is("resizing") &&
              this._core.$stage.find(".cloned .owl-video-frame").remove();
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" === a.property.name &&
              this._playing &&
              this.stop();
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content).find(".owl-video");
              c.length &&
                (c.css("display", "none"), this.fetch(c, a(b.content)));
            }
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        this._core.$element.on(
          "click.owl.video",
          ".owl-video-play-icon",
          a.proxy(function (a) {
            this.play(a);
          }, this)
        );
    };
    (e.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
      (e.prototype.fetch = function (a, b) {
        var c = (function () {
            return a.attr("data-vimeo-id")
              ? "vimeo"
              : a.attr("data-vzaar-id")
              ? "vzaar"
              : "youtube";
          })(),
          d =
            a.attr("data-vimeo-id") ||
            a.attr("data-youtube-id") ||
            a.attr("data-vzaar-id"),
          e = a.attr("data-width") || this._core.settings.videoWidth,
          f = a.attr("data-height") || this._core.settings.videoHeight,
          g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (
          ((d = g.match(
            /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          )),
          d[3].indexOf("youtu") > -1)
        )
          c = "youtube";
        else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
        else {
          if (!(d[3].indexOf("vzaar") > -1))
            throw new Error("Video URL not supported.");
          c = "vzaar";
        }
        (d = d[6]),
          (this._videos[g] = { type: c, id: d, width: e, height: f }),
          b.attr("data-video", g),
          this.thumbnail(a, this._videos[g]);
      }),
      (e.prototype.thumbnail = function (b, c) {
        var d,
          e,
          f,
          g =
            c.width && c.height
              ? 'style="width:' + c.width + "px;height:" + c.height + 'px;"'
              : "",
          h = b.find("img"),
          i = "src",
          j = "",
          k = this._core.settings,
          l = function (a) {
            (e = '<div class="owl-video-play-icon"></div>'),
              (d = k.lazyLoad
                ? '<div class="owl-video-tn ' +
                  j +
                  '" ' +
                  i +
                  '="' +
                  a +
                  '"></div>'
                : '<div class="owl-video-tn" style="opacity:1;background-image:url(' +
                  a +
                  ')"></div>'),
              b.after(d),
              b.after(e);
          };
        if (
          (b.wrap('<div class="owl-video-wrapper"' + g + "></div>"),
          this._core.settings.lazyLoad && ((i = "data-src"), (j = "owl-lazy")),
          h.length)
        )
          return l(h.attr(i)), h.remove(), !1;
        "youtube" === c.type
          ? ((f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg"), l(f))
          : "vimeo" === c.type
          ? a.ajax({
              type: "GET",
              url: "//vimeo.com/api/v2/video/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a[0].thumbnail_large), l(f);
              },
            })
          : "vzaar" === c.type &&
            a.ajax({
              type: "GET",
              url: "//vzaar.com/api/videos/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a.framegrab_url), l(f);
              },
            });
      }),
      (e.prototype.stop = function () {
        this._core.trigger("stop", null, "video"),
          this._playing.find(".owl-video-frame").remove(),
          this._playing.removeClass("owl-video-playing"),
          (this._playing = null),
          this._core.leave("playing"),
          this._core.trigger("stopped", null, "video");
      }),
      (e.prototype.play = function (b) {
        var c,
          d = a(b.target),
          e = d.closest("." + this._core.settings.itemClass),
          f = this._videos[e.attr("data-video")],
          g = f.width || "100%",
          h = f.height || this._core.$stage.height();
        this._playing ||
          (this._core.enter("playing"),
          this._core.trigger("play", null, "video"),
          (e = this._core.items(this._core.relative(e.index()))),
          this._core.reset(e.index()),
          "youtube" === f.type
            ? (c =
                '<iframe width="' +
                g +
                '" height="' +
                h +
                '" src="//www.youtube.com/embed/' +
                f.id +
                "?autoplay=1&rel=0&v=" +
                f.id +
                '" frameborder="0" allowfullscreen></iframe>')
            : "vimeo" === f.type
            ? (c =
                '<iframe src="//player.vimeo.com/video/' +
                f.id +
                '?autoplay=1" width="' +
                g +
                '" height="' +
                h +
                '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
            : "vzaar" === f.type &&
              (c =
                '<iframe frameborder="0"height="' +
                h +
                '"width="' +
                g +
                '" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' +
                f.id +
                '/player?autoplay=true"></iframe>'),
          a('<div class="owl-video-frame">' + c + "</div>").insertAfter(
            e.find(".owl-video")
          ),
          (this._playing = e.addClass("owl-video-playing")));
      }),
      (e.prototype.isInFullScreen = function () {
        var b =
          c.fullscreenElement ||
          c.mozFullScreenElement ||
          c.webkitFullscreenElement;
        return b && a(b).parent().hasClass("owl-video-frame");
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Video = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this.core = b),
        (this.core.options = a.extend({}, e.Defaults, this.core.options)),
        (this.swapping = !0),
        (this.previous = d),
        (this.next = d),
        (this.handlers = {
          "change.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" == a.property.name &&
              ((this.previous = this.core.current()),
              (this.next = a.property.value));
          }, this),
          "drag.owl.carousel dragged.owl.carousel translated.owl.carousel":
            a.proxy(function (a) {
              a.namespace && (this.swapping = "translated" == a.type);
            }, this),
          "translate.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this.swapping &&
              (this.core.options.animateOut || this.core.options.animateIn) &&
              this.swap();
          }, this),
        }),
        this.core.$element.on(this.handlers);
    };
    (e.Defaults = { animateOut: !1, animateIn: !1 }),
      (e.prototype.swap = function () {
        if (
          1 === this.core.settings.items &&
          a.support.animation &&
          a.support.transition
        ) {
          this.core.speed(0);
          var b,
            c = a.proxy(this.clear, this),
            d = this.core.$stage.children().eq(this.previous),
            e = this.core.$stage.children().eq(this.next),
            f = this.core.settings.animateIn,
            g = this.core.settings.animateOut;
          this.core.current() !== this.previous &&
            (g &&
              ((b =
                this.core.coordinates(this.previous) -
                this.core.coordinates(this.next)),
              d
                .one(a.support.animation.end, c)
                .css({ left: b + "px" })
                .addClass("animated owl-animated-out")
                .addClass(g)),
            f &&
              e
                .one(a.support.animation.end, c)
                .addClass("animated owl-animated-in")
                .addClass(f));
        }
      }),
      (e.prototype.clear = function (b) {
        a(b.target)
          .css({ left: "" })
          .removeClass("animated owl-animated-out owl-animated-in")
          .removeClass(this.core.settings.animateIn)
          .removeClass(this.core.settings.animateOut),
          this.core.onTransitionEnd();
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Animate = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._timeout = null),
        (this._paused = !1),
        (this._handlers = {
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "settings" === a.property.name
              ? this._core.settings.autoplay
                ? this.play()
                : this.stop()
              : a.namespace &&
                "position" === a.property.name &&
                this._core.settings.autoplay &&
                this._setAutoPlayInterval();
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoplay && this.play();
          }, this),
          "play.owl.autoplay": a.proxy(function (a, b, c) {
            a.namespace && this.play(b, c);
          }, this),
          "stop.owl.autoplay": a.proxy(function (a) {
            a.namespace && this.stop();
          }, this),
          "mouseover.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "mouseleave.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.play();
          }, this),
          "touchstart.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "touchend.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause && this.play();
          }, this),
        }),
        this._core.$element.on(this._handlers),
        (this._core.options = a.extend({}, e.Defaults, this._core.options));
    };
    (e.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1,
    }),
      (e.prototype.play = function (a, b) {
        (this._paused = !1),
          this._core.is("rotating") ||
            (this._core.enter("rotating"), this._setAutoPlayInterval());
      }),
      (e.prototype._getNextTimeout = function (d, e) {
        return (
          this._timeout && b.clearTimeout(this._timeout),
          b.setTimeout(
            a.proxy(function () {
              this._paused ||
                this._core.is("busy") ||
                this._core.is("interacting") ||
                c.hidden ||
                this._core.next(e || this._core.settings.autoplaySpeed);
            }, this),
            d || this._core.settings.autoplayTimeout
          )
        );
      }),
      (e.prototype._setAutoPlayInterval = function () {
        this._timeout = this._getNextTimeout();
      }),
      (e.prototype.stop = function () {
        this._core.is("rotating") &&
          (b.clearTimeout(this._timeout), this._core.leave("rotating"));
      }),
      (e.prototype.pause = function () {
        this._core.is("rotating") && (this._paused = !0);
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this.stop();
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.autoplay = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (b) {
      (this._core = b),
        (this._initialized = !1),
        (this._pages = []),
        (this._controls = {}),
        (this._templates = []),
        (this.$element = this._core.$element),
        (this._overrides = {
          next: this._core.next,
          prev: this._core.prev,
          to: this._core.to,
        }),
        (this._handlers = {
          "prepared.owl.carousel": a.proxy(function (b) {
            b.namespace &&
              this._core.settings.dotsData &&
              this._templates.push(
                '<div class="' +
                  this._core.settings.dotClass +
                  '">' +
                  a(b.content)
                    .find("[data-dot]")
                    .addBack("[data-dot]")
                    .attr("data-dot") +
                  "</div>"
              );
          }, this),
          "added.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 0, this._templates.pop());
          }, this),
          "remove.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 1);
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "position" == a.property.name && this.draw();
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              !this._initialized &&
              (this._core.trigger("initialize", null, "navigation"),
              this.initialize(),
              this.update(),
              this.draw(),
              (this._initialized = !0),
              this._core.trigger("initialized", null, "navigation"));
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._initialized &&
              (this._core.trigger("refresh", null, "navigation"),
              this.update(),
              this.draw(),
              this._core.trigger("refreshed", null, "navigation"));
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers);
    };
    (e.Defaults = {
      nav: !1,
      navText: ["prev", "next"],
      navSpeed: !1,
      navElement: "div",
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotsData: !1,
      dotsSpeed: !1,
      dotsContainer: !1,
    }),
      (e.prototype.initialize = function () {
        var b,
          c = this._core.settings;
        (this._controls.$relative = (
          c.navContainer
            ? a(c.navContainer)
            : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)
        ).addClass("disabled")),
          (this._controls.$previous = a("<" + c.navElement + ">")
            .addClass(c.navClass[0])
            .html(c.navText[0])
            .prependTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.prev(c.navSpeed);
              }, this)
            )),
          (this._controls.$next = a("<" + c.navElement + ">")
            .addClass(c.navClass[1])
            .html(c.navText[1])
            .appendTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.next(c.navSpeed);
              }, this)
            )),
          c.dotsData ||
            (this._templates = [
              a("<div>")
                .addClass(c.dotClass)
                .append(a("<span>"))
                .prop("outerHTML"),
            ]),
          (this._controls.$absolute = (
            c.dotsContainer
              ? a(c.dotsContainer)
              : a("<div>").addClass(c.dotsClass).appendTo(this.$element)
          ).addClass("disabled")),
          this._controls.$absolute.on(
            "click",
            "div",
            a.proxy(function (b) {
              var d = a(b.target).parent().is(this._controls.$absolute)
                ? a(b.target).index()
                : a(b.target).parent().index();
              b.preventDefault(), this.to(d, c.dotsSpeed);
            }, this)
          );
        for (b in this._overrides) this._core[b] = a.proxy(this[b], this);
      }),
      (e.prototype.destroy = function () {
        var a, b, c, d;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls) this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (e.prototype.update = function () {
        var a,
          b,
          c,
          d = this._core.clones().length / 2,
          e = d + this._core.items().length,
          f = this._core.maximum(!0),
          g = this._core.settings,
          h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
        if (
          ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)),
          g.dots || "page" == g.slideBy)
        )
          for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
            if (b >= h || 0 === b) {
              if (
                (this._pages.push({
                  start: Math.min(f, a - d),
                  end: a - d + h - 1,
                }),
                Math.min(f, a - d) === f)
              )
                break;
              (b = 0), ++c;
            }
            b += this._core.mergers(this._core.relative(a));
          }
      }),
      (e.prototype.draw = function () {
        var b,
          c = this._core.settings,
          d = this._core.items().length <= c.items,
          e = this._core.relative(this._core.current()),
          f = c.loop || c.rewind;
        this._controls.$relative.toggleClass("disabled", !c.nav || d),
          c.nav &&
            (this._controls.$previous.toggleClass(
              "disabled",
              !f && e <= this._core.minimum(!0)
            ),
            this._controls.$next.toggleClass(
              "disabled",
              !f && e >= this._core.maximum(!0)
            )),
          this._controls.$absolute.toggleClass("disabled", !c.dots || d),
          c.dots &&
            ((b =
              this._pages.length - this._controls.$absolute.children().length),
            c.dotsData && 0 !== b
              ? this._controls.$absolute.html(this._templates.join(""))
              : b > 0
              ? this._controls.$absolute.append(
                  new Array(b + 1).join(this._templates[0])
                )
              : b < 0 && this._controls.$absolute.children().slice(b).remove(),
            this._controls.$absolute.find(".active").removeClass("active"),
            this._controls.$absolute
              .children()
              .eq(a.inArray(this.current(), this._pages))
              .addClass("active"));
      }),
      (e.prototype.onTrigger = function (b) {
        var c = this._core.settings;
        b.page = {
          index: a.inArray(this.current(), this._pages),
          count: this._pages.length,
          size:
            c &&
            (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items),
        };
      }),
      (e.prototype.current = function () {
        var b = this._core.relative(this._core.current());
        return a
          .grep(
            this._pages,
            a.proxy(function (a, c) {
              return a.start <= b && a.end >= b;
            }, this)
          )
          .pop();
      }),
      (e.prototype.getPosition = function (b) {
        var c,
          d,
          e = this._core.settings;
        return (
          "page" == e.slideBy
            ? ((c = a.inArray(this.current(), this._pages)),
              (d = this._pages.length),
              b ? ++c : --c,
              (c = this._pages[((c % d) + d) % d].start))
            : ((c = this._core.relative(this._core.current())),
              (d = this._core.items().length),
              b ? (c += e.slideBy) : (c -= e.slideBy)),
          c
        );
      }),
      (e.prototype.next = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b);
      }),
      (e.prototype.prev = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b);
      }),
      (e.prototype.to = function (b, c, d) {
        var e;
        !d && this._pages.length
          ? ((e = this._pages.length),
            a.proxy(this._overrides.to, this._core)(
              this._pages[((b % e) + e) % e].start,
              c
            ))
          : a.proxy(this._overrides.to, this._core)(b, c);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Navigation = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (c) {
      (this._core = c),
        (this._hashes = {}),
        (this.$element = this._core.$element),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (c) {
            c.namespace &&
              "URLHash" === this._core.settings.startPosition &&
              a(b).trigger("hashchange.owl.navigation");
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content)
                .find("[data-hash]")
                .addBack("[data-hash]")
                .attr("data-hash");
              if (!c) return;
              this._hashes[c] = b.content;
            }
          }, this),
          "changed.owl.carousel": a.proxy(function (c) {
            if (c.namespace && "position" === c.property.name) {
              var d = this._core.items(
                  this._core.relative(this._core.current())
                ),
                e = a
                  .map(this._hashes, function (a, b) {
                    return a === d ? b : null;
                  })
                  .join();
              if (!e || b.location.hash.slice(1) === e) return;
              b.location.hash = e;
            }
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers),
        a(b).on(
          "hashchange.owl.navigation",
          a.proxy(function (a) {
            var c = b.location.hash.substring(1),
              e = this._core.$stage.children(),
              f = this._hashes[c] && e.index(this._hashes[c]);
            f !== d &&
              f !== this._core.current() &&
              this._core.to(this._core.relative(f), !1, !0);
          }, this)
        );
    };
    (e.Defaults = { URLhashListener: !1 }),
      (e.prototype.destroy = function () {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this))
          "function" != typeof this[d] && (this[d] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Hash = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    function e(b, c) {
      var e = !1,
        f = b.charAt(0).toUpperCase() + b.slice(1);
      return (
        a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
          if (g[b] !== d) return (e = !c || b), !1;
        }),
        e
      );
    }
    function f(a) {
      return e(a, !0);
    }
    var g = a("<support>").get(0).style,
      h = "Webkit Moz O ms".split(" "),
      i = {
        transition: {
          end: {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            transition: "transitionend",
          },
        },
        animation: {
          end: {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            animation: "animationend",
          },
        },
      },
      j = {
        csstransforms: function () {
          return !!e("transform");
        },
        csstransforms3d: function () {
          return !!e("perspective");
        },
        csstransitions: function () {
          return !!e("transition");
        },
        cssanimations: function () {
          return !!e("animation");
        },
      };
    j.csstransitions() &&
      ((a.support.transition = new String(f("transition"))),
      (a.support.transition.end = i.transition.end[a.support.transition])),
      j.cssanimations() &&
        ((a.support.animation = new String(f("animation"))),
        (a.support.animation.end = i.animation.end[a.support.animation])),
      j.csstransforms() &&
        ((a.support.transform = new String(f("transform"))),
        (a.support.transform3d = j.csstransforms3d()));
  })(window.Zepto || window.jQuery, window, document);

/*
jQuery Waypoints - v2.0.3
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function () {
  var t =
      [].indexOf ||
      function (t) {
        for (var e = 0, n = this.length; e < n; e++) {
          if (e in this && this[e] === t) return e;
        }
        return -1;
      },
    e = [].slice;
  (function (t, e) {
    if (typeof define === "function" && define.amd) {
      return define("waypoints", ["jquery"], function (n) {
        return e(n, t);
      });
    } else {
      return e(t.jQuery, t);
    }
  })(this, function (n, r) {
    var i, o, l, s, f, u, a, c, h, d, p, y, v, w, g, m;
    i = n(r);
    c = t.call(r, "ontouchstart") >= 0;
    s = { horizontal: {}, vertical: {} };
    f = 1;
    a = {};
    u = "waypoints-context-id";
    p = "resize.waypoints";
    y = "scroll.waypoints";
    v = 1;
    w = "waypoints-waypoint-ids";
    g = "waypoint";
    m = "waypoints";
    o = (function () {
      function t(t) {
        var e = this;
        this.$element = t;
        this.element = t[0];
        this.didResize = false;
        this.didScroll = false;
        this.id = "context" + f++;
        this.oldScroll = { x: t.scrollLeft(), y: t.scrollTop() };
        this.waypoints = { horizontal: {}, vertical: {} };
        t.data(u, this.id);
        a[this.id] = this;
        t.bind(y, function () {
          var t;
          if (!(e.didScroll || c)) {
            e.didScroll = true;
            t = function () {
              e.doScroll();
              return (e.didScroll = false);
            };
            return r.setTimeout(t, n[m].settings.scrollThrottle);
          }
        });
        t.bind(p, function () {
          var t;
          if (!e.didResize) {
            e.didResize = true;
            t = function () {
              n[m]("refresh");
              return (e.didResize = false);
            };
            return r.setTimeout(t, n[m].settings.resizeThrottle);
          }
        });
      }
      t.prototype.doScroll = function () {
        var t,
          e = this;
        t = {
          horizontal: {
            newScroll: this.$element.scrollLeft(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left",
          },
          vertical: {
            newScroll: this.$element.scrollTop(),
            oldScroll: this.oldScroll.y,
            forward: "down",
            backward: "up",
          },
        };
        if (c && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
          n[m]("refresh");
        }
        n.each(t, function (t, r) {
          var i, o, l;
          l = [];
          o = r.newScroll > r.oldScroll;
          i = o ? r.forward : r.backward;
          n.each(e.waypoints[t], function (t, e) {
            var n, i;
            if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
              return l.push(e);
            } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
              return l.push(e);
            }
          });
          l.sort(function (t, e) {
            return t.offset - e.offset;
          });
          if (!o) {
            l.reverse();
          }
          return n.each(l, function (t, e) {
            if (e.options.continuous || t === l.length - 1) {
              return e.trigger([i]);
            }
          });
        });
        return (this.oldScroll = {
          x: t.horizontal.newScroll,
          y: t.vertical.newScroll,
        });
      };
      t.prototype.refresh = function () {
        var t,
          e,
          r,
          i = this;
        r = n.isWindow(this.element);
        e = this.$element.offset();
        this.doScroll();
        t = {
          horizontal: {
            contextOffset: r ? 0 : e.left,
            contextScroll: r ? 0 : this.oldScroll.x,
            contextDimension: this.$element.width(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left",
            offsetProp: "left",
          },
          vertical: {
            contextOffset: r ? 0 : e.top,
            contextScroll: r ? 0 : this.oldScroll.y,
            contextDimension: r
              ? n[m]("viewportHeight")
              : this.$element.height(),
            oldScroll: this.oldScroll.y,
            forward: "down",
            backward: "up",
            offsetProp: "top",
          },
        };
        return n.each(t, function (t, e) {
          return n.each(i.waypoints[t], function (t, r) {
            var i, o, l, s, f;
            i = r.options.offset;
            l = r.offset;
            o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
            if (n.isFunction(i)) {
              i = i.apply(r.element);
            } else if (typeof i === "string") {
              i = parseFloat(i);
              if (r.options.offset.indexOf("%") > -1) {
                i = Math.ceil((e.contextDimension * i) / 100);
              }
            }
            r.offset = o - e.contextOffset + e.contextScroll - i;
            if ((r.options.onlyOnScroll && l != null) || !r.enabled) {
              return;
            }
            if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
              return r.trigger([e.backward]);
            } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
              return r.trigger([e.forward]);
            } else if (l === null && e.oldScroll >= r.offset) {
              return r.trigger([e.forward]);
            }
          });
        });
      };
      t.prototype.checkEmpty = function () {
        if (
          n.isEmptyObject(this.waypoints.horizontal) &&
          n.isEmptyObject(this.waypoints.vertical)
        ) {
          this.$element.unbind([p, y].join(" "));
          return delete a[this.id];
        }
      };
      return t;
    })();
    l = (function () {
      function t(t, e, r) {
        var i, o;
        r = n.extend({}, n.fn[g].defaults, r);
        if (r.offset === "bottom-in-view") {
          r.offset = function () {
            var t;
            t = n[m]("viewportHeight");
            if (!n.isWindow(e.element)) {
              t = e.$element.height();
            }
            return t - n(this).outerHeight();
          };
        }
        this.$element = t;
        this.element = t[0];
        this.axis = r.horizontal ? "horizontal" : "vertical";
        this.callback = r.handler;
        this.context = e;
        this.enabled = r.enabled;
        this.id = "waypoints" + v++;
        this.offset = null;
        this.options = r;
        e.waypoints[this.axis][this.id] = this;
        s[this.axis][this.id] = this;
        i = (o = t.data(w)) != null ? o : [];
        i.push(this.id);
        t.data(w, i);
      }
      t.prototype.trigger = function (t) {
        if (!this.enabled) {
          return;
        }
        if (this.callback != null) {
          this.callback.apply(this.element, t);
        }
        if (this.options.triggerOnce) {
          return this.destroy();
        }
      };
      t.prototype.disable = function () {
        return (this.enabled = false);
      };
      t.prototype.enable = function () {
        this.context.refresh();
        return (this.enabled = true);
      };
      t.prototype.destroy = function () {
        delete s[this.axis][this.id];
        delete this.context.waypoints[this.axis][this.id];
        return this.context.checkEmpty();
      };
      t.getWaypointsByElement = function (t) {
        var e, r;
        r = n(t).data(w);
        if (!r) {
          return [];
        }
        e = n.extend({}, s.horizontal, s.vertical);
        return n.map(r, function (t) {
          return e[t];
        });
      };
      return t;
    })();
    d = {
      init: function (t, e) {
        var r;
        if (e == null) {
          e = {};
        }
        if ((r = e.handler) == null) {
          e.handler = t;
        }
        this.each(function () {
          var t, r, i, s;
          t = n(this);
          i = (s = e.context) != null ? s : n.fn[g].defaults.context;
          if (!n.isWindow(i)) {
            i = t.closest(i);
          }
          i = n(i);
          r = a[i.data(u)];
          if (!r) {
            r = new o(i);
          }
          return new l(t, r, e);
        });
        n[m]("refresh");
        return this;
      },
      disable: function () {
        return d._invoke(this, "disable");
      },
      enable: function () {
        return d._invoke(this, "enable");
      },
      destroy: function () {
        return d._invoke(this, "destroy");
      },
      prev: function (t, e) {
        return d._traverse.call(this, t, e, function (t, e, n) {
          if (e > 0) {
            return t.push(n[e - 1]);
          }
        });
      },
      next: function (t, e) {
        return d._traverse.call(this, t, e, function (t, e, n) {
          if (e < n.length - 1) {
            return t.push(n[e + 1]);
          }
        });
      },
      _traverse: function (t, e, i) {
        var o, l;
        if (t == null) {
          t = "vertical";
        }
        if (e == null) {
          e = r;
        }
        l = h.aggregate(e);
        o = [];
        this.each(function () {
          var e;
          e = n.inArray(this, l[t]);
          return i(o, e, l[t]);
        });
        return this.pushStack(o);
      },
      _invoke: function (t, e) {
        t.each(function () {
          var t;
          t = l.getWaypointsByElement(this);
          return n.each(t, function (t, n) {
            n[e]();
            return true;
          });
        });
        return this;
      },
    };
    n.fn[g] = function () {
      var t, r;
      (r = arguments[0]),
        (t = 2 <= arguments.length ? e.call(arguments, 1) : []);
      if (d[r]) {
        return d[r].apply(this, t);
      } else if (n.isFunction(r)) {
        return d.init.apply(this, arguments);
      } else if (n.isPlainObject(r)) {
        return d.init.apply(this, [null, r]);
      } else if (!r) {
        return n.error(
          "jQuery Waypoints needs a callback function or handler option."
        );
      } else {
        return n.error(
          "The " + r + " method does not exist in jQuery Waypoints."
        );
      }
    };
    n.fn[g].defaults = {
      context: r,
      continuous: true,
      enabled: true,
      horizontal: false,
      offset: 0,
      triggerOnce: false,
    };
    h = {
      refresh: function () {
        return n.each(a, function (t, e) {
          return e.refresh();
        });
      },
      viewportHeight: function () {
        var t;
        return (t = r.innerHeight) != null ? t : i.height();
      },
      aggregate: function (t) {
        var e, r, i;
        e = s;
        if (t) {
          e = (i = a[n(t).data(u)]) != null ? i.waypoints : void 0;
        }
        if (!e) {
          return [];
        }
        r = { horizontal: [], vertical: [] };
        n.each(r, function (t, i) {
          n.each(e[t], function (t, e) {
            return i.push(e);
          });
          i.sort(function (t, e) {
            return t.offset - e.offset;
          });
          r[t] = n.map(i, function (t) {
            return t.element;
          });
          return (r[t] = n.unique(r[t]));
        });
        return r;
      },
      above: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "vertical", function (t, e) {
          return e.offset <= t.oldScroll.y;
        });
      },
      below: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "vertical", function (t, e) {
          return e.offset > t.oldScroll.y;
        });
      },
      left: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "horizontal", function (t, e) {
          return e.offset <= t.oldScroll.x;
        });
      },
      right: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "horizontal", function (t, e) {
          return e.offset > t.oldScroll.x;
        });
      },
      enable: function () {
        return h._invoke("enable");
      },
      disable: function () {
        return h._invoke("disable");
      },
      destroy: function () {
        return h._invoke("destroy");
      },
      extendFn: function (t, e) {
        return (d[t] = e);
      },
      _invoke: function (t) {
        var e;
        e = n.extend({}, s.vertical, s.horizontal);
        return n.each(e, function (e, n) {
          n[t]();
          return true;
        });
      },
      _filter: function (t, e, r) {
        var i, o;
        i = a[n(t).data(u)];
        if (!i) {
          return [];
        }
        o = [];
        n.each(i.waypoints[e], function (t, e) {
          if (r(i, e)) {
            return o.push(e);
          }
        });
        o.sort(function (t, e) {
          return t.offset - e.offset;
        });
        return n.map(o, function (t) {
          return t.element;
        });
      },
    };
    n[m] = function () {
      var t, n;
      (n = arguments[0]),
        (t = 2 <= arguments.length ? e.call(arguments, 1) : []);
      if (h[n]) {
        return h[n].apply(null, t);
      } else {
        return h.aggregate.call(null, n);
      }
    };
    n[m].settings = { resizeThrottle: 100, scrollThrottle: 30 };
    return i.load(function () {
      return n[m]("refresh");
    });
  });
}.call(this));

/*!
 * jquery.counterup.js 1.0
 *
 * Copyright 2013, Benjamin Intal http://gambit.ph @bfintal
 * Released under the GPL v2 License
 *
 * Date: Nov 26, 2013
 */ (function (e) {
  "use strict";
  e.fn.counterUp = function (t) {
    var n = e.extend({ time: 400, delay: 10 }, t);
    return this.each(function () {
      var t = e(this),
        r = n,
        i = function () {
          var e = [],
            n = r.time / r.delay,
            i = t.text(),
            s = /[0-9]+,[0-9]+/.test(i);
          i = i.replace(/,/g, "");
          var o = /^[0-9]+$/.test(i),
            u = /^[0-9]+\.[0-9]+$/.test(i),
            a = u ? (i.split(".")[1] || []).length : 0;
          for (var f = n; f >= 1; f--) {
            var l = parseInt((i / n) * f);
            u && (l = parseFloat((i / n) * f).toFixed(a));
            if (s)
              while (/(\d+)(\d{3})/.test(l.toString()))
                l = l.toString().replace(/(\d+)(\d{3})/, "$1,$2");
            e.unshift(l);
          }
          t.data("counterup-nums", e);
          t.text("0");
          var c = function () {
            t.text(t.data("counterup-nums").shift());
            if (t.data("counterup-nums").length)
              setTimeout(t.data("counterup-func"), r.delay);
            else {
              delete t.data("counterup-nums");
              t.data("counterup-nums", null);
              t.data("counterup-func", null);
            }
          };
          t.data("counterup-func", c);
          setTimeout(t.data("counterup-func"), r.delay);
        };
      t.waypoint(i, { offset: "100%", triggerOnce: !0 });
    });
  };
})(jQuery);

/*jquery.mb.YTPlayer 11-05-2017
 _ jquery.mb.components 
 _ email: matteo@open-lab.com 
 _ Copyright (c) 2001-2017. Matteo Bicocchi (Pupunzi); 
 _ blog: http://pupunzi.open-lab.com 
 _ Open Lab s.r.l., Florence - Italy 
 */
function onYouTubeIframeAPIReady() {
  ytp.YTAPIReady ||
    ((ytp.YTAPIReady = !0), jQuery(document).trigger("YTAPIReady"));
}
function uncamel(a) {
  return a.replace(/([A-Z])/g, function (a) {
    return "-" + a.toLowerCase();
  });
}
function setUnit(a, b) {
  return "string" != typeof a || a.match(/^[\-0-9\.]+jQuery/) ? "" + a + b : a;
}
function setFilter(a, b, c) {
  var d = uncamel(b),
    e = jQuery.browser.mozilla ? "" : jQuery.CSS.sfx;
  (a[e + "filter"] = a[e + "filter"] || ""),
    (c = setUnit(
      c > jQuery.CSS.filters[b].max ? jQuery.CSS.filters[b].max : c,
      jQuery.CSS.filters[b].unit
    )),
    (a[e + "filter"] += d + "(" + c + ") "),
    delete a[b];
}
function isTouchSupported() {
  var a = nAgt.msMaxTouchPoints,
    b = "ontouchstart" in document.createElement("div");
  return a || b ? !0 : !1;
}
var ytp = ytp || {},
  getYTPVideoID = function (a) {
    var b, c;
    return (
      a.indexOf("youtu.be") > 0
        ? ((b = a.substr(a.lastIndexOf("/") + 1, a.length)),
          (c =
            b.indexOf("?list=") > 0
              ? b.substr(b.lastIndexOf("="), b.length)
              : null),
          (b = c ? b.substr(0, b.lastIndexOf("?")) : b))
        : a.indexOf("http") > -1
        ? ((b = a.match(/[\\?&]v=([^&#]*)/)[1]),
          (c =
            a.indexOf("list=") > 0 ? a.match(/[\\?&]list=([^&#]*)/)[1] : null))
        : ((b = a.length > 15 ? null : a), (c = b ? null : a)),
      { videoID: b, playlistID: c }
    );
  };
!(function (jQuery, ytp) {
  (jQuery.mbYTPlayer = {
    name: "jquery.mb.YTPlayer",
    version: "3.0.19",
    build: "6250",
    author: "Matteo Bicocchi (pupunzi)",
    apiKey: "",
    defaults: {
      containment: "body",
      ratio: "auto",
      videoURL: null,
      playlistURL: null,
      startAt: 0,
      stopAt: 0,
      autoPlay: !0,
      vol: 50,
      addRaster: !1,
      mask: !1,
      opacity: 1,
      quality: "default",
      mute: !1,
      loop: !0,
      fadeOnStartTime: 500,
      showControls: !0,
      showAnnotations: !1,
      showYTLogo: !0,
      stopMovieOnBlur: !0,
      realfullscreen: !0,
      mobileFallbackImage: null,
      gaTrack: !0,
      optimizeDisplay: !0,
      remember_last_time: !1,
      anchor: "center,center",
      onReady: function (a) {},
      onError: function (a, b) {},
    },
    controls: {
      play: "P",
      pause: "p",
      mute: "M",
      unmute: "A",
      onlyYT: "O",
      showSite: "R",
      ytLogo: "Y",
    },
    controlBar: null,
    loading: null,
    locationProtocol: "https:",
    filters: {
      grayscale: { value: 0, unit: "%" },
      hue_rotate: { value: 0, unit: "deg" },
      invert: { value: 0, unit: "%" },
      opacity: { value: 0, unit: "%" },
      saturate: { value: 0, unit: "%" },
      sepia: { value: 0, unit: "%" },
      brightness: { value: 0, unit: "%" },
      contrast: { value: 0, unit: "%" },
      blur: { value: 0, unit: "px" },
    },
    buildPlayer: function (options) {
      return this.each(function () {
        var YTPlayer = this,
          $YTPlayer = jQuery(YTPlayer);
        (YTPlayer.loop = 0),
          (YTPlayer.opt = {}),
          (YTPlayer.state = {}),
          (YTPlayer.filters = jQuery.mbYTPlayer.filters),
          (YTPlayer.filtersEnabled = !0),
          (YTPlayer.id = YTPlayer.id || "YTP_" + new Date().getTime()),
          $YTPlayer.addClass("mb_YTPlayer");
        var property =
          $YTPlayer.data("property") &&
          "string" == typeof $YTPlayer.data("property")
            ? eval("(" + $YTPlayer.data("property") + ")")
            : $YTPlayer.data("property");
        "undefined" != typeof property &&
          "undefined" != typeof property.vol &&
          (property.vol =
            0 === property.vol ? (property.vol = 1) : property.vol),
          jQuery.extend(
            YTPlayer.opt,
            jQuery.mbYTPlayer.defaults,
            options,
            property
          ),
          YTPlayer.hasChanged ||
            ((YTPlayer.defaultOpt = {}),
            jQuery.extend(
              YTPlayer.defaultOpt,
              jQuery.mbYTPlayer.defaults,
              options
            )),
          "true" == YTPlayer.opt.loop && (YTPlayer.opt.loop = 9999),
          (YTPlayer.isRetina = window.retina || window.devicePixelRatio > 1);
        var isIframe = function () {
          var a = !1;
          try {
            self.location.href != top.location.href && (a = !0);
          } catch (b) {
            a = !0;
          }
          return a;
        };
        (YTPlayer.canGoFullScreen = !(
          jQuery.mbBrowser.msie ||
          jQuery.mbBrowser.opera ||
          isIframe()
        )),
          YTPlayer.canGoFullScreen || (YTPlayer.opt.realfullscreen = !1),
          $YTPlayer.attr("id") ||
            $YTPlayer.attr("id", "ytp_" + new Date().getTime());
        var playerID = "iframe_" + YTPlayer.id;
        (YTPlayer.isAlone = !1),
          (YTPlayer.hasFocus = !0),
          (YTPlayer.videoID = this.opt.videoURL
            ? getYTPVideoID(this.opt.videoURL).videoID
            : $YTPlayer.attr("href")
            ? getYTPVideoID($YTPlayer.attr("href")).videoID
            : !1),
          (YTPlayer.playlistID = this.opt.videoURL
            ? getYTPVideoID(this.opt.videoURL).playlistID
            : $YTPlayer.attr("href")
            ? getYTPVideoID($YTPlayer.attr("href")).playlistID
            : !1),
          (YTPlayer.opt.showAnnotations = YTPlayer.opt.showAnnotations
            ? "1"
            : "3");
        var start_from_last = 0;
        jQuery.mbCookie.get("YTPlayer_" + YTPlayer.videoID) &&
          (start_from_last = parseFloat(
            jQuery.mbCookie.get("YTPlayer_" + YTPlayer.videoID)
          )),
          YTPlayer.opt.remember_last_time &&
            start_from_last &&
            ((YTPlayer.start_from_last = start_from_last),
            jQuery.mbCookie.remove("YTPlayer_" + YTPlayer.videoID));
        var playerVars = {
          modestbranding: 1,
          autoplay: 0,
          controls: 0,
          showinfo: 0,
          rel: 0,
          enablejsapi: 1,
          version: 3,
          playerapiid: playerID,
          origin: "*",
          allowfullscreen: !0,
          wmode: "transparent",
          iv_load_policy: YTPlayer.opt.showAnnotations,
        };
        if (
          (document.createElement("video").canPlayType &&
            jQuery.extend(playerVars, { html5: 1 }),
          jQuery.mbBrowser.msie &&
            jQuery.mbBrowser.version < 9 &&
            (this.opt.opacity = 1),
          (YTPlayer.isSelf = "self" == YTPlayer.opt.containment),
          (YTPlayer.defaultOpt.containment = YTPlayer.opt.containment =
            jQuery(
              "self" == YTPlayer.opt.containment
                ? this
                : YTPlayer.opt.containment
            )),
          (YTPlayer.isBackground = YTPlayer.opt.containment.is("body")),
          !YTPlayer.isBackground || !ytp.backgroundIsInited)
        ) {
          var isPlayer = YTPlayer.opt.containment.is(jQuery(this));
          (YTPlayer.canPlayOnMobile =
            isPlayer && 0 === jQuery(this).children().length),
            (YTPlayer.isPlayer = !1),
            isPlayer ? (YTPlayer.isPlayer = !0) : $YTPlayer.hide();
          var overlay = jQuery("<div/>")
            .css({
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            })
            .addClass("YTPOverlay");
          YTPlayer.isPlayer &&
            overlay.on("click", function () {
              $YTPlayer.YTPTogglePlay();
            });
          var wrapper = jQuery("<div/>")
            .addClass("mbYTP_wrapper")
            .attr("id", "wrapper_" + YTPlayer.id);
          wrapper.css({
            position: "absolute",
            zIndex: 0,
            minWidth: "100%",
            minHeight: "100%",
            left: 0,
            top: 0,
            overflow: "hidden",
            opacity: 0,
          });
          var playerBox = jQuery("<div/>")
            .attr("id", playerID)
            .addClass("playerBox");
          if (
            (playerBox.css({
              position: "absolute",
              zIndex: 0,
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              overflow: "hidden",
            }),
            wrapper.append(playerBox),
            YTPlayer.opt.containment
              .children()
              .not("script, style")
              .each(function () {
                "static" == jQuery(this).css("position") &&
                  jQuery(this).css("position", "relative");
              }),
            YTPlayer.isBackground
              ? (jQuery("body").css({ boxSizing: "border-box" }),
                wrapper.css({ position: "fixed", top: 0, left: 0, zIndex: 0 }),
                $YTPlayer.hide())
              : "static" == YTPlayer.opt.containment.css("position") &&
                YTPlayer.opt.containment.css({ position: "relative" }),
            YTPlayer.opt.containment.prepend(wrapper),
            (YTPlayer.wrapper = wrapper),
            playerBox.css({ opacity: 1 }),
            jQuery.mbBrowser.mobile ||
              (playerBox.after(overlay), (YTPlayer.overlay = overlay)),
            YTPlayer.isBackground ||
              overlay
                .on("mouseenter", function () {
                  YTPlayer.controlBar &&
                    YTPlayer.controlBar.length &&
                    YTPlayer.controlBar.addClass("visible");
                })
                .on("mouseleave", function () {
                  YTPlayer.controlBar &&
                    YTPlayer.controlBar.length &&
                    YTPlayer.controlBar.removeClass("visible");
                }),
            ytp.YTAPIReady)
          )
            setTimeout(function () {
              jQuery(document).trigger("YTAPIReady");
            }, 100);
          else {
            jQuery("#YTAPI").remove();
            var tag = jQuery("<script></script>").attr({
              src:
                jQuery.mbYTPlayer.locationProtocol +
                "//www.youtube.com/iframe_api?v=" +
                jQuery.mbYTPlayer.version,
              id: "YTAPI",
            });
            jQuery("head").prepend(tag);
          }
          if (jQuery.mbBrowser.mobile && !YTPlayer.canPlayOnMobile)
            return (
              YTPlayer.opt.mobileFallbackImage &&
                wrapper.css({
                  backgroundImage:
                    "url(" + YTPlayer.opt.mobileFallbackImage + ")",
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  opacity: 1,
                }),
              $YTPlayer.remove(),
              void jQuery(document).trigger("YTPUnavailable")
            );
          jQuery(document).on("YTAPIReady", function () {
            (YTPlayer.isBackground && ytp.backgroundIsInited) ||
              YTPlayer.isInit ||
              (YTPlayer.isBackground && (ytp.backgroundIsInited = !0),
              (YTPlayer.opt.autoPlay =
                "undefined" == typeof YTPlayer.opt.autoPlay
                  ? YTPlayer.isBackground
                    ? !0
                    : !1
                  : YTPlayer.opt.autoPlay),
              (YTPlayer.opt.vol = YTPlayer.opt.vol ? YTPlayer.opt.vol : 100),
              jQuery.mbYTPlayer.getDataFromAPI(YTPlayer),
              jQuery(YTPlayer).on("YTPChanged", function () {
                if (!YTPlayer.isInit) {
                  if (
                    ((YTPlayer.isInit = !0),
                    jQuery.mbBrowser.mobile && YTPlayer.canPlayOnMobile)
                  ) {
                    if (
                      YTPlayer.opt.containment.outerWidth() >
                      jQuery(window).width()
                    ) {
                      YTPlayer.opt.containment.css({ maxWidth: "100%" });
                      var h = 0.563 * YTPlayer.opt.containment.outerWidth();
                      YTPlayer.opt.containment.css({ maxHeight: h });
                    }
                    return void new YT.Player(playerID, {
                      videoId: YTPlayer.videoID.toString(),
                      width: "100%",
                      height: h,
                      playerVars: playerVars,
                      events: {
                        onReady: function (a) {
                          (YTPlayer.player = a.target),
                            playerBox.css({ opacity: 1 }),
                            YTPlayer.wrapper.css({ opacity: 1 });
                        },
                      },
                    });
                  }
                  new YT.Player(playerID, {
                    videoId: YTPlayer.videoID.toString(),
                    playerVars: playerVars,
                    events: {
                      onReady: function (a) {
                        (YTPlayer.player = a.target),
                          YTPlayer.isReady ||
                            ((YTPlayer.isReady =
                              YTPlayer.isPlayer && !YTPlayer.opt.autoPlay
                                ? !1
                                : !0),
                            (YTPlayer.playerEl = YTPlayer.player.getIframe()),
                            jQuery(YTPlayer.playerEl).unselectable(),
                            $YTPlayer.optimizeDisplay(),
                            jQuery(window)
                              .off("resize.YTP_" + YTPlayer.id)
                              .on("resize.YTP_" + YTPlayer.id, function () {
                                $YTPlayer.optimizeDisplay();
                              }),
                            YTPlayer.opt.remember_last_time &&
                              jQuery(window).on(
                                "unload.YTP_" + YTPlayer.id,
                                function () {
                                  var a = YTPlayer.player.getCurrentTime();
                                  jQuery.mbCookie.set(
                                    "YTPlayer_" + YTPlayer.videoID,
                                    a,
                                    1
                                  );
                                }
                              ),
                            jQuery.mbYTPlayer.checkForState(YTPlayer));
                      },
                      onStateChange: function (event) {
                        if ("function" == typeof event.target.getPlayerState) {
                          var state = event.target.getPlayerState();
                          if (YTPlayer.preventTrigger)
                            return void (YTPlayer.preventTrigger = !1);
                          YTPlayer.state = state;
                          var eventType;
                          switch (state) {
                            case -1:
                              eventType = "YTPUnstarted";
                              break;
                            case 0:
                              eventType = "YTPRealEnd";
                              break;
                            case 1:
                              (eventType = "YTPPlay"),
                                YTPlayer.controlBar.length &&
                                  YTPlayer.controlBar
                                    .find(".mb_YTPPlaypause")
                                    .html(jQuery.mbYTPlayer.controls.pause),
                                "undefined" != typeof _gaq &&
                                  eval(YTPlayer.opt.gaTrack) &&
                                  _gaq.push([
                                    "_trackEvent",
                                    "YTPlayer",
                                    "Play",
                                    YTPlayer.hasData
                                      ? YTPlayer.videoData.title
                                      : YTPlayer.videoID.toString(),
                                  ]),
                                "undefined" != typeof ga &&
                                  eval(YTPlayer.opt.gaTrack) &&
                                  ga(
                                    "send",
                                    "event",
                                    "YTPlayer",
                                    "play",
                                    YTPlayer.hasData
                                      ? YTPlayer.videoData.title
                                      : YTPlayer.videoID.toString()
                                  );
                              break;
                            case 2:
                              (eventType = "YTPPause"),
                                YTPlayer.controlBar.length &&
                                  YTPlayer.controlBar
                                    .find(".mb_YTPPlaypause")
                                    .html(jQuery.mbYTPlayer.controls.play);
                              break;
                            case 3:
                              YTPlayer.player.setPlaybackQuality(
                                YTPlayer.opt.quality
                              ),
                                (eventType = "YTPBuffering"),
                                YTPlayer.controlBar.length &&
                                  YTPlayer.controlBar
                                    .find(".mb_YTPPlaypause")
                                    .html(jQuery.mbYTPlayer.controls.play);
                              break;
                            case 5:
                              eventType = "YTPCued";
                          }
                          var YTPEvent = jQuery.Event(eventType);
                          (YTPEvent.time = YTPlayer.currentTime),
                            YTPlayer.canTrigger &&
                              jQuery(YTPlayer).trigger(YTPEvent);
                        }
                      },
                      onPlaybackQualityChange: function (a) {
                        var b = a.target.getPlaybackQuality(),
                          c = jQuery.Event("YTPQualityChange");
                        (c.quality = b), jQuery(YTPlayer).trigger(c);
                      },
                      onError: function (a) {
                        150 == a.data &&
                          (console.log(
                            "Embedding this video is restricted by Youtube."
                          ),
                          YTPlayer.isPlayList && jQuery(YTPlayer).playNext()),
                          2 == a.data &&
                            YTPlayer.isPlayList &&
                            jQuery(YTPlayer).playNext(),
                          "function" == typeof YTPlayer.opt.onError &&
                            YTPlayer.opt.onError($YTPlayer, a);
                      },
                    },
                  });
                }
              }));
          }),
            $YTPlayer.off("YTPTime.mask"),
            jQuery.mbYTPlayer.applyMask(YTPlayer);
        }
      });
    },
    getDataFromAPI: function (a) {
      if (
        ((a.videoData = jQuery.mbStorage.get("YTPlayer_data_" + a.videoID)),
        jQuery(a)
          .off("YTPData.YTPlayer")
          .on("YTPData.YTPlayer", function () {
            if (a.hasData && a.isPlayer && !a.opt.autoPlay) {
              var b =
                a.videoData.thumb_max ||
                a.videoData.thumb_high ||
                a.videoData.thumb_medium;
              a.opt.containment.css({
                background: "rgba(0,0,0,0.5) url(" + b + ") center center",
                backgroundSize: "cover",
              }),
                (a.opt.backgroundUrl = b);
            }
          }),
        a.videoData)
      )
        setTimeout(function () {
          (a.opt.ratio = "auto" == a.opt.ratio ? "16/9" : a.opt.ratio),
            (a.dataReceived = !0),
            jQuery(a).trigger("YTPChanged");
          var b = jQuery.Event("YTPData");
          b.prop = {};
          for (var c in a.videoData) b.prop[c] = a.videoData[c];
          jQuery(a).trigger(b);
        }, a.opt.fadeOnStartTime),
          (a.hasData = !0);
      else if (jQuery.mbYTPlayer.apiKey)
        jQuery.getJSON(
          jQuery.mbYTPlayer.locationProtocol +
            "//www.googleapis.com/youtube/v3/videos?id=" +
            a.videoID +
            "&key=" +
            jQuery.mbYTPlayer.apiKey +
            "&part=snippet",
          function (b) {
            function c(b) {
              (a.videoData = {}),
                (a.videoData.id = a.videoID),
                (a.videoData.channelTitle = b.channelTitle),
                (a.videoData.title = b.title),
                (a.videoData.description =
                  b.description.length < 400
                    ? b.description
                    : b.description.substring(0, 400) + " ..."),
                (a.videoData.aspectratio =
                  "auto" == a.opt.ratio ? "16/9" : a.opt.ratio),
                (a.opt.ratio = a.videoData.aspectratio),
                (a.videoData.thumb_max = b.thumbnails.maxres
                  ? b.thumbnails.maxres.url
                  : null),
                (a.videoData.thumb_high = b.thumbnails.high
                  ? b.thumbnails.high.url
                  : null),
                (a.videoData.thumb_medium = b.thumbnails.medium
                  ? b.thumbnails.medium.url
                  : null),
                jQuery.mbStorage.set("YTPlayer_data_" + a.videoID, a.videoData);
            }
            (a.dataReceived = !0),
              jQuery(a).trigger("YTPChanged"),
              c(b.items[0].snippet),
              (a.hasData = !0);
            var d = jQuery.Event("YTPData");
            d.prop = {};
            for (var e in a.videoData) d.prop[e] = a.videoData[e];
            jQuery(a).trigger(d);
          }
        );
      else {
        if (
          (setTimeout(function () {
            jQuery(a).trigger("YTPChanged");
          }, 50),
          a.isPlayer && !a.opt.autoPlay)
        ) {
          var b =
            jQuery.mbYTPlayer.locationProtocol +
            "//i.ytimg.com/vi/" +
            a.videoID +
            "/hqdefault.jpg";
          b &&
            a.opt.containment.css({
              background: "rgba(0,0,0,0.5) url(" + b + ") center center",
              backgroundSize: "cover",
            }),
            (a.opt.backgroundUrl = b);
        }
        (a.videoData = null),
          (a.opt.ratio = "auto" == a.opt.ratio ? "16/9" : a.opt.ratio);
      }
      !a.isPlayer ||
        a.opt.autoPlay ||
        jQuery.mbBrowser.mobile ||
        ((a.loading = jQuery("<div/>")
          .addClass("loading")
          .html("Loading")
          .hide()),
        jQuery(a).append(a.loading),
        a.loading.fadeIn());
    },
    removeStoredData: function () {
      jQuery.mbStorage.remove();
    },
    getVideoData: function () {
      var a = this.get(0);
      return a.videoData;
    },
    getVideoID: function () {
      var a = this.get(0);
      return a.videoID || !1;
    },
    setVideoQuality: function (a) {
      var b = this.get(0);
      b.player.setPlaybackQuality(a);
    },
    playlist: function (a, b, c) {
      var d = this,
        e = d.get(0);
      return (
        (e.isPlayList = !0),
        b && (a = jQuery.shuffle(a)),
        e.videoID ||
          ((e.videos = a),
          (e.videoCounter = 0),
          (e.videoLength = a.length),
          jQuery(e).data("property", a[0]),
          jQuery(e).mb_YTPlayer()),
        "function" == typeof c &&
          jQuery(e).one("YTPChanged", function () {
            c(e);
          }),
        jQuery(e).on("YTPEnd", function () {
          jQuery(e).playNext();
        }),
        this
      );
    },
    playNext: function () {
      var a = this.get(0);
      return (
        a.checkForStartAt &&
          (clearInterval(a.checkForStartAt), clearInterval(a.getState)),
        a.videoCounter++,
        a.videoCounter >= a.videoLength && (a.videoCounter = 0),
        jQuery(a).YTPChangeMovie(a.videos[a.videoCounter]),
        this
      );
    },
    playPrev: function () {
      var a = this.get(0);
      return (
        a.checkForStartAt &&
          (clearInterval(a.checkForStartAt), clearInterval(a.getState)),
        a.videoCounter--,
        a.videoCounter < 0 && (a.videoCounter = a.videoLength - 1),
        jQuery(a).YTPChangeMovie(a.videos[a.videoCounter]),
        this
      );
    },
    playIndex: function (a) {
      var b = this.get(0);
      return (
        (a -= 1),
        b.checkForStartAt &&
          (clearInterval(b.checkForStartAt), clearInterval(b.getState)),
        (b.videoCounter = a),
        b.videoCounter >= b.videoLength - 1 &&
          (b.videoCounter = b.videoLength - 1),
        jQuery(b).YTPChangeMovie(b.videos[b.videoCounter]),
        this
      );
    },
    changeMovie: function (a) {
      var b = this,
        c = b.get(0);
      (c.opt.startAt = 0),
        (c.opt.stopAt = 0),
        (c.opt.mask = !1),
        (c.opt.mute = !0),
        (c.hasData = !1),
        (c.hasChanged = !0),
        (c.player.loopTime = void 0),
        a && jQuery.extend(c.opt, a),
        (c.videoID = getYTPVideoID(c.opt.videoURL).videoID),
        "true" == c.opt.loop && (c.opt.loop = 9999),
        jQuery(c.playerEl).CSSAnimate(
          { opacity: 0 },
          c.opt.fadeOnStartTime,
          function () {
            var a = jQuery.Event("YTPChangeMovie");
            (a.time = c.currentTime),
              (a.videoId = c.videoID),
              jQuery(c).trigger(a),
              jQuery(c)
                .YTPGetPlayer()
                .cueVideoByUrl(
                  encodeURI(
                    jQuery.mbYTPlayer.locationProtocol +
                      "//www.youtube.com/v/" +
                      c.videoID
                  ),
                  1,
                  c.opt.quality
                ),
              jQuery(c).optimizeDisplay(),
              jQuery.mbYTPlayer.checkForState(c),
              jQuery.mbYTPlayer.getDataFromAPI(c);
          }
        ),
        jQuery.mbYTPlayer.applyMask(c);
    },
    getPlayer: function () {
      return jQuery(this).get(0).player;
    },
    playerDestroy: function () {
      var a = this.get(0);
      (ytp.YTAPIReady = !0),
        (ytp.backgroundIsInited = !1),
        (a.isInit = !1),
        (a.videoID = null),
        (a.isReady = !1);
      var b = a.wrapper;
      return (
        b.remove(),
        jQuery("#controlBar_" + a.id).remove(),
        clearInterval(a.checkForStartAt),
        clearInterval(a.getState),
        this
      );
    },
    fullscreen: function (real) {
      function hideMouse() {
        YTPlayer.overlay.css({ cursor: "none" });
      }
      function RunPrefixMethod(a, b) {
        for (
          var c, d, e = ["webkit", "moz", "ms", "o", ""], f = 0;
          f < e.length && !a[c];

        ) {
          if (
            ((c = b),
            "" == e[f] && (c = c.substr(0, 1).toLowerCase() + c.substr(1)),
            (c = e[f] + c),
            (d = typeof a[c]),
            "undefined" != d)
          )
            return (e = [e[f]]), "function" == d ? a[c]() : a[c];
          f++;
        }
      }
      function launchFullscreen(a) {
        RunPrefixMethod(a, "RequestFullScreen");
      }
      function cancelFullscreen() {
        (RunPrefixMethod(document, "FullScreen") ||
          RunPrefixMethod(document, "IsFullScreen")) &&
          RunPrefixMethod(document, "CancelFullScreen");
      }
      var YTPlayer = this.get(0);
      "undefined" == typeof real && (real = YTPlayer.opt.realfullscreen),
        (real = eval(real));
      var controls = jQuery("#controlBar_" + YTPlayer.id),
        fullScreenBtn = controls.find(".mb_OnlyYT"),
        videoWrapper = YTPlayer.isSelf
          ? YTPlayer.opt.containment
          : YTPlayer.wrapper;
      if (real) {
        var fullscreenchange = jQuery.mbBrowser.mozilla
          ? "mozfullscreenchange"
          : jQuery.mbBrowser.webkit
          ? "webkitfullscreenchange"
          : "fullscreenchange";
        jQuery(document)
          .off(fullscreenchange)
          .on(fullscreenchange, function () {
            var a =
              RunPrefixMethod(document, "IsFullScreen") ||
              RunPrefixMethod(document, "FullScreen");
            a
              ? (jQuery(YTPlayer).YTPSetVideoQuality("default"),
                jQuery(YTPlayer).trigger("YTPFullScreenStart"))
              : ((YTPlayer.isAlone = !1),
                fullScreenBtn.html(jQuery.mbYTPlayer.controls.onlyYT),
                jQuery(YTPlayer).YTPSetVideoQuality(YTPlayer.opt.quality),
                videoWrapper.removeClass("YTPFullscreen"),
                videoWrapper.CSSAnimate(
                  { opacity: YTPlayer.opt.opacity },
                  YTPlayer.opt.fadeOnStartTime
                ),
                videoWrapper.css({ zIndex: 0 }),
                YTPlayer.isBackground
                  ? jQuery("body").after(controls)
                  : YTPlayer.wrapper.before(controls),
                jQuery(window).resize(),
                jQuery(YTPlayer).trigger("YTPFullScreenEnd"));
          });
      }
      return (
        YTPlayer.isAlone
          ? (jQuery(document).off("mousemove.YTPlayer"),
            clearTimeout(YTPlayer.hideCursor),
            YTPlayer.overlay.css({ cursor: "auto" }),
            real
              ? cancelFullscreen()
              : (videoWrapper.CSSAnimate(
                  { opacity: YTPlayer.opt.opacity },
                  YTPlayer.opt.fadeOnStartTime
                ),
                videoWrapper.css({ zIndex: 0 })),
            fullScreenBtn.html(jQuery.mbYTPlayer.controls.onlyYT),
            (YTPlayer.isAlone = !1))
          : (jQuery(document).on("mousemove.YTPlayer", function (a) {
              YTPlayer.overlay.css({ cursor: "auto" }),
                clearTimeout(YTPlayer.hideCursor),
                jQuery(a.target).parents().is(".mb_YTPBar") ||
                  (YTPlayer.hideCursor = setTimeout(hideMouse, 3e3));
            }),
            hideMouse(),
            real
              ? (videoWrapper.css({ opacity: 0 }),
                videoWrapper.addClass("YTPFullscreen"),
                launchFullscreen(videoWrapper.get(0)),
                setTimeout(function () {
                  videoWrapper.CSSAnimate(
                    { opacity: 1 },
                    2 * YTPlayer.opt.fadeOnStartTime
                  ),
                    YTPlayer.wrapper.append(controls),
                    jQuery(YTPlayer).optimizeDisplay(),
                    YTPlayer.player.seekTo(
                      YTPlayer.player.getCurrentTime() + 0.1,
                      !0
                    );
                }, YTPlayer.opt.fadeOnStartTime))
              : videoWrapper
                  .css({ zIndex: 1e4 })
                  .CSSAnimate({ opacity: 1 }, 2 * YTPlayer.opt.fadeOnStartTime),
            fullScreenBtn.html(jQuery.mbYTPlayer.controls.showSite),
            (YTPlayer.isAlone = !0)),
        this
      );
    },
    toggleLoops: function () {
      var a = this.get(0),
        b = a.opt;
      return (
        1 == b.loop
          ? (b.loop = 0)
          : (b.startAt ? a.player.seekTo(b.startAt) : a.player.playVideo(),
            (b.loop = 1)),
        this
      );
    },
    play: function () {
      var a = this.get(0);
      if (!a.isReady) return this;
      a.player.playVideo(),
        a.wrapper.CSSAnimate(
          { opacity: a.isAlone ? 1 : a.opt.opacity },
          4 * a.opt.fadeOnStartTime
        ),
        jQuery(a.playerEl).CSSAnimate(
          { opacity: 1 },
          2 * a.opt.fadeOnStartTime
        );
      var b = jQuery("#controlBar_" + a.id),
        c = b.find(".mb_YTPPlaypause");
      return (
        c.html(jQuery.mbYTPlayer.controls.pause),
        (a.state = 1),
        (a.orig_background = jQuery(a).css("background-image")),
        this
      );
    },
    togglePlay: function (a) {
      var b = this.get(0);
      return (
        1 == b.state ? this.YTPPause() : this.YTPPlay(),
        "function" == typeof a && a(b.state),
        this
      );
    },
    stop: function () {
      var a = this.get(0),
        b = jQuery("#controlBar_" + a.id),
        c = b.find(".mb_YTPPlaypause");
      return (
        c.html(jQuery.mbYTPlayer.controls.play), a.player.stopVideo(), this
      );
    },
    pause: function () {
      var a = this.get(0);
      return a.player.pauseVideo(), (a.state = 2), this;
    },
    seekTo: function (a) {
      var b = this.get(0);
      return b.player.seekTo(a, !0), this;
    },
    setVolume: function (a) {
      var b = this.get(0);
      return (
        a || b.opt.vol || 0 != b.player.getVolume()
          ? (!a && b.player.getVolume() > 0) || (a && b.opt.vol == a)
            ? b.isMute
              ? jQuery(b).YTPUnmute()
              : jQuery(b).YTPMute()
            : ((b.opt.vol = a),
              b.player.setVolume(b.opt.vol),
              b.volumeBar &&
                b.volumeBar.length &&
                b.volumeBar.updateSliderVal(a))
          : jQuery(b).YTPUnmute(),
        this
      );
    },
    toggleVolume: function () {
      var a = this.get(0);
      if (a)
        return a.player.isMuted()
          ? (jQuery(a).YTPUnmute(), !0)
          : (jQuery(a).YTPMute(), !1);
    },
    mute: function () {
      var a = this.get(0);
      if (!a.isMute) {
        a.player.mute(),
          (a.isMute = !0),
          a.player.setVolume(0),
          a.volumeBar &&
            a.volumeBar.length &&
            a.volumeBar.width() > 10 &&
            a.volumeBar.updateSliderVal(0);
        var b = jQuery("#controlBar_" + a.id),
          c = b.find(".mb_YTPMuteUnmute");
        c.html(jQuery.mbYTPlayer.controls.unmute),
          jQuery(a).addClass("isMuted"),
          a.volumeBar && a.volumeBar.length && a.volumeBar.addClass("muted");
        var d = jQuery.Event("YTPMuted");
        return (
          (d.time = a.currentTime), a.canTrigger && jQuery(a).trigger(d), this
        );
      }
    },
    unmute: function () {
      var a = this.get(0);
      if (a.isMute) {
        a.player.unMute(),
          (a.isMute = !1),
          a.player.setVolume(a.opt.vol),
          a.volumeBar &&
            a.volumeBar.length &&
            a.volumeBar.updateSliderVal(a.opt.vol > 10 ? a.opt.vol : 10);
        var b = jQuery("#controlBar_" + a.id),
          c = b.find(".mb_YTPMuteUnmute");
        c.html(jQuery.mbYTPlayer.controls.mute),
          jQuery(a).removeClass("isMuted"),
          a.volumeBar && a.volumeBar.length && a.volumeBar.removeClass("muted");
        var d = jQuery.Event("YTPUnmuted");
        return (
          (d.time = a.currentTime), a.canTrigger && jQuery(a).trigger(d), this
        );
      }
    },
    applyFilter: function (a, b) {
      return this.each(function () {
        var c = this;
        (c.filters[a].value = b),
          c.filtersEnabled && jQuery(c).YTPEnableFilters();
      });
    },
    applyFilters: function (a) {
      return this.each(function () {
        var b = this;
        if (!b.isReady)
          return void jQuery(b).on("YTPReady", function () {
            jQuery(b).YTPApplyFilters(a);
          });
        for (var c in a) jQuery(b).YTPApplyFilter(c, a[c]);
        jQuery(b).trigger("YTPFiltersApplied");
      });
    },
    toggleFilter: function (a, b) {
      return this.each(function () {
        var c = this;
        c.filters[a].value
          ? (c.filters[a].value = 0)
          : (c.filters[a].value = b),
          c.filtersEnabled && jQuery(this).YTPEnableFilters();
      });
    },
    toggleFilters: function (a) {
      return this.each(function () {
        var b = this;
        b.filtersEnabled
          ? (jQuery(b).trigger("YTPDisableFilters"),
            jQuery(b).YTPDisableFilters())
          : (jQuery(b).YTPEnableFilters(),
            jQuery(b).trigger("YTPEnableFilters")),
          "function" == typeof a && a(b.filtersEnabled);
      });
    },
    disableFilters: function () {
      return this.each(function () {
        var a = this,
          b = jQuery(a.playerEl);
        b.css("-webkit-filter", ""),
          b.css("filter", ""),
          (a.filtersEnabled = !1);
      });
    },
    enableFilters: function () {
      return this.each(function () {
        var a = this,
          b = jQuery(a.playerEl),
          c = "";
        for (var d in a.filters)
          a.filters[d].value &&
            (c +=
              d.replace("_", "-") +
              "(" +
              a.filters[d].value +
              a.filters[d].unit +
              ") ");
        b.css("-webkit-filter", c), b.css("filter", c), (a.filtersEnabled = !0);
      });
    },
    removeFilter: function (a, b) {
      return this.each(function () {
        var c = this;
        if (("function" == typeof a && ((b = a), (a = null)), a))
          jQuery(this).YTPApplyFilter(a, 0), "function" == typeof b && b(a);
        else
          for (var d in c.filters)
            jQuery(this).YTPApplyFilter(d, 0), "function" == typeof b && b(d);
      });
    },
    getFilters: function () {
      var a = this.get(0);
      return a.filters;
    },
    addMask: function (a) {
      var b = this.get(0),
        c = b.overlay;
      a || (a = b.actualMask);
      var d = jQuery("<img/>")
        .attr("src", a)
        .on("load", function () {
          c.CSSAnimate({ opacity: 0 }, b.opt.fadeOnStartTime, function () {
            (b.hasMask = !0),
              d.remove(),
              c.css({
                backgroundImage: "url(" + a + ")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundSize: "cover",
              }),
              c.CSSAnimate({ opacity: 1 }, b.opt.fadeOnStartTime);
          });
        });
      return this;
    },
    removeMask: function () {
      var a = this.get(0),
        b = a.overlay;
      return (
        b.CSSAnimate({ opacity: 0 }, a.opt.fadeOnStartTime, function () {
          (a.hasMask = !1),
            b.css({
              backgroundImage: "",
              backgroundRepeat: "",
              backgroundPosition: "",
              backgroundSize: "",
            }),
            b.CSSAnimate({ opacity: 1 }, a.opt.fadeOnStartTime);
        }),
        this
      );
    },
    applyMask: function (a) {
      var b = jQuery(a);
      if ((b.off("YTPTime.mask"), a.opt.mask))
        if ("string" == typeof a.opt.mask)
          b.YTPAddMask(a.opt.mask), (a.actualMask = a.opt.mask);
        else if ("object" == typeof a.opt.mask) {
          for (var c in a.opt.mask)
            if (a.opt.mask[c]) {
              jQuery("<img/>").attr("src", a.opt.mask[c]);
            }
          a.opt.mask[0] && b.YTPAddMask(a.opt.mask[0]),
            b.on("YTPTime.mask", function (c) {
              for (var d in a.opt.mask)
                c.time == d &&
                  (a.opt.mask[d]
                    ? (b.YTPAddMask(a.opt.mask[d]),
                      (a.actualMask = a.opt.mask[d]))
                    : b.YTPRemoveMask());
            });
        }
    },
    toggleMask: function () {
      var a = this.get(0),
        b = $(a);
      return a.hasMask ? b.YTPRemoveMask() : b.YTPAddMask(), this;
    },
    manageProgress: function () {
      var a = this.get(0),
        b = jQuery("#controlBar_" + a.id),
        c = b.find(".mb_YTPProgress"),
        d = b.find(".mb_YTPLoaded"),
        e = b.find(".mb_YTPseekbar"),
        f = c.outerWidth(),
        g = Math.floor(a.player.getCurrentTime()),
        h = Math.floor(a.player.getDuration()),
        i = (g * f) / h,
        j = 0,
        k = 100 * a.player.getVideoLoadedFraction();
      return (
        d.css({ left: j, width: k + "%" }),
        e.css({ left: 0, width: i }),
        { totalTime: h, currentTime: g }
      );
    },
    buildControls: function (YTPlayer) {
      var data = YTPlayer.opt;
      if (
        ((data.showYTLogo = data.showYTLogo || data.printUrl),
        !jQuery("#controlBar_" + YTPlayer.id).length)
      ) {
        YTPlayer.controlBar = jQuery("<span/>")
          .attr("id", "controlBar_" + YTPlayer.id)
          .addClass("mb_YTPBar")
          .css({
            whiteSpace: "noWrap",
            position: YTPlayer.isBackground ? "fixed" : "absolute",
            zIndex: YTPlayer.isBackground ? 1e4 : 1e3,
          })
          .hide();
        var buttonBar = jQuery("<div/>").addClass("buttonBar"),
          playpause = jQuery(
            "<span>" + jQuery.mbYTPlayer.controls.play + "</span>"
          )
            .addClass("mb_YTPPlaypause ytpicon")
            .click(function () {
              1 == YTPlayer.player.getPlayerState()
                ? jQuery(YTPlayer).YTPPause()
                : jQuery(YTPlayer).YTPPlay();
            }),
          MuteUnmute = jQuery(
            "<span>" + jQuery.mbYTPlayer.controls.mute + "</span>"
          )
            .addClass("mb_YTPMuteUnmute ytpicon")
            .click(function () {
              0 == YTPlayer.player.getVolume()
                ? jQuery(YTPlayer).YTPUnmute()
                : jQuery(YTPlayer).YTPMute();
            }),
          volumeBar = jQuery("<div/>")
            .addClass("mb_YTPVolumeBar")
            .css({ display: "inline-block" });
        YTPlayer.volumeBar = volumeBar;
        var idx = jQuery("<span/>").addClass("mb_YTPTime"),
          vURL = data.videoURL ? data.videoURL : "";
        vURL.indexOf("http") < 0 &&
          (vURL =
            jQuery.mbYTPlayer.locationProtocol +
            "//www.youtube.com/watch?v=" +
            data.videoURL);
        var movieUrl = jQuery("<span/>")
            .html(jQuery.mbYTPlayer.controls.ytLogo)
            .addClass("mb_YTPUrl ytpicon")
            .attr("title", "view on YouTube")
            .on("click", function () {
              window.open(vURL, "viewOnYT");
            }),
          onlyVideo = jQuery("<span/>")
            .html(jQuery.mbYTPlayer.controls.onlyYT)
            .addClass("mb_OnlyYT ytpicon")
            .on("click", function () {
              jQuery(YTPlayer).YTPFullscreen(data.realfullscreen);
            }),
          progressBar = jQuery("<div/>")
            .addClass("mb_YTPProgress")
            .css("position", "absolute")
            .click(function (a) {
              timeBar.css({ width: a.clientX - timeBar.offset().left }),
                (YTPlayer.timeW = a.clientX - timeBar.offset().left),
                YTPlayer.controlBar.find(".mb_YTPLoaded").css({ width: 0 });
              var b = Math.floor(YTPlayer.player.getDuration());
              (YTPlayer["goto"] =
                (timeBar.outerWidth() * b) / progressBar.outerWidth()),
                YTPlayer.player.seekTo(parseFloat(YTPlayer["goto"]), !0),
                YTPlayer.controlBar.find(".mb_YTPLoaded").css({ width: 0 });
            }),
          loadedBar = jQuery("<div/>")
            .addClass("mb_YTPLoaded")
            .css("position", "absolute"),
          timeBar = jQuery("<div/>")
            .addClass("mb_YTPseekbar")
            .css("position", "absolute");
        progressBar.append(loadedBar).append(timeBar),
          buttonBar
            .append(playpause)
            .append(MuteUnmute)
            .append(volumeBar)
            .append(idx),
          data.showYTLogo && buttonBar.append(movieUrl),
          (YTPlayer.isBackground ||
            (eval(YTPlayer.opt.realfullscreen) && !YTPlayer.isBackground)) &&
            buttonBar.append(onlyVideo),
          YTPlayer.controlBar.append(buttonBar).append(progressBar),
          YTPlayer.isBackground
            ? jQuery("body").after(YTPlayer.controlBar)
            : (YTPlayer.controlBar.addClass("inlinePlayer"),
              YTPlayer.wrapper.before(YTPlayer.controlBar)),
          volumeBar.simpleSlider({
            initialval: YTPlayer.opt.vol,
            scale: 100,
            orientation: "h",
            callback: function (a) {
              0 == a.value
                ? jQuery(YTPlayer).YTPMute()
                : jQuery(YTPlayer).YTPUnmute(),
                YTPlayer.player.setVolume(a.value),
                YTPlayer.isMute || (YTPlayer.opt.vol = a.value);
            },
          });
      }
    },
    checkForState: function (YTPlayer) {
      var interval = YTPlayer.opt.showControls ? 100 : 400;
      return (
        clearInterval(YTPlayer.getState),
        jQuery.contains(document, YTPlayer)
          ? (jQuery.mbYTPlayer.checkForStart(YTPlayer),
            void (YTPlayer.getState = setInterval(function () {
              var prog = jQuery(YTPlayer).YTPManageProgress(),
                $YTPlayer = jQuery(YTPlayer),
                data = YTPlayer.opt,
                startAt = YTPlayer.opt.startAt
                  ? YTPlayer.start_from_last
                    ? YTPlayer.start_from_last
                    : YTPlayer.opt.startAt
                  : 1;
              YTPlayer.start_from_last = null;
              var stopAt =
                YTPlayer.opt.stopAt > YTPlayer.opt.startAt
                  ? YTPlayer.opt.stopAt
                  : 0;
              if (
                ((stopAt = stopAt < YTPlayer.player.getDuration() ? stopAt : 0),
                YTPlayer.currentTime != prog.currentTime)
              ) {
                var YTPEvent = jQuery.Event("YTPTime");
                (YTPEvent.time = YTPlayer.currentTime),
                  jQuery(YTPlayer).trigger(YTPEvent);
              }
              if (
                ((YTPlayer.currentTime = prog.currentTime),
                (YTPlayer.totalTime = YTPlayer.player.getDuration()),
                0 == YTPlayer.player.getVolume()
                  ? $YTPlayer.addClass("isMuted")
                  : $YTPlayer.removeClass("isMuted"),
                YTPlayer.opt.showControls &&
                  (prog.totalTime
                    ? YTPlayer.controlBar
                        .find(".mb_YTPTime")
                        .html(
                          jQuery.mbYTPlayer.formatTime(prog.currentTime) +
                            " / " +
                            jQuery.mbYTPlayer.formatTime(prog.totalTime)
                        )
                    : YTPlayer.controlBar
                        .find(".mb_YTPTime")
                        .html("-- : -- / -- : --")),
                eval(YTPlayer.opt.stopMovieOnBlur) &&
                  (document.hasFocus()
                    ? document.hasFocus() &&
                      !YTPlayer.hasFocus &&
                      -1 != YTPlayer.state &&
                      0 != YTPlayer.state &&
                      ((YTPlayer.hasFocus = !0), $YTPlayer.YTPPlay())
                    : 1 == YTPlayer.state &&
                      ((YTPlayer.hasFocus = !1), $YTPlayer.YTPPause())),
                YTPlayer.controlBar.length &&
                YTPlayer.controlBar.outerWidth() <= 400 &&
                !YTPlayer.isCompact
                  ? (YTPlayer.controlBar.addClass("compact"),
                    (YTPlayer.isCompact = !0),
                    !YTPlayer.isMute &&
                      YTPlayer.volumeBar &&
                      YTPlayer.volumeBar.updateSliderVal(YTPlayer.opt.vol))
                  : YTPlayer.controlBar.length &&
                    YTPlayer.controlBar.outerWidth() > 400 &&
                    YTPlayer.isCompact &&
                    (YTPlayer.controlBar.removeClass("compact"),
                    (YTPlayer.isCompact = !1),
                    !YTPlayer.isMute &&
                      YTPlayer.volumeBar &&
                      YTPlayer.volumeBar.updateSliderVal(YTPlayer.opt.vol)),
                1 == YTPlayer.player.getPlayerState() &&
                  (parseFloat(YTPlayer.player.getDuration() - 0.5) <
                    YTPlayer.player.getCurrentTime() ||
                    (stopAt > 0 &&
                      parseFloat(YTPlayer.player.getCurrentTime()) > stopAt)))
              ) {
                if (YTPlayer.isEnded) return;
                if (
                  ((YTPlayer.isEnded = !0),
                  setTimeout(function () {
                    YTPlayer.isEnded = !1;
                  }, 1e3),
                  YTPlayer.isPlayList)
                ) {
                  if (
                    !data.loop ||
                    (data.loop > 0 &&
                      YTPlayer.player.loopTime === data.loop - 1)
                  ) {
                    (YTPlayer.player.loopTime = void 0),
                      clearInterval(YTPlayer.getState);
                    var YTPEnd = jQuery.Event("YTPEnd");
                    return (
                      (YTPEnd.time = YTPlayer.currentTime),
                      void jQuery(YTPlayer).trigger(YTPEnd)
                    );
                  }
                } else if (
                  !data.loop ||
                  (data.loop > 0 && YTPlayer.player.loopTime === data.loop - 1)
                )
                  return (
                    (YTPlayer.player.loopTime = void 0),
                    (YTPlayer.preventTrigger = !0),
                    (YTPlayer.state = 2),
                    jQuery(YTPlayer).YTPPause(),
                    void YTPlayer.wrapper.CSSAnimate(
                      { opacity: 0 },
                      YTPlayer.opt.fadeOnStartTime,
                      function () {
                        YTPlayer.controlBar.length &&
                          YTPlayer.controlBar
                            .find(".mb_YTPPlaypause")
                            .html(jQuery.mbYTPlayer.controls.play);
                        var a = jQuery.Event("YTPEnd");
                        (a.time = YTPlayer.currentTime),
                          jQuery(YTPlayer).trigger(a),
                          YTPlayer.player.seekTo(startAt, !0),
                          YTPlayer.isBackground
                            ? YTPlayer.orig_background &&
                              jQuery(YTPlayer).css(
                                "background-image",
                                YTPlayer.orig_background
                              )
                            : YTPlayer.opt.backgroundUrl &&
                              YTPlayer.isPlayer &&
                              ((YTPlayer.opt.backgroundUrl =
                                YTPlayer.opt.backgroundUrl ||
                                YTPlayer.orig_background),
                              YTPlayer.opt.containment.css({
                                background:
                                  "url(" +
                                  YTPlayer.opt.backgroundUrl +
                                  ") center center",
                                backgroundSize: "cover",
                              }));
                      }
                    )
                  );
                (YTPlayer.player.loopTime = YTPlayer.player.loopTime
                  ? ++YTPlayer.player.loopTime
                  : 1),
                  (startAt = startAt || 1),
                  (YTPlayer.preventTrigger = !0),
                  (YTPlayer.state = 2),
                  jQuery(YTPlayer).YTPPause(),
                  YTPlayer.player.seekTo(startAt, !0),
                  $YTPlayer.YTPPlay();
              }
            }, interval)))
          : (jQuery(YTPlayer).YTPPlayerDestroy(),
            clearInterval(YTPlayer.getState),
            void clearInterval(YTPlayer.checkForStartAt))
      );
    },
    getTime: function () {
      var a = this.get(0);
      return jQuery.mbYTPlayer.formatTime(a.currentTime);
    },
    getTotalTime: function () {
      var a = this.get(0);
      return jQuery.mbYTPlayer.formatTime(a.totalTime);
    },
    checkForStart: function (a) {
      var b = jQuery(a);
      if (!jQuery.contains(document, a))
        return void jQuery(a).YTPPlayerDestroy();
      if (
        ((a.preventTrigger = !0),
        (a.state = 2),
        jQuery(a).YTPPause(),
        jQuery(a).muteYTPVolume(),
        jQuery("#controlBar_" + a.id).remove(),
        (a.controlBar = !1),
        a.opt.showControls && jQuery.mbYTPlayer.buildControls(a),
        a.opt.addRaster)
      ) {
        var c = "dot" == a.opt.addRaster ? "raster-dot" : "raster";
        a.overlay.addClass(a.isRetina ? c + " retina" : c);
      } else
        a.overlay.removeClass(function (a, b) {
          var c = b.split(" "),
            d = [];
          return (
            jQuery.each(c, function (a, b) {
              /raster.*/.test(b) && d.push(b);
            }),
            d.push("retina"),
            d.join(" ")
          );
        });
      var d = a.opt.startAt
        ? a.start_from_last
          ? a.start_from_last
          : a.opt.startAt
        : 1;
      (a.start_from_last = null),
        a.player.playVideo(),
        a.player.seekTo(d, !0),
        clearInterval(a.checkForStartAt),
        (a.checkForStartAt = setInterval(function () {
          jQuery(a).YTPMute();
          var c =
            a.player.getVideoLoadedFraction() >= d / a.player.getDuration();
          if (
            a.player.getDuration() > 0 &&
            a.player.getCurrentTime() >= d &&
            c
          ) {
            clearInterval(a.checkForStartAt),
              "function" == typeof a.opt.onReady && a.opt.onReady(a),
              (a.isReady = !0);
            var e = jQuery.Event("YTPReady");
            if (
              ((e.time = a.currentTime),
              jQuery(a).trigger(e),
              (a.preventTrigger = !0),
              (a.state = 2),
              jQuery(a).YTPPause(),
              a.opt.mute || jQuery(a).YTPUnmute(),
              (a.canTrigger = !0),
              a.opt.autoPlay)
            ) {
              var f = jQuery.Event("YTPStart");
              (f.time = a.currentTime),
                jQuery(a).trigger(f),
                jQuery(a.playerEl).CSSAnimate({ opacity: 1 }, 1e3),
                b.YTPPlay(),
                a.wrapper.CSSAnimate(
                  { opacity: a.isAlone ? 1 : a.opt.opacity },
                  2 * a.opt.fadeOnStartTime
                ),
                "mac" == jQuery.mbBrowser.os.name &&
                  jQuery.mbBrowser.safari &&
                  jQuery.mbBrowser.versionCompare(
                    jQuery.mbBrowser.fullVersion,
                    "10.1"
                  ) < 0 &&
                  (a.safariPlay = setInterval(function () {
                    1 != a.state ? b.YTPPlay() : clearInterval(a.safariPlay);
                  }, 10)),
                b.one("YTPReady", function () {
                  b.YTPPlay();
                });
            } else
              a.player.pauseVideo(),
                a.isPlayer ||
                  (jQuery(a.playerEl).CSSAnimate(
                    { opacity: 1 },
                    a.opt.fadeOnStartTime
                  ),
                  a.wrapper.CSSAnimate(
                    { opacity: a.isAlone ? 1 : a.opt.opacity },
                    a.opt.fadeOnStartTime
                  )),
                a.controlBar.length &&
                  a.controlBar
                    .find(".mb_YTPPlaypause")
                    .html(jQuery.mbYTPlayer.controls.play);
            a.isPlayer &&
              !a.opt.autoPlay &&
              a.loading &&
              a.loading.length &&
              (a.loading.html("Ready"),
              setTimeout(function () {
                a.loading.fadeOut();
              }, 100)),
              a.controlBar &&
                a.controlBar.length &&
                a.controlBar.slideDown(1e3);
          } else "mac" == jQuery.mbBrowser.os.name && jQuery.mbBrowser.safari && jQuery.mbBrowser.fullVersion && jQuery.mbBrowser.versionCompare(jQuery.mbBrowser.fullVersion, "10.1") < 0 && (a.player.playVideo(), d >= 0 && a.player.seekTo(d, !0));
        }, 10));
    },
    setAnchor: function (a) {
      var b = this;
      b.optimizeDisplay(a);
    },
    getAnchor: function () {
      var a = this.get(0);
      return a.opt.anchor;
    },
    formatTime: function (a) {
      var b = Math.floor(a / 60),
        c = Math.floor(a - 60 * b);
      return (9 >= b ? "0" + b : b) + " : " + (9 >= c ? "0" + c : c);
    },
  }),
    (jQuery.fn.optimizeDisplay = function (anchor) {
      var YTPlayer = this.get(0),
        playerBox = jQuery(YTPlayer.playerEl),
        vid = {};
      (YTPlayer.opt.anchor = anchor || YTPlayer.opt.anchor),
        (YTPlayer.opt.anchor =
          "undefined " != typeof YTPlayer.opt.anchor
            ? YTPlayer.opt.anchor
            : "center,center");
      var YTPAlign = YTPlayer.opt.anchor.split(",");
      if (YTPlayer.opt.optimizeDisplay) {
        var abundance = YTPlayer.isPlayer ? 0 : 80,
          win = {},
          el = YTPlayer.wrapper;
        (win.width = el.outerWidth()),
          (win.height = el.outerHeight() + abundance),
          (YTPlayer.opt.ratio = eval(YTPlayer.opt.ratio)),
          (vid.width = win.width),
          (vid.height = Math.ceil(vid.width / YTPlayer.opt.ratio)),
          (vid.marginTop = Math.ceil(-((vid.height - win.height) / 2))),
          (vid.marginLeft = 0);
        var lowest = vid.height < win.height;
        lowest &&
          ((vid.height = win.height),
          (vid.width = Math.ceil(vid.height * YTPlayer.opt.ratio)),
          (vid.marginTop = 0),
          (vid.marginLeft = Math.ceil(-((vid.width - win.width) / 2))));
        for (var a in YTPAlign)
          if (YTPAlign.hasOwnProperty(a)) {
            var al = YTPAlign[a].replace(/ /g, "");
            switch (al) {
              case "top":
                vid.marginTop = lowest ? -((vid.height - win.height) / 2) : 0;
                break;
              case "bottom":
                vid.marginTop = lowest ? 0 : -(vid.height - win.height);
                break;
              case "left":
                vid.marginLeft = 0;
                break;
              case "right":
                vid.marginLeft = lowest ? -(vid.width - win.width) : 0;
                break;
              default:
                vid.width > win.width &&
                  (vid.marginLeft = -((vid.width - win.width) / 2));
            }
          }
      } else
        (vid.width = "100%"),
          (vid.height = "100%"),
          (vid.marginTop = 0),
          (vid.marginLeft = 0);
      playerBox.css({
        width: vid.width,
        height: vid.height,
        marginTop: vid.marginTop,
        marginLeft: vid.marginLeft,
        maxWidth: "initial",
      });
    }),
    (jQuery.shuffle = function (a) {
      for (var b = a.slice(), c = b.length, d = c; d--; ) {
        var e = parseInt(Math.random() * c),
          f = b[d];
        (b[d] = b[e]), (b[e] = f);
      }
      return b;
    }),
    (jQuery.fn.unselectable = function () {
      return this.each(function () {
        jQuery(this)
          .css({
            "-moz-user-select": "none",
            "-webkit-user-select": "none",
            "user-select": "none",
          })
          .attr("unselectable", "on");
      });
    }),
    (jQuery.fn.YTPlayer = jQuery.mbYTPlayer.buildPlayer),
    (jQuery.fn.YTPGetPlayer = jQuery.mbYTPlayer.getPlayer),
    (jQuery.fn.YTPGetVideoID = jQuery.mbYTPlayer.getVideoID),
    (jQuery.fn.YTPChangeMovie = jQuery.mbYTPlayer.changeMovie),
    (jQuery.fn.YTPPlayerDestroy = jQuery.mbYTPlayer.playerDestroy),
    (jQuery.fn.YTPPlay = jQuery.mbYTPlayer.play),
    (jQuery.fn.YTPTogglePlay = jQuery.mbYTPlayer.togglePlay),
    (jQuery.fn.YTPStop = jQuery.mbYTPlayer.stop),
    (jQuery.fn.YTPPause = jQuery.mbYTPlayer.pause),
    (jQuery.fn.YTPSeekTo = jQuery.mbYTPlayer.seekTo),
    (jQuery.fn.YTPlaylist = jQuery.mbYTPlayer.playlist),
    (jQuery.fn.YTPPlayNext = jQuery.mbYTPlayer.playNext),
    (jQuery.fn.YTPPlayPrev = jQuery.mbYTPlayer.playPrev),
    (jQuery.fn.YTPPlayIndex = jQuery.mbYTPlayer.playIndex),
    (jQuery.fn.YTPMute = jQuery.mbYTPlayer.mute),
    (jQuery.fn.YTPUnmute = jQuery.mbYTPlayer.unmute),
    (jQuery.fn.YTPToggleVolume = jQuery.mbYTPlayer.toggleVolume),
    (jQuery.fn.YTPSetVolume = jQuery.mbYTPlayer.setVolume),
    (jQuery.fn.YTPGetVideoData = jQuery.mbYTPlayer.getVideoData),
    (jQuery.fn.YTPFullscreen = jQuery.mbYTPlayer.fullscreen),
    (jQuery.fn.YTPToggleLoops = jQuery.mbYTPlayer.toggleLoops),
    (jQuery.fn.YTPSetVideoQuality = jQuery.mbYTPlayer.setVideoQuality),
    (jQuery.fn.YTPManageProgress = jQuery.mbYTPlayer.manageProgress),
    (jQuery.fn.YTPApplyFilter = jQuery.mbYTPlayer.applyFilter),
    (jQuery.fn.YTPApplyFilters = jQuery.mbYTPlayer.applyFilters),
    (jQuery.fn.YTPToggleFilter = jQuery.mbYTPlayer.toggleFilter),
    (jQuery.fn.YTPToggleFilters = jQuery.mbYTPlayer.toggleFilters),
    (jQuery.fn.YTPRemoveFilter = jQuery.mbYTPlayer.removeFilter),
    (jQuery.fn.YTPDisableFilters = jQuery.mbYTPlayer.disableFilters),
    (jQuery.fn.YTPEnableFilters = jQuery.mbYTPlayer.enableFilters),
    (jQuery.fn.YTPGetFilters = jQuery.mbYTPlayer.getFilters),
    (jQuery.fn.YTPGetTime = jQuery.mbYTPlayer.getTime),
    (jQuery.fn.YTPGetTotalTime = jQuery.mbYTPlayer.getTotalTime),
    (jQuery.fn.YTPAddMask = jQuery.mbYTPlayer.addMask),
    (jQuery.fn.YTPRemoveMask = jQuery.mbYTPlayer.removeMask),
    (jQuery.fn.YTPToggleMask = jQuery.mbYTPlayer.toggleMask),
    (jQuery.fn.YTPSetAnchor = jQuery.mbYTPlayer.setAnchor),
    (jQuery.fn.YTPGetAnchor = jQuery.mbYTPlayer.getAnchor),
    (jQuery.fn.mb_YTPlayer = jQuery.mbYTPlayer.buildPlayer),
    (jQuery.fn.playNext = jQuery.mbYTPlayer.playNext),
    (jQuery.fn.playPrev = jQuery.mbYTPlayer.playPrev),
    (jQuery.fn.changeMovie = jQuery.mbYTPlayer.changeMovie),
    (jQuery.fn.getVideoID = jQuery.mbYTPlayer.getVideoID),
    (jQuery.fn.getPlayer = jQuery.mbYTPlayer.getPlayer),
    (jQuery.fn.playerDestroy = jQuery.mbYTPlayer.playerDestroy),
    (jQuery.fn.fullscreen = jQuery.mbYTPlayer.fullscreen),
    (jQuery.fn.buildYTPControls = jQuery.mbYTPlayer.buildControls),
    (jQuery.fn.playYTP = jQuery.mbYTPlayer.play),
    (jQuery.fn.toggleLoops = jQuery.mbYTPlayer.toggleLoops),
    (jQuery.fn.stopYTP = jQuery.mbYTPlayer.stop),
    (jQuery.fn.pauseYTP = jQuery.mbYTPlayer.pause),
    (jQuery.fn.seekToYTP = jQuery.mbYTPlayer.seekTo),
    (jQuery.fn.muteYTPVolume = jQuery.mbYTPlayer.mute),
    (jQuery.fn.unmuteYTPVolume = jQuery.mbYTPlayer.unmute),
    (jQuery.fn.setYTPVolume = jQuery.mbYTPlayer.setVolume),
    (jQuery.fn.setVideoQuality = jQuery.mbYTPlayer.setVideoQuality),
    (jQuery.fn.manageYTPProgress = jQuery.mbYTPlayer.manageProgress),
    (jQuery.fn.YTPGetDataFromFeed = jQuery.mbYTPlayer.getVideoData);
})(jQuery, ytp),
  (jQuery.support.CSStransition = (function () {
    var a = document.body || document.documentElement,
      b = a.style;
    return (
      void 0 !== b.transition ||
      void 0 !== b.WebkitTransition ||
      void 0 !== b.MozTransition ||
      void 0 !== b.MsTransition ||
      void 0 !== b.OTransition
    );
  })()),
  (jQuery.CSS = {
    name: "mb.CSSAnimate",
    author: "Matteo Bicocchi",
    version: "2.0.0",
    transitionEnd: "transitionEnd",
    sfx: "",
    filters: {
      blur: { min: 0, max: 100, unit: "px" },
      brightness: { min: 0, max: 400, unit: "%" },
      contrast: { min: 0, max: 400, unit: "%" },
      grayscale: { min: 0, max: 100, unit: "%" },
      hueRotate: { min: 0, max: 360, unit: "deg" },
      invert: { min: 0, max: 100, unit: "%" },
      saturate: { min: 0, max: 400, unit: "%" },
      sepia: { min: 0, max: 100, unit: "%" },
    },
    normalizeCss: function (a) {
      var b = jQuery.extend(!0, {}, a);
      jQuery.browser.webkit || jQuery.browser.opera
        ? (jQuery.CSS.sfx = "-webkit-")
        : jQuery.browser.mozilla
        ? (jQuery.CSS.sfx = "-moz-")
        : jQuery.browser.msie && (jQuery.CSS.sfx = "-ms-");
      for (var c in b) {
        "transform" === c &&
          ((b[jQuery.CSS.sfx + "transform"] = b[c]), delete b[c]),
          "transform-origin" === c &&
            ((b[jQuery.CSS.sfx + "transform-origin"] = a[c]), delete b[c]),
          "filter" !== c ||
            jQuery.browser.mozilla ||
            ((b[jQuery.CSS.sfx + "filter"] = a[c]), delete b[c]),
          "blur" === c && setFilter(b, "blur", a[c]),
          "brightness" === c && setFilter(b, "brightness", a[c]),
          "contrast" === c && setFilter(b, "contrast", a[c]),
          "grayscale" === c && setFilter(b, "grayscale", a[c]),
          "hueRotate" === c && setFilter(b, "hueRotate", a[c]),
          "invert" === c && setFilter(b, "invert", a[c]),
          "saturate" === c && setFilter(b, "saturate", a[c]),
          "sepia" === c && setFilter(b, "sepia", a[c]);
        var d = "";
        "x" === c &&
          ((d = jQuery.CSS.sfx + "transform"),
          (b[d] = b[d] || ""),
          (b[d] += " translateX(" + setUnit(a[c], "px") + ")"),
          delete b[c]),
          "y" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " translateY(" + setUnit(a[c], "px") + ")"),
            delete b[c]),
          "z" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " translateZ(" + setUnit(a[c], "px") + ")"),
            delete b[c]),
          "rotate" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " rotate(" + setUnit(a[c], "deg") + ")"),
            delete b[c]),
          "rotateX" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " rotateX(" + setUnit(a[c], "deg") + ")"),
            delete b[c]),
          "rotateY" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " rotateY(" + setUnit(a[c], "deg") + ")"),
            delete b[c]),
          "rotateZ" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " rotateZ(" + setUnit(a[c], "deg") + ")"),
            delete b[c]),
          "scale" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " scale(" + setUnit(a[c], "") + ")"),
            delete b[c]),
          "scaleX" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " scaleX(" + setUnit(a[c], "") + ")"),
            delete b[c]),
          "scaleY" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " scaleY(" + setUnit(a[c], "") + ")"),
            delete b[c]),
          "scaleZ" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " scaleZ(" + setUnit(a[c], "") + ")"),
            delete b[c]),
          "skew" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " skew(" + setUnit(a[c], "deg") + ")"),
            delete b[c]),
          "skewX" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " skewX(" + setUnit(a[c], "deg") + ")"),
            delete b[c]),
          "skewY" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " skewY(" + setUnit(a[c], "deg") + ")"),
            delete b[c]),
          "perspective" === c &&
            ((d = jQuery.CSS.sfx + "transform"),
            (b[d] = b[d] || ""),
            (b[d] += " perspective(" + setUnit(a[c], "px") + ")"),
            delete b[c]);
      }
      return b;
    },
    getProp: function (a) {
      var b = [];
      for (var c in a) b.indexOf(c) < 0 && b.push(uncamel(c));
      return b.join(",");
    },
    animate: function (a, b, c, d, e) {
      return this.each(function () {
        function f() {
          (g.called = !0),
            (g.CSSAIsRunning = !1),
            h.off(jQuery.CSS.transitionEnd + "." + g.id),
            clearTimeout(g.timeout),
            h.css(jQuery.CSS.sfx + "transition", ""),
            "function" == typeof e && e.apply(g),
            "function" == typeof g.CSSqueue &&
              (g.CSSqueue(), (g.CSSqueue = null));
        }
        var g = this,
          h = jQuery(this);
        g.id = g.id || "CSSA_" + new Date().getTime();
        var i = i || { type: "noEvent" };
        if (
          g.CSSAIsRunning &&
          g.eventType == i.type &&
          !jQuery.browser.msie &&
          jQuery.browser.version <= 9
        )
          return void (g.CSSqueue = function () {
            h.CSSAnimate(a, b, c, d, e);
          });
        if (
          ((g.CSSqueue = null), (g.eventType = i.type), 0 !== h.length && a)
        ) {
          if (
            ((a = jQuery.normalizeCss(a)),
            (g.CSSAIsRunning = !0),
            "function" == typeof b &&
              ((e = b), (b = jQuery.fx.speeds._default)),
            "function" == typeof c && ((d = c), (c = 0)),
            "string" == typeof c && ((e = c), (c = 0)),
            "function" == typeof d &&
              ((e = d), (d = "cubic-bezier(0.65,0.03,0.36,0.72)")),
            "string" == typeof b)
          )
            for (var j in jQuery.fx.speeds) {
              if (b == j) {
                b = jQuery.fx.speeds[j];
                break;
              }
              b = jQuery.fx.speeds._default;
            }
          if (
            (b || (b = jQuery.fx.speeds._default),
            "string" == typeof e && ((d = e), (e = null)),
            !jQuery.support.CSStransition)
          ) {
            for (var k in a) {
              if (
                ("transform" === k && delete a[k],
                "filter" === k && delete a[k],
                "transform-origin" === k && delete a[k],
                "auto" === a[k] && delete a[k],
                "x" === k)
              ) {
                var l = a[k],
                  m = "left";
                (a[m] = l), delete a[k];
              }
              if ("y" === k) {
                var l = a[k],
                  m = "top";
                (a[m] = l), delete a[k];
              }
              ("-ms-transform" === k || "-ms-filter" === k) && delete a[k];
            }
            return void h.delay(c).animate(a, b, e);
          }
          var n = {
            default: "ease",
            in: "ease-in",
            out: "ease-out",
            "in-out": "ease-in-out",
            snap: "cubic-bezier(0,1,.5,1)",
            easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
            easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
            easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
            easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
            easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
            easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
            easeOutExpo: "cubic-bezier(.19,1,.22,1)",
            easeInOutExpo: "cubic-bezier(1,0,0,1)",
            easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
            easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
            easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
            easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
            easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
            easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
            easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
            easeOutQuint: "cubic-bezier(.23,1,.32,1)",
            easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
            easeInSine: "cubic-bezier(.47,0,.745,.715)",
            easeOutSine: "cubic-bezier(.39,.575,.565,1)",
            easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
            easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
            easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
            easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)",
          };
          n[d] && (d = n[d]), h.off(jQuery.CSS.transitionEnd + "." + g.id);
          var o = jQuery.CSS.getProp(a),
            p = {};
          jQuery.extend(p, a),
            (p[jQuery.CSS.sfx + "transition-property"] = o),
            (p[jQuery.CSS.sfx + "transition-duration"] = b + "ms"),
            (p[jQuery.CSS.sfx + "transition-delay"] = c + "ms"),
            (p[jQuery.CSS.sfx + "transition-timing-function"] = d),
            setTimeout(function () {
              h.one(jQuery.CSS.transitionEnd + "." + g.id, f), h.css(p);
            }, 1),
            (g.timeout = setTimeout(function () {
              return g.called || !e
                ? ((g.called = !1), void (g.CSSAIsRunning = !1))
                : (h.css(jQuery.CSS.sfx + "transition", ""),
                  e.apply(g),
                  (g.CSSAIsRunning = !1),
                  void (
                    "function" == typeof g.CSSqueue &&
                    (g.CSSqueue(), (g.CSSqueue = null))
                  ));
            }, b + c + 10));
        }
      });
    },
  }),
  (jQuery.fn.CSSAnimate = jQuery.CSS.animate),
  (jQuery.normalizeCss = jQuery.CSS.normalizeCss),
  (jQuery.fn.css3 = function (a) {
    return this.each(function () {
      var b = jQuery(this),
        c = jQuery.normalizeCss(a);
      b.css(c);
    });
  });
var nAgt = navigator.userAgent;
(jQuery.browser = jQuery.browser || {}),
  (jQuery.browser.mozilla = !1),
  (jQuery.browser.webkit = !1),
  (jQuery.browser.opera = !1),
  (jQuery.browser.safari = !1),
  (jQuery.browser.chrome = !1),
  (jQuery.browser.androidStock = !1),
  (jQuery.browser.msie = !1),
  (jQuery.browser.edge = !1),
  (jQuery.browser.ua = nAgt);
var getOS = function () {
  var a = { version: "Unknown version", name: "Unknown OS" };
  return (
    -1 != navigator.appVersion.indexOf("Win") && (a.name = "Windows"),
    -1 != navigator.appVersion.indexOf("Mac") &&
      0 > navigator.appVersion.indexOf("Mobile") &&
      (a.name = "Mac"),
    -1 != navigator.appVersion.indexOf("Linux") && (a.name = "Linux"),
    /Mac OS X/.test(nAgt) &&
      !/Mobile/.test(nAgt) &&
      ((a.version = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1]),
      (a.version = a.version.replace(/_/g, ".").substring(0, 5))),
    /Windows/.test(nAgt) && (a.version = "Unknown.Unknown"),
    /Windows NT 5.1/.test(nAgt) && (a.version = "5.1"),
    /Windows NT 6.0/.test(nAgt) && (a.version = "6.0"),
    /Windows NT 6.1/.test(nAgt) && (a.version = "6.1"),
    /Windows NT 6.2/.test(nAgt) && (a.version = "6.2"),
    /Windows NT 10.0/.test(nAgt) && (a.version = "10.0"),
    /Linux/.test(nAgt) && /Linux/.test(nAgt) && (a.version = "Unknown.Unknown"),
    (a.name = a.name.toLowerCase()),
    (a.major_version = "Unknown"),
    (a.minor_version = "Unknown"),
    "Unknown.Unknown" != a.version &&
      ((a.major_version = parseFloat(a.version.split(".")[0])),
      (a.minor_version = parseFloat(a.version.split(".")[1]))),
    a
  );
};
(jQuery.browser.os = getOS()),
  (jQuery.browser.hasTouch = isTouchSupported()),
  (jQuery.browser.name = navigator.appName),
  (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion)),
  (jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10));
var nameOffset, verOffset, ix;
if (-1 != (verOffset = nAgt.indexOf("Opera")))
  (jQuery.browser.opera = !0),
    (jQuery.browser.name = "Opera"),
    (jQuery.browser.fullVersion = nAgt.substring(verOffset + 6)),
    -1 != (verOffset = nAgt.indexOf("Version")) &&
      (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8));
else if (-1 != (verOffset = nAgt.indexOf("OPR")))
  (jQuery.browser.opera = !0),
    (jQuery.browser.name = "Opera"),
    (jQuery.browser.fullVersion = nAgt.substring(verOffset + 4));
else if (-1 != (verOffset = nAgt.indexOf("MSIE")))
  (jQuery.browser.msie = !0),
    (jQuery.browser.name = "Microsoft Internet Explorer"),
    (jQuery.browser.fullVersion = nAgt.substring(verOffset + 5));
else if (-1 != nAgt.indexOf("Trident")) {
  (jQuery.browser.msie = !0),
    (jQuery.browser.name = "Microsoft Internet Explorer");
  var start = nAgt.indexOf("rv:") + 3,
    end = start + 4;
  jQuery.browser.fullVersion = nAgt.substring(start, end);
} else
  -1 != (verOffset = nAgt.indexOf("Edge"))
    ? ((jQuery.browser.edge = !0),
      (jQuery.browser.name = "Microsoft Edge"),
      (jQuery.browser.fullVersion = nAgt.substring(verOffset + 5)))
    : -1 != (verOffset = nAgt.indexOf("Chrome"))
    ? ((jQuery.browser.webkit = !0),
      (jQuery.browser.chrome = !0),
      (jQuery.browser.name = "Chrome"),
      (jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)))
    : -1 < nAgt.indexOf("mozilla/5.0") &&
      -1 < nAgt.indexOf("android ") &&
      -1 < nAgt.indexOf("applewebkit") &&
      !(-1 < nAgt.indexOf("chrome"))
    ? ((verOffset = nAgt.indexOf("Chrome")),
      (jQuery.browser.webkit = !0),
      (jQuery.browser.androidStock = !0),
      (jQuery.browser.name = "androidStock"),
      (jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)))
    : -1 != (verOffset = nAgt.indexOf("Safari"))
    ? ((jQuery.browser.webkit = !0),
      (jQuery.browser.safari = !0),
      (jQuery.browser.name = "Safari"),
      (jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)),
      -1 != (verOffset = nAgt.indexOf("Version")) &&
        (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)))
    : -1 != (verOffset = nAgt.indexOf("AppleWebkit"))
    ? ((jQuery.browser.webkit = !0),
      (jQuery.browser.safari = !0),
      (jQuery.browser.name = "Safari"),
      (jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)),
      -1 != (verOffset = nAgt.indexOf("Version")) &&
        (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)))
    : -1 != (verOffset = nAgt.indexOf("Firefox"))
    ? ((jQuery.browser.mozilla = !0),
      (jQuery.browser.name = "Firefox"),
      (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)))
    : (nameOffset = nAgt.lastIndexOf(" ") + 1) <
        (verOffset = nAgt.lastIndexOf("/")) &&
      ((jQuery.browser.name = nAgt.substring(nameOffset, verOffset)),
      (jQuery.browser.fullVersion = nAgt.substring(verOffset + 1)),
      jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() &&
        (jQuery.browser.name = navigator.appName));
-1 != (ix = jQuery.browser.fullVersion.indexOf(";")) &&
  (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)),
  -1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) &&
    (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)),
  (jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10)),
  isNaN(jQuery.browser.majorVersion) &&
    ((jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion)),
    (jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10))),
  (jQuery.browser.version = jQuery.browser.majorVersion),
  (jQuery.browser.android = /Android/i.test(nAgt)),
  (jQuery.browser.blackberry = /BlackBerry|BB|PlayBook/i.test(nAgt)),
  (jQuery.browser.ios = /iPhone|iPad|iPod|webOS/i.test(nAgt)),
  (jQuery.browser.operaMobile = /Opera Mini/i.test(nAgt)),
  (jQuery.browser.windowsMobile = /IEMobile|Windows Phone/i.test(nAgt)),
  (jQuery.browser.kindle = /Kindle|Silk/i.test(nAgt)),
  (jQuery.browser.mobile =
    jQuery.browser.android ||
    jQuery.browser.blackberry ||
    jQuery.browser.ios ||
    jQuery.browser.windowsMobile ||
    jQuery.browser.operaMobile ||
    jQuery.browser.kindle),
  (jQuery.isMobile = jQuery.browser.mobile),
  (jQuery.isTablet = jQuery.browser.mobile && 765 < jQuery(window).width()),
  (jQuery.isAndroidDefault = jQuery.browser.android && !/chrome/i.test(nAgt)),
  (jQuery.mbBrowser = jQuery.browser),
  (jQuery.browser.versionCompare = function (a, b) {
    if ("stringstring" != typeof a + typeof b) return !1;
    for (
      var c = a.split("."),
        d = b.split("."),
        e = 0,
        f = Math.max(c.length, d.length);
      f > e;
      e++
    ) {
      if (
        (c[e] && !d[e] && 0 < parseInt(c[e])) ||
        parseInt(c[e]) > parseInt(d[e])
      )
        return 1;
      if (
        (d[e] && !c[e] && 0 < parseInt(d[e])) ||
        parseInt(c[e]) < parseInt(d[e])
      )
        return -1;
    }
    return 0;
  }),
  (function (a) {
    (a.simpleSlider = {
      defaults: {
        initialval: 0,
        scale: 100,
        orientation: "h",
        readonly: !1,
        callback: !1,
      },
      events: {
        start: a.browser.mobile ? "touchstart" : "mousedown",
        end: a.browser.mobile ? "touchend" : "mouseup",
        move: a.browser.mobile ? "touchmove" : "mousemove",
      },
      init: function (b) {
        return this.each(function () {
          var c = this,
            d = a(c);
          d.addClass("simpleSlider"),
            (c.opt = {}),
            a.extend(c.opt, a.simpleSlider.defaults, b),
            a.extend(c.opt, d.data());
          var e = "h" == c.opt.orientation ? "horizontal" : "vertical",
            e = a("<div/>").addClass("level").addClass(e);
          d.prepend(e),
            (c.level = e),
            d.css({ cursor: "default" }),
            "auto" == c.opt.scale && (c.opt.scale = a(c).outerWidth()),
            d.updateSliderVal(),
            c.opt.readonly ||
              (d.on(a.simpleSlider.events.start, function (b) {
                a.browser.mobile && (b = b.changedTouches[0]),
                  (c.canSlide = !0),
                  d.updateSliderVal(b),
                  "h" == c.opt.orientation
                    ? d.css({ cursor: "col-resize" })
                    : d.css({ cursor: "row-resize" }),
                  b.preventDefault(),
                  b.stopPropagation();
              }),
              a(document)
                .on(a.simpleSlider.events.move, function (b) {
                  a.browser.mobile && (b = b.changedTouches[0]),
                    c.canSlide &&
                      (a(document).css({ cursor: "default" }),
                      d.updateSliderVal(b),
                      b.preventDefault(),
                      b.stopPropagation());
                })
                .on(a.simpleSlider.events.end, function () {
                  a(document).css({ cursor: "auto" }),
                    (c.canSlide = !1),
                    d.css({ cursor: "auto" });
                }));
        });
      },
      updateSliderVal: function (b) {
        var c = this.get(0);
        if (c.opt) {
          c.opt.initialval =
            "number" == typeof c.opt.initialval
              ? c.opt.initialval
              : c.opt.initialval(c);
          var d = a(c).outerWidth(),
            e = a(c).outerHeight();
          (c.x =
            "object" == typeof b
              ? b.clientX + document.body.scrollLeft - this.offset().left
              : "number" == typeof b
              ? (b * d) / c.opt.scale
              : (c.opt.initialval * d) / c.opt.scale),
            (c.y =
              "object" == typeof b
                ? b.clientY + document.body.scrollTop - this.offset().top
                : "number" == typeof b
                ? ((c.opt.scale - c.opt.initialval - b) * e) / c.opt.scale
                : (c.opt.initialval * e) / c.opt.scale),
            (c.y = this.outerHeight() - c.y),
            (c.scaleX = (c.x * c.opt.scale) / d),
            (c.scaleY = (c.y * c.opt.scale) / e),
            (c.outOfRangeX =
              c.scaleX > c.opt.scale
                ? c.scaleX - c.opt.scale
                : 0 > c.scaleX
                ? c.scaleX
                : 0),
            (c.outOfRangeY =
              c.scaleY > c.opt.scale
                ? c.scaleY - c.opt.scale
                : 0 > c.scaleY
                ? c.scaleY
                : 0),
            (c.outOfRange =
              "h" == c.opt.orientation ? c.outOfRangeX : c.outOfRangeY),
            (c.value =
              "undefined" != typeof b
                ? "h" == c.opt.orientation
                  ? c.x >= this.outerWidth()
                    ? c.opt.scale
                    : 0 >= c.x
                    ? 0
                    : c.scaleX
                  : c.y >= this.outerHeight()
                  ? c.opt.scale
                  : 0 >= c.y
                  ? 0
                  : c.scaleY
                : "h" == c.opt.orientation
                ? c.scaleX
                : c.scaleY),
            "h" == c.opt.orientation
              ? c.level.width(Math.floor((100 * c.x) / d) + "%")
              : c.level.height(Math.floor((100 * c.y) / e)),
            "function" == typeof c.opt.callback && c.opt.callback(c);
        }
      },
    }),
      (a.fn.simpleSlider = a.simpleSlider.init),
      (a.fn.updateSliderVal = a.simpleSlider.updateSliderVal);
  })(jQuery),
  (function (a) {
    (a.mbCookie = {
      set: function (a, b, c, d) {
        "object" == typeof b && (b = JSON.stringify(b)),
          c || (c = 7),
          (d = d ? "; domain=" + d : "");
        var e = new Date();
        e.setTime(e.getTime() + 864e5 * c),
          (c = "; expires=" + e.toGMTString()),
          (document.cookie = a + "=" + b + c + "; path=/" + d);
      },
      get: function (a) {
        a += "=";
        for (var b = document.cookie.split(";"), c = 0; c < b.length; c++) {
          for (var d = b[c]; " " == d.charAt(0); ) d = d.substring(1, d.length);
          if (0 == d.indexOf(a))
            try {
              return JSON.parse(d.substring(a.length, d.length));
            } catch (e) {
              return d.substring(a.length, d.length);
            }
        }
        return null;
      },
      remove: function (b) {
        a.mbCookie.set(b, "", -1);
      },
    }),
      (a.mbStorage = {
        set: function (a, b) {
          "object" == typeof b && (b = JSON.stringify(b)),
            localStorage.setItem(a, b);
        },
        get: function (a) {
          if (!localStorage[a]) return null;
          try {
            return JSON.parse(localStorage[a]);
          } catch (b) {
            return localStorage[a];
          }
        },
        remove: function (a) {
          a ? localStorage.removeItem(a) : localStorage.clear();
        },
      });
  })(jQuery);

/*!
 * headroom.js v0.9.3 - Give your page some headroom. Hide your header until you need it
 * Copyright (c) 2016 Nick Williams - http://wicky.nillia.ms/headroom.js
 * License: MIT
 */

!(function (a, b) {
  "use strict";
  "function" == typeof define && define.amd
    ? define([], b)
    : "object" == typeof exports
    ? (module.exports = b())
    : (a.Headroom = b());
})(this, function () {
  "use strict";
  function a(a) {
    (this.callback = a), (this.ticking = !1);
  }
  function b(a) {
    return a && "undefined" != typeof window && (a === window || a.nodeType);
  }
  function c(a) {
    if (arguments.length <= 0)
      throw new Error("Missing arguments in extend function");
    var d,
      e,
      f = a || {};
    for (e = 1; e < arguments.length; e++) {
      var g = arguments[e] || {};
      for (d in g)
        "object" != typeof f[d] || b(f[d])
          ? (f[d] = f[d] || g[d])
          : (f[d] = c(f[d], g[d]));
    }
    return f;
  }
  function d(a) {
    return a === Object(a) ? a : { down: a, up: a };
  }
  function e(a, b) {
    (b = c(b, e.options)),
      (this.lastKnownScrollY = 0),
      (this.elem = a),
      (this.tolerance = d(b.tolerance)),
      (this.classes = b.classes),
      (this.offset = b.offset),
      (this.scroller = b.scroller),
      (this.initialised = !1),
      (this.onPin = b.onPin),
      (this.onUnpin = b.onUnpin),
      (this.onTop = b.onTop),
      (this.onNotTop = b.onNotTop),
      (this.onBottom = b.onBottom),
      (this.onNotBottom = b.onNotBottom);
  }
  var f = {
    bind: !!function () {}.bind,
    classList: "classList" in document.documentElement,
    rAF: !!(
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame
    ),
  };
  return (
    (window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame),
    (a.prototype = {
      constructor: a,
      update: function () {
        this.callback && this.callback(), (this.ticking = !1);
      },
      requestTick: function () {
        this.ticking ||
          (requestAnimationFrame(
            this.rafCallback || (this.rafCallback = this.update.bind(this))
          ),
          (this.ticking = !0));
      },
      handleEvent: function () {
        this.requestTick();
      },
    }),
    (e.prototype = {
      constructor: e,
      init: function () {
        return e.cutsTheMustard
          ? ((this.debouncer = new a(this.update.bind(this))),
            this.elem.classList.add(this.classes.initial),
            setTimeout(this.attachEvent.bind(this), 100),
            this)
          : void 0;
      },
      destroy: function () {
        var a = this.classes;
        (this.initialised = !1),
          this.elem.classList.remove(
            a.unpinned,
            a.pinned,
            a.top,
            a.notTop,
            a.initial
          ),
          this.scroller.removeEventListener("scroll", this.debouncer, !1);
      },
      attachEvent: function () {
        this.initialised ||
          ((this.lastKnownScrollY = this.getScrollY()),
          (this.initialised = !0),
          this.scroller.addEventListener("scroll", this.debouncer, !1),
          this.debouncer.handleEvent());
      },
      unpin: function () {
        var a = this.elem.classList,
          b = this.classes;
        (!a.contains(b.pinned) && a.contains(b.unpinned)) ||
          (a.add(b.unpinned),
          a.remove(b.pinned),
          this.onUnpin && this.onUnpin.call(this));
      },
      pin: function () {
        var a = this.elem.classList,
          b = this.classes;
        a.contains(b.unpinned) &&
          (a.remove(b.unpinned),
          a.add(b.pinned),
          this.onPin && this.onPin.call(this));
      },
      top: function () {
        var a = this.elem.classList,
          b = this.classes;
        a.contains(b.top) ||
          (a.add(b.top),
          a.remove(b.notTop),
          this.onTop && this.onTop.call(this));
      },
      notTop: function () {
        var a = this.elem.classList,
          b = this.classes;
        a.contains(b.notTop) ||
          (a.add(b.notTop),
          a.remove(b.top),
          this.onNotTop && this.onNotTop.call(this));
      },
      bottom: function () {
        var a = this.elem.classList,
          b = this.classes;
        a.contains(b.bottom) ||
          (a.add(b.bottom),
          a.remove(b.notBottom),
          this.onBottom && this.onBottom.call(this));
      },
      notBottom: function () {
        var a = this.elem.classList,
          b = this.classes;
        a.contains(b.notBottom) ||
          (a.add(b.notBottom),
          a.remove(b.bottom),
          this.onNotBottom && this.onNotBottom.call(this));
      },
      getScrollY: function () {
        return void 0 !== this.scroller.pageYOffset
          ? this.scroller.pageYOffset
          : void 0 !== this.scroller.scrollTop
          ? this.scroller.scrollTop
          : (
              document.documentElement ||
              document.body.parentNode ||
              document.body
            ).scrollTop;
      },
      getViewportHeight: function () {
        return (
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight
        );
      },
      getElementPhysicalHeight: function (a) {
        return Math.max(a.offsetHeight, a.clientHeight);
      },
      getScrollerPhysicalHeight: function () {
        return this.scroller === window || this.scroller === document.body
          ? this.getViewportHeight()
          : this.getElementPhysicalHeight(this.scroller);
      },
      getDocumentHeight: function () {
        var a = document.body,
          b = document.documentElement;
        return Math.max(
          a.scrollHeight,
          b.scrollHeight,
          a.offsetHeight,
          b.offsetHeight,
          a.clientHeight,
          b.clientHeight
        );
      },
      getElementHeight: function (a) {
        return Math.max(a.scrollHeight, a.offsetHeight, a.clientHeight);
      },
      getScrollerHeight: function () {
        return this.scroller === window || this.scroller === document.body
          ? this.getDocumentHeight()
          : this.getElementHeight(this.scroller);
      },
      isOutOfBounds: function (a) {
        var b = 0 > a,
          c = a + this.getScrollerPhysicalHeight() > this.getScrollerHeight();
        return b || c;
      },
      toleranceExceeded: function (a, b) {
        return Math.abs(a - this.lastKnownScrollY) >= this.tolerance[b];
      },
      shouldUnpin: function (a, b) {
        var c = a > this.lastKnownScrollY,
          d = a >= this.offset;
        return c && d && b;
      },
      shouldPin: function (a, b) {
        var c = a < this.lastKnownScrollY,
          d = a <= this.offset;
        return (c && b) || d;
      },
      update: function () {
        var a = this.getScrollY(),
          b = a > this.lastKnownScrollY ? "down" : "up",
          c = this.toleranceExceeded(a, b);
        this.isOutOfBounds(a) ||
          (a <= this.offset ? this.top() : this.notTop(),
          a + this.getViewportHeight() >= this.getScrollerHeight()
            ? this.bottom()
            : this.notBottom(),
          this.shouldUnpin(a, c)
            ? this.unpin()
            : this.shouldPin(a, c) && this.pin(),
          (this.lastKnownScrollY = a));
      },
    }),
    (e.options = {
      tolerance: { up: 0, down: 0 },
      offset: 0,
      scroller: window,
      classes: {
        pinned: "headroom--pinned",
        unpinned: "headroom--unpinned",
        top: "headroom--top",
        notTop: "headroom--not-top",
        bottom: "headroom--bottom",
        notBottom: "headroom--not-bottom",
        initial: "headroom",
      },
    }),
    (e.cutsTheMustard =
      "undefined" != typeof f && f.rAF && f.bind && f.classList),
    e
  );
});

/* animate headline plugin */
jQuery(document).ready(function ($) {
  //set animation timing
  var animationDelay = 2500,
    //loading bar effect
    barAnimationDelay = 3800,
    barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
    //letters effect
    lettersDelay = 50,
    //type effect
    typeLettersDelay = 150,
    selectionDuration = 500,
    typeAnimationDelay = selectionDuration + 800,
    //clip effect
    revealDuration = 600,
    revealAnimationDelay = 1500;

  initHeadline();

  function initHeadline() {
    //insert <i> element for each letter of a changing word
    singleLetters($(".cd-headline.letters").find("b"));
    //initialise headline animation
    animateHeadline($(".cd-headline"));
  }

  function singleLetters($words) {
    $words.each(function () {
      var word = $(this),
        letters = word.text().split(""),
        selected = word.hasClass("is-visible");
      for (i in letters) {
        if (word.parents(".rotate-2").length > 0)
          letters[i] = "<em>" + letters[i] + "</em>";
        letters[i] = selected
          ? '<i class="in">' + letters[i] + "</i>"
          : "<i>" + letters[i] + "</i>";
      }
      var newLetters = letters.join("");
      word.html(newLetters).css("opacity", 1);
    });
  }

  function animateHeadline($headlines) {
    var duration = animationDelay;
    $headlines.each(function () {
      var headline = $(this);

      if (headline.hasClass("loading-bar")) {
        duration = barAnimationDelay;
        setTimeout(function () {
          headline.find(".cd-words-wrapper").addClass("is-loading");
        }, barWaiting);
      } else if (headline.hasClass("clip")) {
        var spanWrapper = headline.find(".cd-words-wrapper"),
          newWidth = spanWrapper.width() + 10;
        spanWrapper.css("width", newWidth);
      } else if (!headline.hasClass("type")) {
        //assign to .cd-words-wrapper the width of its longest word
        var words = headline.find(".cd-words-wrapper b"),
          width = 0;
        words.each(function () {
          var wordWidth = $(this).width();
          if (wordWidth > width) width = wordWidth;
        });
        headline.find(".cd-words-wrapper").css("width", width);
      }

      //trigger animation
      setTimeout(function () {
        hideWord(headline.find(".is-visible").eq(0));
      }, duration);
    });
  }

  function hideWord($word) {
    var nextWord = takeNext($word);

    if ($word.parents(".cd-headline").hasClass("type")) {
      var parentSpan = $word.parent(".cd-words-wrapper");
      parentSpan.addClass("selected").removeClass("waiting");
      setTimeout(function () {
        parentSpan.removeClass("selected");
        $word
          .removeClass("is-visible")
          .addClass("is-hidden")
          .children("i")
          .removeClass("in")
          .addClass("out");
      }, selectionDuration);
      setTimeout(function () {
        showWord(nextWord, typeLettersDelay);
      }, typeAnimationDelay);
    } else if ($word.parents(".cd-headline").hasClass("letters")) {
      var bool =
        $word.children("i").length >= nextWord.children("i").length
          ? true
          : false;
      hideLetter($word.find("i").eq(0), $word, bool, lettersDelay);
      showLetter(nextWord.find("i").eq(0), nextWord, bool, lettersDelay);
    } else if ($word.parents(".cd-headline").hasClass("clip")) {
      $word
        .parents(".cd-words-wrapper")
        .animate({ width: "2px" }, revealDuration, function () {
          switchWord($word, nextWord);
          showWord(nextWord);
        });
    } else if ($word.parents(".cd-headline").hasClass("loading-bar")) {
      $word.parents(".cd-words-wrapper").removeClass("is-loading");
      switchWord($word, nextWord);
      setTimeout(function () {
        hideWord(nextWord);
      }, barAnimationDelay);
      setTimeout(function () {
        $word.parents(".cd-words-wrapper").addClass("is-loading");
      }, barWaiting);
    } else {
      switchWord($word, nextWord);
      setTimeout(function () {
        hideWord(nextWord);
      }, animationDelay);
    }
  }

  function showWord($word, $duration) {
    if ($word.parents(".cd-headline").hasClass("type")) {
      showLetter($word.find("i").eq(0), $word, false, $duration);
      $word.addClass("is-visible").removeClass("is-hidden");
    } else if ($word.parents(".cd-headline").hasClass("clip")) {
      $word
        .parents(".cd-words-wrapper")
        .animate({ width: $word.width() + 10 }, revealDuration, function () {
          setTimeout(function () {
            hideWord($word);
          }, revealAnimationDelay);
        });
    }
  }

  function hideLetter($letter, $word, $bool, $duration) {
    $letter.removeClass("in").addClass("out");

    if (!$letter.is(":last-child")) {
      setTimeout(function () {
        hideLetter($letter.next(), $word, $bool, $duration);
      }, $duration);
    } else if ($bool) {
      setTimeout(function () {
        hideWord(takeNext($word));
      }, animationDelay);
    }

    if ($letter.is(":last-child") && $("html").hasClass("no-csstransitions")) {
      var nextWord = takeNext($word);
      switchWord($word, nextWord);
    }
  }

  function showLetter($letter, $word, $bool, $duration) {
    $letter.addClass("in").removeClass("out");

    if (!$letter.is(":last-child")) {
      setTimeout(function () {
        showLetter($letter.next(), $word, $bool, $duration);
      }, $duration);
    } else {
      if ($word.parents(".cd-headline").hasClass("type")) {
        setTimeout(function () {
          $word.parents(".cd-words-wrapper").addClass("waiting");
        }, 200);
      }
      if (!$bool) {
        setTimeout(function () {
          hideWord($word);
        }, animationDelay);
      }
    }
  }

  function takeNext($word) {
    return !$word.is(":last-child")
      ? $word.next()
      : $word.parent().children().eq(0);
  }

  function takePrev($word) {
    return !$word.is(":first-child")
      ? $word.prev()
      : $word.parent().children().last();
  }

  function switchWord($oldWord, $newWord) {
    $oldWord.removeClass("is-visible").addClass("is-hidden");
    $newWord.removeClass("is-hidden").addClass("is-visible");
  }
});

// Generated by CoffeeScript 1.6.2
/*
jQuery Waypoints - v2.0.3
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function () {
  var t =
      [].indexOf ||
      function (t) {
        for (var e = 0, n = this.length; e < n; e++) {
          if (e in this && this[e] === t) return e;
        }
        return -1;
      },
    e = [].slice;
  (function (t, e) {
    if (typeof define === "function" && define.amd) {
      return define("waypoints", ["jquery"], function (n) {
        return e(n, t);
      });
    } else {
      return e(t.jQuery, t);
    }
  })(this, function (n, r) {
    var i, o, l, s, f, u, a, c, h, d, p, y, v, w, g, m;
    i = n(r);
    c = t.call(r, "ontouchstart") >= 0;
    s = { horizontal: {}, vertical: {} };
    f = 1;
    a = {};
    u = "waypoints-context-id";
    p = "resize.waypoints";
    y = "scroll.waypoints";
    v = 1;
    w = "waypoints-waypoint-ids";
    g = "waypoint";
    m = "waypoints";
    o = (function () {
      function t(t) {
        var e = this;
        this.$element = t;
        this.element = t[0];
        this.didResize = false;
        this.didScroll = false;
        this.id = "context" + f++;
        this.oldScroll = { x: t.scrollLeft(), y: t.scrollTop() };
        this.waypoints = { horizontal: {}, vertical: {} };
        t.data(u, this.id);
        a[this.id] = this;
        t.bind(y, function () {
          var t;
          if (!(e.didScroll || c)) {
            e.didScroll = true;
            t = function () {
              e.doScroll();
              return (e.didScroll = false);
            };
            return r.setTimeout(t, n[m].settings.scrollThrottle);
          }
        });
        t.bind(p, function () {
          var t;
          if (!e.didResize) {
            e.didResize = true;
            t = function () {
              n[m]("refresh");
              return (e.didResize = false);
            };
            return r.setTimeout(t, n[m].settings.resizeThrottle);
          }
        });
      }
      t.prototype.doScroll = function () {
        var t,
          e = this;
        t = {
          horizontal: {
            newScroll: this.$element.scrollLeft(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left",
          },
          vertical: {
            newScroll: this.$element.scrollTop(),
            oldScroll: this.oldScroll.y,
            forward: "down",
            backward: "up",
          },
        };
        if (c && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
          n[m]("refresh");
        }
        n.each(t, function (t, r) {
          var i, o, l;
          l = [];
          o = r.newScroll > r.oldScroll;
          i = o ? r.forward : r.backward;
          n.each(e.waypoints[t], function (t, e) {
            var n, i;
            if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
              return l.push(e);
            } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
              return l.push(e);
            }
          });
          l.sort(function (t, e) {
            return t.offset - e.offset;
          });
          if (!o) {
            l.reverse();
          }
          return n.each(l, function (t, e) {
            if (e.options.continuous || t === l.length - 1) {
              return e.trigger([i]);
            }
          });
        });
        return (this.oldScroll = {
          x: t.horizontal.newScroll,
          y: t.vertical.newScroll,
        });
      };
      t.prototype.refresh = function () {
        var t,
          e,
          r,
          i = this;
        r = n.isWindow(this.element);
        e = this.$element.offset();
        this.doScroll();
        t = {
          horizontal: {
            contextOffset: r ? 0 : e.left,
            contextScroll: r ? 0 : this.oldScroll.x,
            contextDimension: this.$element.width(),
            oldScroll: this.oldScroll.x,
            forward: "right",
            backward: "left",
            offsetProp: "left",
          },
          vertical: {
            contextOffset: r ? 0 : e.top,
            contextScroll: r ? 0 : this.oldScroll.y,
            contextDimension: r
              ? n[m]("viewportHeight")
              : this.$element.height(),
            oldScroll: this.oldScroll.y,
            forward: "down",
            backward: "up",
            offsetProp: "top",
          },
        };
        return n.each(t, function (t, e) {
          return n.each(i.waypoints[t], function (t, r) {
            var i, o, l, s, f;
            i = r.options.offset;
            l = r.offset;
            o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
            if (n.isFunction(i)) {
              i = i.apply(r.element);
            } else if (typeof i === "string") {
              i = parseFloat(i);
              if (r.options.offset.indexOf("%") > -1) {
                i = Math.ceil((e.contextDimension * i) / 100);
              }
            }
            r.offset = o - e.contextOffset + e.contextScroll - i;
            if ((r.options.onlyOnScroll && l != null) || !r.enabled) {
              return;
            }
            if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
              return r.trigger([e.backward]);
            } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
              return r.trigger([e.forward]);
            } else if (l === null && e.oldScroll >= r.offset) {
              return r.trigger([e.forward]);
            }
          });
        });
      };
      t.prototype.checkEmpty = function () {
        if (
          n.isEmptyObject(this.waypoints.horizontal) &&
          n.isEmptyObject(this.waypoints.vertical)
        ) {
          this.$element.unbind([p, y].join(" "));
          return delete a[this.id];
        }
      };
      return t;
    })();
    l = (function () {
      function t(t, e, r) {
        var i, o;
        r = n.extend({}, n.fn[g].defaults, r);
        if (r.offset === "bottom-in-view") {
          r.offset = function () {
            var t;
            t = n[m]("viewportHeight");
            if (!n.isWindow(e.element)) {
              t = e.$element.height();
            }
            return t - n(this).outerHeight();
          };
        }
        this.$element = t;
        this.element = t[0];
        this.axis = r.horizontal ? "horizontal" : "vertical";
        this.callback = r.handler;
        this.context = e;
        this.enabled = r.enabled;
        this.id = "waypoints" + v++;
        this.offset = null;
        this.options = r;
        e.waypoints[this.axis][this.id] = this;
        s[this.axis][this.id] = this;
        i = (o = t.data(w)) != null ? o : [];
        i.push(this.id);
        t.data(w, i);
      }
      t.prototype.trigger = function (t) {
        if (!this.enabled) {
          return;
        }
        if (this.callback != null) {
          this.callback.apply(this.element, t);
        }
        if (this.options.triggerOnce) {
          return this.destroy();
        }
      };
      t.prototype.disable = function () {
        return (this.enabled = false);
      };
      t.prototype.enable = function () {
        this.context.refresh();
        return (this.enabled = true);
      };
      t.prototype.destroy = function () {
        delete s[this.axis][this.id];
        delete this.context.waypoints[this.axis][this.id];
        return this.context.checkEmpty();
      };
      t.getWaypointsByElement = function (t) {
        var e, r;
        r = n(t).data(w);
        if (!r) {
          return [];
        }
        e = n.extend({}, s.horizontal, s.vertical);
        return n.map(r, function (t) {
          return e[t];
        });
      };
      return t;
    })();
    d = {
      init: function (t, e) {
        var r;
        if (e == null) {
          e = {};
        }
        if ((r = e.handler) == null) {
          e.handler = t;
        }
        this.each(function () {
          var t, r, i, s;
          t = n(this);
          i = (s = e.context) != null ? s : n.fn[g].defaults.context;
          if (!n.isWindow(i)) {
            i = t.closest(i);
          }
          i = n(i);
          r = a[i.data(u)];
          if (!r) {
            r = new o(i);
          }
          return new l(t, r, e);
        });
        n[m]("refresh");
        return this;
      },
      disable: function () {
        return d._invoke(this, "disable");
      },
      enable: function () {
        return d._invoke(this, "enable");
      },
      destroy: function () {
        return d._invoke(this, "destroy");
      },
      prev: function (t, e) {
        return d._traverse.call(this, t, e, function (t, e, n) {
          if (e > 0) {
            return t.push(n[e - 1]);
          }
        });
      },
      next: function (t, e) {
        return d._traverse.call(this, t, e, function (t, e, n) {
          if (e < n.length - 1) {
            return t.push(n[e + 1]);
          }
        });
      },
      _traverse: function (t, e, i) {
        var o, l;
        if (t == null) {
          t = "vertical";
        }
        if (e == null) {
          e = r;
        }
        l = h.aggregate(e);
        o = [];
        this.each(function () {
          var e;
          e = n.inArray(this, l[t]);
          return i(o, e, l[t]);
        });
        return this.pushStack(o);
      },
      _invoke: function (t, e) {
        t.each(function () {
          var t;
          t = l.getWaypointsByElement(this);
          return n.each(t, function (t, n) {
            n[e]();
            return true;
          });
        });
        return this;
      },
    };
    n.fn[g] = function () {
      var t, r;
      (r = arguments[0]),
        (t = 2 <= arguments.length ? e.call(arguments, 1) : []);
      if (d[r]) {
        return d[r].apply(this, t);
      } else if (n.isFunction(r)) {
        return d.init.apply(this, arguments);
      } else if (n.isPlainObject(r)) {
        return d.init.apply(this, [null, r]);
      } else if (!r) {
        return n.error(
          "jQuery Waypoints needs a callback function or handler option."
        );
      } else {
        return n.error(
          "The " + r + " method does not exist in jQuery Waypoints."
        );
      }
    };
    n.fn[g].defaults = {
      context: r,
      continuous: true,
      enabled: true,
      horizontal: false,
      offset: 0,
      triggerOnce: false,
    };
    h = {
      refresh: function () {
        return n.each(a, function (t, e) {
          return e.refresh();
        });
      },
      viewportHeight: function () {
        var t;
        return (t = r.innerHeight) != null ? t : i.height();
      },
      aggregate: function (t) {
        var e, r, i;
        e = s;
        if (t) {
          e = (i = a[n(t).data(u)]) != null ? i.waypoints : void 0;
        }
        if (!e) {
          return [];
        }
        r = { horizontal: [], vertical: [] };
        n.each(r, function (t, i) {
          n.each(e[t], function (t, e) {
            return i.push(e);
          });
          i.sort(function (t, e) {
            return t.offset - e.offset;
          });
          r[t] = n.map(i, function (t) {
            return t.element;
          });
          return (r[t] = n.unique(r[t]));
        });
        return r;
      },
      above: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "vertical", function (t, e) {
          return e.offset <= t.oldScroll.y;
        });
      },
      below: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "vertical", function (t, e) {
          return e.offset > t.oldScroll.y;
        });
      },
      left: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "horizontal", function (t, e) {
          return e.offset <= t.oldScroll.x;
        });
      },
      right: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, "horizontal", function (t, e) {
          return e.offset > t.oldScroll.x;
        });
      },
      enable: function () {
        return h._invoke("enable");
      },
      disable: function () {
        return h._invoke("disable");
      },
      destroy: function () {
        return h._invoke("destroy");
      },
      extendFn: function (t, e) {
        return (d[t] = e);
      },
      _invoke: function (t) {
        var e;
        e = n.extend({}, s.vertical, s.horizontal);
        return n.each(e, function (e, n) {
          n[t]();
          return true;
        });
      },
      _filter: function (t, e, r) {
        var i, o;
        i = a[n(t).data(u)];
        if (!i) {
          return [];
        }
        o = [];
        n.each(i.waypoints[e], function (t, e) {
          if (r(i, e)) {
            return o.push(e);
          }
        });
        o.sort(function (t, e) {
          return t.offset - e.offset;
        });
        return n.map(o, function (t) {
          return t.element;
        });
      },
    };
    n[m] = function () {
      var t, n;
      (n = arguments[0]),
        (t = 2 <= arguments.length ? e.call(arguments, 1) : []);
      if (h[n]) {
        return h[n].apply(null, t);
      } else {
        return h.aggregate.call(null, n);
      }
    };
    n[m].settings = { resizeThrottle: 100, scrollThrottle: 30 };
    return i.load(function () {
      return n[m]("refresh");
    });
  });
}.call(this));

/*!
 * scrollup v2.4.1
 * Url: http://markgoodyear.com/labs/scrollup/
 * Copyright (c) Mark Goodyear — @markgdyr — http://markgoodyear.com
 * License: MIT
 */
!(function (l, o, e) {
  "use strict";
  (l.fn.scrollUp = function (o) {
    l.data(e.body, "scrollUp") ||
      (l.data(e.body, "scrollUp", !0), l.fn.scrollUp.init(o));
  }),
    (l.fn.scrollUp.init = function (r) {
      var s,
        t,
        c,
        i,
        n,
        a,
        d,
        p = (l.fn.scrollUp.settings = l.extend({}, l.fn.scrollUp.defaults, r)),
        f = !1;
      switch (
        ((d = p.scrollTrigger
          ? l(p.scrollTrigger)
          : l("<a/>", { id: p.scrollName, href: "#top" })),
        p.scrollTitle && d.attr("title", p.scrollTitle),
        d.appendTo("body"),
        p.scrollImg || p.scrollTrigger || d.html(p.scrollText),
        d.css({ display: "none", position: "fixed", zIndex: p.zIndex }),
        p.activeOverlay &&
          l("<div/>", { id: p.scrollName + "-active" })
            .css({
              position: "absolute",
              top: p.scrollDistance + "px",
              width: "100%",
              borderTop: "1px dotted" + p.activeOverlay,
              zIndex: p.zIndex,
            })
            .appendTo("body"),
        p.animation)
      ) {
        case "fade":
          (s = "fadeIn"), (t = "fadeOut"), (c = p.animationSpeed);
          break;
        case "slide":
          (s = "slideDown"), (t = "slideUp"), (c = p.animationSpeed);
          break;
        default:
          (s = "show"), (t = "hide"), (c = 0);
      }
      (i =
        "top" === p.scrollFrom
          ? p.scrollDistance
          : l(e).height() - l(o).height() - p.scrollDistance),
        (n = l(o).scroll(function () {
          l(o).scrollTop() > i
            ? f || (d[s](c), (f = !0))
            : f && (d[t](c), (f = !1));
        })),
        p.scrollTarget
          ? "number" == typeof p.scrollTarget
            ? (a = p.scrollTarget)
            : "string" == typeof p.scrollTarget &&
              (a = Math.floor(l(p.scrollTarget).offset().top))
          : (a = 0),
        d.click(function (o) {
          o.preventDefault(),
            l("html, body").animate(
              { scrollTop: a },
              p.scrollSpeed,
              p.easingType
            );
        });
    }),
    (l.fn.scrollUp.defaults = {
      scrollName: "scrollUp",
      scrollDistance: 300,
      scrollFrom: "top",
      scrollSpeed: 300,
      easingType: "linear",
      animation: "fade",
      animationSpeed: 200,
      scrollTrigger: !1,
      scrollTarget: !1,
      scrollText: "Scroll to top",
      scrollTitle: !1,
      scrollImg: !1,
      activeOverlay: !1,
      zIndex: 2147483647,
    }),
    (l.fn.scrollUp.destroy = function (r) {
      l.removeData(e.body, "scrollUp"),
        l("#" + l.fn.scrollUp.settings.scrollName).remove(),
        l("#" + l.fn.scrollUp.settings.scrollName + "-active").remove(),
        l.fn.jquery.split(".")[1] >= 7
          ? l(o).off("scroll", r)
          : l(o).unbind("scroll", r);
    }),
    (l.scrollUp = l.fn.scrollUp);
})(jQuery, window, document);

/*
 * jQuery One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 *
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version 3.0.0
 *
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current',
 *   changeHash: false,
 *   scrollSpeed: 750
 * });
 */
!(function (t, i, n, s) {
  var e = function (s, e) {
    (this.elem = s),
      (this.$elem = t(s)),
      (this.options = e),
      (this.metadata = this.$elem.data("plugin-options")),
      (this.$win = t(i)),
      (this.sections = {}),
      (this.didScroll = !1),
      (this.$doc = t(n)),
      (this.docHeight = this.$doc.height());
  };
  (e.prototype = {
    defaults: {
      navItems: "a",
      currentClass: "current",
      changeHash: !1,
      easing: "swing",
      filter: "",
      scrollSpeed: 750,
      scrollThreshold: 0.5,
      begin: !1,
      end: !1,
      scrollChange: !1,
    },
    init: function () {
      return (
        (this.config = t.extend(
          {},
          this.defaults,
          this.options,
          this.metadata
        )),
        (this.$nav = this.$elem.find(this.config.navItems)),
        "" !== this.config.filter &&
          (this.$nav = this.$nav.filter(this.config.filter)),
        this.$nav.on("click.onePageNav", t.proxy(this.handleClick, this)),
        this.getPositions(),
        this.bindInterval(),
        this.$win.on("resize.onePageNav", t.proxy(this.getPositions, this)),
        this
      );
    },
    adjustNav: function (t, i) {
      t.$elem
        .find("." + t.config.currentClass)
        .removeClass(t.config.currentClass),
        i.addClass(t.config.currentClass);
    },
    bindInterval: function () {
      var t,
        i = this;
      i.$win.on("scroll.onePageNav", function () {
        i.didScroll = !0;
      }),
        (i.t = setInterval(function () {
          (t = i.$doc.height()),
            i.didScroll && ((i.didScroll = !1), i.scrollChange()),
            t !== i.docHeight && ((i.docHeight = t), i.getPositions());
        }, 250));
    },
    getHash: function (t) {
      return t.attr("href").split("#")[1];
    },
    getPositions: function () {
      var i,
        n,
        s,
        e = this;
      e.$nav.each(function () {
        (i = e.getHash(t(this))),
          (s = t("#" + i)),
          s.length && ((n = s.offset().top), (e.sections[i] = Math.round(n)));
      });
    },
    getSection: function (t) {
      var i = null,
        n = Math.round(this.$win.height() * this.config.scrollThreshold);
      for (var s in this.sections) this.sections[s] - n < t && (i = s);
      return i;
    },
    handleClick: function (n) {
      var s = this,
        e = t(n.currentTarget),
        o = e.parent(),
        a = "#" + s.getHash(e);
      o.hasClass(s.config.currentClass) ||
        (s.config.begin && s.config.begin(),
        s.adjustNav(s, o),
        s.unbindInterval(),
        s.scrollTo(a, function () {
          s.config.changeHash && (i.location.hash = a),
            s.bindInterval(),
            s.config.end && s.config.end();
        })),
        n.preventDefault();
    },
    scrollChange: function () {
      var t,
        i = this.$win.scrollTop(),
        n = this.getSection(i);
      null !== n &&
        ((t = this.$elem.find('a[href$="#' + n + '"]').parent()),
        t.hasClass(this.config.currentClass) ||
          (this.adjustNav(this, t),
          this.config.scrollChange && this.config.scrollChange(t)));
    },
    scrollTo: function (i, n) {
      var s = t(i).offset().top;
      t("html, body").animate(
        { scrollTop: s - this.config.scrollOffset },
        this.config.scrollSpeed,
        this.config.easing,
        n
      );
    },
    unbindInterval: function () {
      clearInterval(this.t), this.$win.unbind("scroll.onePageNav");
    },
  }),
    (e.defaults = e.prototype.defaults),
    (t.fn.onePageNav = function (t) {
      return this.each(function () {
        new e(this, t).init();
      });
    });
})(jQuery, window, document);

// smoothscroll.js in here.

/*!
 * Smooth Scroll - v1.4.13 - 2013-11-02
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2013 Karl Swedberg
 * Licensed MIT (https://github.com/kswedberg/jquery-smooth-scroll/blob/master/LICENSE-MIT)
 */
(function (t) {
  function e(t) {
    return t.replace(/(:|\.)/g, "\\$1");
  }
  var l = "1.4.13",
    o = {},
    s = {
      exclude: [],
      excludeWithin: [],
      offset: 0,
      direction: "top",
      scrollElement: null,
      scrollTarget: null,
      beforeScroll: function () {},
      afterScroll: function () {},
      easing: "swing",
      speed: 400,
      autoCoefficent: 2,
      preventDefault: !0,
    },
    n = function (e) {
      var l = [],
        o = !1,
        s = e.dir && "left" == e.dir ? "scrollLeft" : "scrollTop";
      return (
        this.each(function () {
          if (this != document && this != window) {
            var e = t(this);
            e[s]() > 0
              ? l.push(this)
              : (e[s](1), (o = e[s]() > 0), o && l.push(this), e[s](0));
          }
        }),
        l.length ||
          this.each(function () {
            "BODY" === this.nodeName && (l = [this]);
          }),
        "first" === e.el && l.length > 1 && (l = [l[0]]),
        l
      );
    };
  t.fn.extend({
    scrollable: function (t) {
      var e = n.call(this, { dir: t });
      return this.pushStack(e);
    },
    firstScrollable: function (t) {
      var e = n.call(this, { el: "first", dir: t });
      return this.pushStack(e);
    },
    smoothScroll: function (l, o) {
      if (((l = l || {}), "options" === l))
        return o
          ? this.each(function () {
              var e = t(this),
                l = t.extend(e.data("ssOpts") || {}, o);
              t(this).data("ssOpts", l);
            })
          : this.first().data("ssOpts");
      var s = t.extend({}, t.fn.smoothScroll.defaults, l),
        n = t.smoothScroll.filterPath(location.pathname);
      return (
        this.unbind("click.smoothscroll").bind(
          "click.smoothscroll",
          function (l) {
            var o = this,
              r = t(this),
              i = t.extend({}, s, r.data("ssOpts") || {}),
              c = s.exclude,
              a = i.excludeWithin,
              f = 0,
              h = 0,
              u = !0,
              d = {},
              p = location.hostname === o.hostname || !o.hostname,
              m =
                i.scrollTarget ||
                (t.smoothScroll.filterPath(o.pathname) || n) === n,
              S = e(o.hash);
            if (i.scrollTarget || (p && m && S)) {
              for (; u && c.length > f; ) r.is(e(c[f++])) && (u = !1);
              for (; u && a.length > h; ) r.closest(a[h++]).length && (u = !1);
            } else u = !1;
            u &&
              (i.preventDefault && l.preventDefault(),
              t.extend(d, i, { scrollTarget: i.scrollTarget || S, link: o }),
              t.smoothScroll(d));
          }
        ),
        this
      );
    },
  }),
    (t.smoothScroll = function (e, l) {
      if ("options" === e && "object" == typeof l) return t.extend(o, l);
      var s,
        n,
        r,
        i,
        c = 0,
        a = "offset",
        f = "scrollTop",
        h = {},
        u = {};
      "number" == typeof e
        ? ((s = t.extend({ link: null }, t.fn.smoothScroll.defaults, o)),
          (r = e))
        : ((s = t.extend(
            { link: null },
            t.fn.smoothScroll.defaults,
            e || {},
            o
          )),
          s.scrollElement &&
            ((a = "position"),
            "static" == s.scrollElement.css("position") &&
              s.scrollElement.css("position", "relative"))),
        (f = "left" == s.direction ? "scrollLeft" : f),
        s.scrollElement
          ? ((n = s.scrollElement),
            /^(?:HTML|BODY)$/.test(n[0].nodeName) || (c = n[f]()))
          : (n = t("html, body").firstScrollable(s.direction)),
        s.beforeScroll.call(n, s),
        (r =
          "number" == typeof e
            ? e
            : l ||
              (t(s.scrollTarget)[a]() && t(s.scrollTarget)[a]()[s.direction]) ||
              0),
        (h[f] = r + c + s.offset),
        (i = s.speed),
        "auto" === i && ((i = h[f] || n.scrollTop()), (i /= s.autoCoefficent)),
        (u = {
          duration: i,
          easing: s.easing,
          complete: function () {
            s.afterScroll.call(s.link, s);
          },
        }),
        s.step && (u.step = s.step),
        n.length ? n.stop().animate(h, u) : s.afterScroll.call(s.link, s);
    }),
    (t.smoothScroll.version = l),
    (t.smoothScroll.filterPath = function (t) {
      return t
        .replace(/^\//, "")
        .replace(/(?:index|default).[a-zA-Z]{3,4}$/, "")
        .replace(/\/$/, "");
    }),
    (t.fn.smoothScroll.defaults = s);
})(jQuery);
