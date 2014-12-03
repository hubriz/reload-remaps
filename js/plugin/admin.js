jQuery(function () {
    if (!("ace" in window)) {
        window.ace = {}
    }
    window.ace.click_event = $.fn.tap ? "tap" : "click"
});
(function (e, c) {
    var d = "multiple" in document.createElement("INPUT");
    var j = "FileList" in window;
    var b = "FileReader" in window;
    var f = function (l, m) {
        var k = this;
        this.settings = e.extend({}, e.fn.ace_file_input.defaults, m);
        this.$element = e(l);
        this.element = l;
        this.disabled = false;
        this.can_reset = true;
        this.$element.on("change.ace_inner_call", function (o, n) {
            if (n === true) {
                return
            }
            return a.call(k)
        });
        this.$element.wrap('<div class="ace-file-input" />');
        this.apply_settings()
    };
    f.error = {
        FILE_LOAD_FAILED: 1,
        IMAGE_LOAD_FAILED: 2,
        THUMBNAIL_FAILED: 3
    };
    f.prototype.apply_settings = function () {
        var l = this;
        var k = !!this.settings.icon_remove;
        this.multi = this.$element.attr("multiple") && d;
        this.well_style = this.settings.style == "well";
        if (this.well_style) {
            this.$element.parent().addClass("ace-file-multiple")
        } else {
            this.$element.parent().removeClass("ace-file-multiple")
        }
        this.$element.parent().find(":not(input[type=file])").remove();
        this.$element.after('<label data-title="' + this.settings.btn_choose + '"><span data-title="' + this.settings.no_file + '">' + (this.settings.no_icon ? '<i class="' + this.settings.no_icon + '"></i>' : "") + "</span></label>" + (k ? '<a class="remove" href="#"><i class="' + this.settings.icon_remove + '"></i></a>' : ""));
        this.$label = this.$element.next();
        this.$label.on("click", function () {
            if (!this.disabled && !l.element.disabled && !l.$element.attr("readonly")) {
                l.$element.click()
            }
        });
        if (k) {
            this.$label.next("a").on(ace.click_event, function () {
                if (!l.can_reset) {
                    return false
                }
                var m = true;
                if (l.settings.before_remove) {
                    m = l.settings.before_remove.call(l.element)
                }
                if (!m) {
                    return false
                }
                return l.reset_input()
            })
        }
        if (this.settings.droppable && j) {
            g.call(this)
        }
    };
    f.prototype.show_file_list = function (k) {
        var n = typeof k === "undefined" ? this.$element.data("ace_input_files") : k;
        if (!n || n.length == 0) {
            return
        }
        if (this.well_style) {
            this.$label.find("span").remove();
            if (!this.settings.btn_change) {
                this.$label.addClass("hide-placeholder")
            }
        }
        this.$label.attr("data-title", this.settings.btn_change).addClass("selected");
        for (var p = 0; p < n.length; p++) {
            var l = typeof n[p] === "string" ? n[p] : e.trim(n[p].name);
            var q = l.lastIndexOf("\\") + 1;
            if (q == 0) {
                q = l.lastIndexOf("/") + 1
            }
            l = l.substr(q);
            var m = "icon-file";
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(l)) {
                m = "icon-picture"
            } else {
                if ((/\.(mpe?g|flv|mov|avi|swf|mp4|mkv|webm|wmv|3gp)$/i).test(l)) {
                    m = "icon-film"
                } else {
                    if ((/\.(mp3|ogg|wav|wma|amr|aac)$/i).test(l)) {
                        m = "icon-music"
                    }
                }
            } if (!this.well_style) {
                this.$label.find("span").attr({
                    "data-title": l
                }).find('[class*="icon-"]').attr("class", m)
            } else {
                this.$label.append('<span data-title="' + l + '"><i class="' + m + '"></i></span>');
                var r = e.trim(n[p].type);
                var o = b && this.settings.thumbnail && ((r.length > 0 && r.match("image")) || (r.length == 0 && m == "icon-picture"));
                if (o) {
                    var s = this;
                    e.when(i.call(this, n[p])).fail(function (t) {
                        if (s.settings.preview_error) {
                            s.settings.preview_error.call(s, l, t.code)
                        }
                    })
                }
            }
        }
        return true
    };
    f.prototype.reset_input = function () {
        this.$label.attr({
            "data-title": this.settings.btn_choose,
            "class": ""
        }).find("span:first").attr({
            "data-title": this.settings.no_file,
            "class": ""
        }).find('[class*="icon-"]').attr("class", this.settings.no_icon).prev("img").remove();
        if (!this.settings.no_icon) {
            this.$label.find('[class*="icon-"]').remove()
        }
        this.$label.find("span").not(":first").remove();
        if (this.$element.data("ace_input_files")) {
            this.$element.removeData("ace_input_files");
            this.$element.removeData("ace_input_method")
        }
        this.reset_input_field();
        return false
    };
    f.prototype.reset_input_field = function () {
        this.$element.wrap("<form>").closest("form").get(0).reset();
        this.$element.unwrap()
    };
    f.prototype.enable_reset = function (k) {
        this.can_reset = k
    };
    f.prototype.disable = function () {
        this.disabled = true;
        this.$element.attr("disabled", "disabled").addClass("disabled")
    };
    f.prototype.enable = function () {
        this.disabled = false;
        this.$element.removeAttr("disabled").removeClass("disabled")
    };
    f.prototype.files = function () {
        return e(this).data("ace_input_files") || null
    };
    f.prototype.method = function () {
        return e(this).data("ace_input_method") || ""
    };
    f.prototype.update_settings = function (k) {
        this.settings = e.extend({}, this.settings, k);
        this.apply_settings()
    };
    var g = function () {
        var l = this;
        var k = this.element.parentNode;
        e(k).on("dragenter", function (m) {
            m.preventDefault();
            m.stopPropagation()
        }).on("dragover", function (m) {
            m.preventDefault();
            m.stopPropagation()
        }).on("drop", function (q) {
            q.preventDefault();
            q.stopPropagation();
            var p = q.originalEvent.dataTransfer;
            var o = p.files;
            if (!l.multi && o.length > 1) {
                var n = [];
                n.push(o[0]);
                o = n
            }
            var m = true;
            if (l.settings.before_change) {
                m = l.settings.before_change.call(l.element, o, true)
            }
            if (!m || m.length == 0) {
                return false
            }
            if (m instanceof Array || (j && m instanceof FileList)) {
                o = m
            }
            l.$element.data("ace_input_files", o);
            l.$element.data("ace_input_method", "drop");
            l.show_file_list(o);
            l.$element.triggerHandler("change", [true]);
            return true
        })
    };
    var a = function () {
        var l = true;
        if (this.settings.before_change) {
            l = this.settings.before_change.call(this.element, this.element.files || [this.element.value], false)
        }
        if (!l || l.length == 0) {
            if (!this.$element.data("ace_input_files")) {
                this.reset_input_field()
            }
            return false
        }
        var m = !j ? null : ((l instanceof Array || l instanceof FileList) ? l : this.element.files);
        this.$element.data("ace_input_method", "select");
        if (m && m.length > 0) {
            this.$element.data("ace_input_files", m)
        } else {
            var k = e.trim(this.element.value);
            if (k && k.length > 0) {
                m = [];
                m.push(k);
                this.$element.data("ace_input_files", m)
            }
        } if (!m || m.length == 0) {
            return false
        }
        this.show_file_list(m);
        return true
    };
    var i = function (o) {
        var n = this;
        var l = n.$label.find("span:last");
        var m = new e.Deferred;
        var k = new FileReader();
        k.onload = function (q) {
            l.prepend("<img class='middle' style='display:none;' />");
            var p = l.find("img:last").get(0);
            e(p).one("load", function () {
                var t = 50;
                if (n.settings.thumbnail == "large") {
                    t = 150
                } else {
                    if (n.settings.thumbnail == "fit") {
                        t = l.width()
                    }
                }
                l.addClass(t > 50 ? "large" : "");
                var s = h(p, t, o.type);
                if (s == null) {
                    e(this).remove();
                    m.reject({
                        code: f.error.THUMBNAIL_FAILED
                    });
                    return
                }
                var r = s.w,
                    u = s.h;
                if (n.settings.thumbnail == "small") {
                    r = u = t
                }
                e(p).css({
                    "background-image": "url(" + s.src + ")",
                    width: r,
                    height: u
                }).data("thumb", s.src).attr({
                    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
                }).show();
                m.resolve()
            }).one("error", function () {
                l.find("img").remove();
                m.reject({
                    code: f.error.IMAGE_LOAD_FAILED
                })
            });
            p.src = q.target.result
        };
        k.onerror = function (p) {
            m.reject({
                code: f.error.FILE_LOAD_FAILED
            })
        };
        k.readAsDataURL(o);
        return m.promise()
    };
    var h = function (n, s, q) {
        var r = n.width,
            o = n.height;
        if (r > s || o > s) {
            if (r > o) {
                o = parseInt(s / r * o);
                r = s
            } else {
                r = parseInt(s / o * r);
                o = s
            }
        }
        var m;
        try {
            var l = document.createElement("canvas");
            l.width = r;
            l.height = o;
            var k = l.getContext("2d");
            k.drawImage(n, 0, 0, n.width, n.height, 0, 0, r, o);
            m = l.toDataURL()
        } catch (p) {
            m = null
        }
        if (!(/^data\:image\/(png|jpe?g|gif);base64,[0-9A-Za-z\+\/\=]+$/.test(m))) {
            m = null
        }
        if (!m) {
            return null
        }
        return {
            src: m,
            w: r,
            h: o
        }
    };
    e.fn.ace_file_input = function (m, n) {
        var l;
        var k = this.each(function () {
            var q = e(this);
            var p = q.data("ace_file_input");
            var o = typeof m === "object" && m;
            if (!p) {
                q.data("ace_file_input", (p = new f(this, o)))
            }
            if (typeof m === "string") {
                l = p[m](n)
            }
        });
        return (l === c) ? k : l
    };
    e.fn.ace_file_input.defaults = {
        style: false,
        no_file: "No File ...",
        no_icon: "icon-upload-alt",
        btn_choose: "Choose",
        btn_change: "Change",
        icon_remove: "icon-remove",
        droppable: false,
        thumbnail: false,
        before_change: null,
        before_remove: null,
        preview_error: null
    }
})(window.jQuery);
(function (a, b) {
    a.fn.ace_spinner = function (c) {
        this.each(function () {
            var f = c.icon_up || "icon-chevron-up";
            var i = c.icon_down || "icon-chevron-down";
            var e = c.btn_up_class || "";
            var g = c.btn_down_class || "";
            var d = c.max || 999;
            d = ("" + d).length;
            var j = a(this).addClass("spinner-input").css("width", (d * 10) + "px").wrap('<div class="ace-spinner">').after('<div class="spinner-buttons btn-group btn-group-vertical">						<button type="button" class="btn spinner-up btn-mini ' + e + '">						<i class="' + f + '"></i>						</button>						<button type="button" class="btn spinner-down btn-mini ' + g + '">						<i class="' + i + '"></i>						</button>						</div>').closest(".ace-spinner").spinner(c).wrapInner("<div class='input-append'></div>");
            a(this).on("mousewheel DOMMouseScroll", function (k) {
                var l = k.originalEvent.detail < 0 || k.originalEvent.wheelDelta > 0 ? 1 : -1;
                j.spinner("step", l > 0);
                j.spinner("triggerChangedEvent");
                return false
            });
            var h = a(this);
            j.on("changed", function () {
                h.trigger("change")
            })
        });
        return this
    }
})(window.jQuery);
(function (a, b) {
    a.fn.ace_wizard = function (c) {
        this.each(function () {
            var h = a(this);
            var d = h.find("li");
            var e = d.length;
            var f = parseFloat((100 / e).toFixed(1)) + "%";
            d.css({
                "min-width": f,
                "max-width": f
            });
            h.show().wizard();
            var g = h.siblings(".wizard-actions").eq(0);
            var i = h.data("wizard");
            i.$prevBtn.remove();
            i.$nextBtn.remove();
            i.$prevBtn = g.find(".btn-prev").eq(0).on(ace.click_event, function () {
                h.wizard("previous")
            }).attr("disabled", "disabled");
            i.$nextBtn = g.find(".btn-next").eq(0).on(ace.click_event, function () {
                h.wizard("next")
            }).removeAttr("disabled");
            i.nextText = i.$nextBtn.text()
        });
        return this
    }
})(window.jQuery);
(function (a, b) {
    a.fn.ace_colorpicker = function (c) {
        var d = a.extend({
            pull_right: false,
            caret: true
        }, c);
        this.each(function () {
            var g = a(this);
            var e = "";
            var f = "";
            a(this).hide().find("option").each(function () {
                var h = "colorpick-btn";
                if (this.selected) {
                    h += " selected";
                    f = this.value
                }
                e += '<li><a class="' + h + '" href="#" style="background-color:' + this.value + ';" data-color="' + this.value + '"></a></li>'
            }).end().on("change.ace_inner_call", function () {
                a(this).next().find(".btn-colorpicker").css("background-color", this.value)
            }).after('<div class="dropdown dropdown-colorpicker"><a data-toggle="dropdown" class="dropdown-toggle" href="#"><span class="btn-colorpicker" style="background-color:' + f + '"></span></a><ul class="dropdown-menu' + (d.caret ? " dropdown-caret" : "") + (d.pull_right ? " pull-right" : "") + '">' + e + "</ul></div>").next().find(".dropdown-menu").on(ace.click_event, function (j) {
                var h = a(j.target);
                if (!h.is(".colorpick-btn")) {
                    return false
                }
                h.closest("ul").find(".selected").removeClass("selected");
                h.addClass("selected");
                var i = h.data("color");
                g.val(i).change();
                j.preventDefault();
                return true
            })
        });
        return this
    }
})(window.jQuery);
(function (a, b) {
    a.fn.ace_tree = function (d) {
        var c = {
            "open-icon": "icon-folder-open",
            "close-icon": "icon-folder-close",
            selectable: true,
            "selected-icon": "icon-ok",
            "unselected-icon": "tree-dot"
        };
        c = a.extend({}, c, d);
        this.each(function () {
            var e = a(this);
            e.html('<div class = "tree-folder" style="display:none;">				<div class="tree-folder-header">					<i class="' + c["close-icon"] + '"></i>					<div class="tree-folder-name"></div>				</div>				<div class="tree-folder-content"></div>				<div class="tree-loader" style="display:none"></div>			</div>			<div class="tree-item" style="display:none;">				' + (c["unselected-icon"] == null ? "" : '<i class="' + c["unselected-icon"] + '"></i>') + '				<div class="tree-item-name"></div>			</div>');
            e.addClass(c.selectable == true ? "tree-selectable" : "tree-unselectable");
            e.tree(c)
        });
        return this
    }
})(window.jQuery);
(function (a, b) {
    a.fn.ace_wysiwyg = function (c, h) {
        var d = a.extend({
            speech_button: true,
            wysiwyg: {}
        }, c);
        var e = ["#ac725e", "#d06b64", "#f83a22", "#fa573c", "#ff7537", "#ffad46", "#42d692", "#16a765", "#7bd148", "#b3dc6c", "#fbe983", "#fad165", "#92e1c0", "#9fe1e7", "#9fc6e7", "#4986e7", "#9a9cff", "#b99aff", "#c2c2c2", "#cabdbf", "#cca6ac", "#f691b2", "#cd74e6", "#a47ae2", "#444444"];
        var g = {
            font: {
                values: ["Arial", "Courier", "Comic Sans MS", "Helvetica", "Open Sans", "Tahoma", "Verdana"],
                icon: "icon-font",
                title: "Font"
            },
            fontSize: {
                values: {
                    5: "Huge",
                    3: "Normal",
                    1: "Small"
                },
                icon: "icon-text-height",
                title: "Font Size"
            },
            bold: {
                icon: "icon-bold",
                title: "Bold (Ctrl/Cmd+B)"
            },
            italic: {
                icon: "icon-italic",
                title: "Italic (Ctrl/Cmd+I)"
            },
            strikethrough: {
                icon: "icon-strikethrough",
                title: "Strikethrough"
            },
            underline: {
                icon: "icon-underline",
                title: "Underline"
            },
            insertunorderedlist: {
                icon: "icon-list-ul",
                title: "Bullet list"
            },
            insertorderedlist: {
                icon: "icon-list-ol",
                title: "Number list"
            },
            outdent: {
                icon: "icon-indent-left",
                title: "Reduce indent (Shift+Tab)"
            },
            indent: {
                icon: "icon-indent-right",
                title: "Indent (Tab)"
            },
            justifyleft: {
                icon: "icon-align-left",
                title: "Align Left (Ctrl/Cmd+L)"
            },
            justifycenter: {
                icon: "icon-align-center",
                title: "Center (Ctrl/Cmd+E)"
            },
            justifyright: {
                icon: "icon-align-right",
                title: "Align Right (Ctrl/Cmd+R)"
            },
            justifyfull: {
                icon: "icon-align-justify",
                title: "Justify (Ctrl/Cmd+J)"
            },
            createLink: {
                icon: "icon-link",
                title: "Hyperlink",
                button_text: "Add",
                placeholder: "URL"
            },
            unlink: {
                icon: "icon-unlink",
                title: "Remove Hyperlink"
            },
            insertImage: {
                icon: "icon-picture",
                title: "Insert picture",
                button_text: '<i class="icon-file"></i> Choose Image &hellip;',
                placeholder: "Image URL"
            },
            foreColor: {
                values: e,
                title: "Change Color"
            },
            backColor: {
                values: e,
                title: "Change Background Color"
            },
            undo: {
                icon: "icon-undo",
                title: "Undo (Ctrl/Cmd+Z)"
            },
            redo: {
                icon: "icon-repeat",
                title: "Redo (Ctrl/Cmd+Y)"
            }
        };
        var f = d.toolbar || ["font", null, "fontSize", null, "bold", "italic", "strikethrough", "underline", null, "insertunorderedlist", "insertorderedlist", "outdent", "indent", null, "justifyleft", "justifycenter", "justifyright", "justifyfull", null, "createLink", "unlink", null, "insertImage", null, "foreColor", null, "undo", "redo"];
        this.each(function () {
            var q = ' <div class="wysiwyg-toolbar btn-toolbar center"> <div class="btn-group"> ';
            for (var m in f) {
                if (f.hasOwnProperty(m)) {
                    var o = f[m];
                    if (o === null) {
                        q += ' </div> <div class="btn-group"> ';
                        continue
                    }
                    if (typeof o == "string" && o in g) {
                        o = g[o];
                        o.name = f[m]
                    } else {
                        if (typeof o == "object" && o.name in g) {
                            o = a.extend(g[o.name], o)
                        } else {
                            continue
                        }
                    }
                    var p = "className" in o ? o.className : "";
                    switch (o.name) {
                    case "font":
                        q += ' <a class="btn btn-small ' + p + ' dropdown-toggle" data-toggle="dropdown" title="' + o.title + '"><i class="' + o.icon + '"></i><i class="icon-angle-down icon-on-right"></i></a> ';
                        q += ' <ul class="dropdown-menu dropdown-light">';
                        for (var j in o.values) {
                            if (o.values.hasOwnProperty(j)) {
                                q += ' <li><a data-edit="fontName ' + o.values[j] + '" style="font-family:\'' + o.values[j] + "'\">" + o.values[j] + "</a></li> "
                            }
                        }
                        q += " </ul>";
                        break;
                    case "fontSize":
                        q += ' <a class="btn btn-small ' + p + ' dropdown-toggle" data-toggle="dropdown" title="' + o.title + '"><i class="' + o.icon + '"></i>&nbsp;<i class="icon-angle-down icon-on-right"></i></a> ';
                        q += ' <ul class="dropdown-menu dropdown-light"> ';
                        for (var r in o.values) {
                            if (o.values.hasOwnProperty(r)) {
                                q += ' <li><a data-edit="fontSize ' + r + '"><font size="' + r + '">' + o.values[r] + "</font></a></li> "
                            }
                        }
                        q += " </ul> ";
                        break;
                    case "createLink":
                        q += ' <a class="btn btn-small ' + p + ' dropdown-toggle" data-toggle="dropdown" title="' + o.title + '"><i class="' + o.icon + '"></i></a> ';
                        q += ' <div class="dropdown-menu dropdown-caret input-append pull-right">							<input placeholder="' + o.placeholder + '" type="text" data-edit="' + o.name + '" />							<button class="btn btn-small btn-primary" type="button">' + o.button_text + "</button>						</div> ";
                        break;
                    case "insertImage":
                        q += ' <a class="btn btn-small ' + p + ' dropdown-toggle" data-toggle="dropdown" title="' + o.title + '"><i class="' + o.icon + '"></i></a> ';
                        q += ' <div class="dropdown-menu dropdown-caret input-append pull-right">							<input placeholder="' + o.placeholder + '" type="text" data-edit="' + o.name + '" />							<button class="btn btn-small btn-primary" type="button">Insert</button> ';
                        if ("FileReader" in window) {
                            q += '<div class="center">								<button class="btn btn-small btn-success wysiwyg-choose-file" type="button">' + o.button_text + '</button>								<input type="file" data-edit="' + o.name + '" />							  </div>'
                        }
                        q += " </div> ";
                        break;
                    case "foreColor":
                    case "backColor":
                        q += ' <select class="hide wysiwyg_colorpicker" title="' + o.title + '"> ';
                        for (var l in o.values) {
                            q += ' <option value="' + o.values[l] + '">' + o.values[l] + "</option> "
                        }
                        q += " </select> ";
                        q += ' <input style="display:none;" disabled class="hide" type="text" data-edit="' + o.name + '" /> ';
                        break;
                    default:
                        q += ' <a class="btn btn-small ' + p + '" data-edit="' + o.name + '" title="' + o.title + '"><i class="' + o.icon + '"></i></a> ';
                        break
                    }
                }
            }
            q += " </div> </div> ";
            if (d.toolbar_place) {
                q = d.toolbar_place.call(this, q)
            } else {
                q = a(this).before(q).prev()
            }
            q.find("a[title]").tooltip({
                animation: false
            });
            q.find(".dropdown-menu input:not([type=file])").on(ace.click_event, function () {
                return false
            }).on("change", function () {
                a(this).closest(".dropdown-menu").siblings(".dropdown-toggle").dropdown("toggle")
            }).on("keydown", function (s) {
                if (s.which == 27) {
                    this.value = "";
                    a(this).change()
                }
            });
            q.find("input[type=file]").prev().on(ace.click_event, function (s) {
                a(this).next().click()
            });
            q.find(".wysiwyg_colorpicker").each(function () {
                a(this).ace_colorpicker({
                    pull_right: true,
                    caret: false
                }).change(function () {
                    a(this).nextAll("input").eq(0).val(this.value).change()
                }).next().find(".btn-colorpicker").tooltip({
                    title: this.title,
                    animation: false
                })
            });
            var k;
            if (d.speech_button && "onwebkitspeechchange" in (k = document.createElement("input"))) {
                var i = a(this).offset();
                q.append(k);
                a(k).attr({
                    type: "text",
                    "data-edit": "inserttext",
                    "x-webkit-speech": ""
                }).addClass("wysiwyg-speech-input").css({
                    position: "absolute"
                }).offset({
                    top: i.top,
                    left: i.left + a(this).innerWidth() - 35
                })
            } else {
                k = null
            }
            var n = a.extend({}, {
                activeToolbarClass: "active",
                toolbarSelector: q
            }, d.wysiwyg || {});
            a(this).wysiwyg(n)
        });
        return this
    }
})(window.jQuery);



jQuery(function () {
    handle_side_menu();
    enable_search_ahead();
    general_things();
    widget_boxes()
});

function handle_side_menu() {
    $("#menu-toggler").on(ace.click_event, function () {
        $("#sidebar").toggleClass("display");
        $(this).toggleClass("display");
        return false
    });
    var b = $("#sidebar").hasClass("menu-min");
    $("#sidebar-collapse").on(ace.click_event, function () {
        $("#sidebar").toggleClass("menu-min");
        $(this).find('[class*="icon-"]:eq(0)').toggleClass("icon-double-angle-right");
        b = $("#sidebar").hasClass("menu-min");
        if (b) {
            $(".open > .submenu").removeClass("open")
        }
    });
    var a = "ontouchend" in document;
    $(".nav-list").on(ace.click_event, function (g) {
        var f = $(g.target).closest("a");
        if (!f || f.length == 0) {
            return
        }
        if (!f.hasClass("dropdown-toggle")) {
            if (b && ace.click_event == "tap" && f.get(0).parentNode.parentNode == this) {
                var h = f.find(".menu-text").get(0);
                if (g.target != h && !$.contains(h, g.target)) {
                    return false
                }
            }
            return
        }
        var d = f.next().get(0);
        if (!$(d).is(":visible")) {
            var c = $(d.parentNode).closest("ul");
            if (b && c.hasClass("nav-list")) {
                return
            }
            c.find("> .open > .submenu").each(function () {
                if (this != d && !$(this.parentNode).hasClass("active")) {
                    $(this).slideUp(200).parent().removeClass("open")
                }
            })
        } else {} if (b && $(d.parentNode.parentNode).hasClass("nav-list")) {
            return false
        }
        $(d).slideToggle(200).parent().toggleClass("open");
        return false
    })
}

function enable_search_ahead() {
    $("#nav-search-input").typeahead({
        source: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
        updater: function (a) {
            $("#nav-search-input").focus();
            return a
        }
    })
}

function general_things() {
    $('.ace-nav [class*="icon-animated-"]').closest("a").on("click", function () {
        var b = $(this).find('[class*="icon-animated-"]').eq(0);
        var a = b.attr("class").match(/icon\-animated\-([\d\w]+)/);
        b.removeClass(a[0]);
        $(this).off("click")
    });
    $(".nav-list .badge[title],.nav-list .label[title]").tooltip({
        placement: "right"
    });
    $("#ace-settings-btn").on(ace.click_event, function () {
        $(this).toggleClass("open");
        $("#ace-settings-box").toggleClass("open")
    });
    $("#ace-settings-header").removeAttr("checked").on("click", function () {
        if (!this.checked) {
            if ($("#ace-settings-sidebar").get(0).checked) {
                $("#ace-settings-sidebar").click()
            }
        }
        $(".navbar").toggleClass("navbar-fixed-top");
        $(document.body).toggleClass("navbar-fixed")
    });
    $("#ace-settings-sidebar").removeAttr("checked").on("click", function () {
        if (this.checked) {
            if (!$("#ace-settings-header").get(0).checked) {
                $("#ace-settings-header").click()
            }
        } else {
            if ($("#ace-settings-breadcrumbs").get(0).checked) {
                $("#ace-settings-breadcrumbs").click()
            }
        }
        $("#sidebar").toggleClass("fixed")
    });
    $("#ace-settings-breadcrumbs").removeAttr("checked").on("click", function () {
        if (this.checked) {
            if (!$("#ace-settings-sidebar").get(0).checked) {
                $("#ace-settings-sidebar").click()
            }
        }
        $("#breadcrumbs").toggleClass("fixed");
        $(document.body).toggleClass("breadcrumbs-fixed")
    });
    $("#ace-settings-rtl").removeAttr("checked").on("click", function () {
        switch_direction()
    });
    $("#btn-scroll-up").on(ace.click_event, function () {
        var a = Math.max(100, parseInt($("html").scrollTop() / 3));
        $("html,body").animate({
            scrollTop: 0
        }, a);
        return false
    });
    $("#skin-colorpicker").ace_colorpicker().on("change", function () {
        var b = $(this).find("option:selected").data("class");
        var a = $(document.body);
        a.removeClass("skin-1 skin-2 skin-3");
        if (b != "default") {
            a.addClass(b)
        }
        if (b == "skin-1") {
            $(".ace-nav > li.grey").addClass("dark")
        } else {
            $(".ace-nav > li.grey").removeClass("dark")
        } if (b == "skin-2") {
            $(".ace-nav > li").addClass("no-border margin-1");
            $(".ace-nav > li:not(:last-child)").addClass("light-pink").find('> a > [class*="icon-"]').addClass("pink").end().eq(0).find(".badge").addClass("badge-warning")
        } else {
            $(".ace-nav > li").removeClass("no-border margin-1");
            $(".ace-nav > li:not(:last-child)").removeClass("light-pink").find('> a > [class*="icon-"]').removeClass("pink").end().eq(0).find(".badge").removeClass("badge-warning")
        } if (b == "skin-3") {
            $(".ace-nav > li.grey").addClass("red").find(".badge").addClass("badge-yellow")
        } else {
            $(".ace-nav > li.grey").removeClass("red").find(".badge").removeClass("badge-yellow")
        }
    })
}

function widget_boxes() {
    $(".page-content").delegate(".widget-toolbar > [data-action]", "click", function (k) {
        k.preventDefault();
        var j = $(this);
        var l = j.data("action");
        var a = j.closest(".widget-box");
        if (a.hasClass("ui-sortable-helper")) {
            return
        }
        if (l == "collapse") {
            var d = a.find(".widget-body");
            var i = j.find("[class*=icon-]").eq(0);
            var e = i.attr("class").match(/icon\-(.*)\-(up|down)/);
            var b = "icon-" + e[1] + "-down";
            var f = "icon-" + e[1] + "-up";
            var h = d.find(".widget-body-inner");
            if (h.length == 0) {
                d = d.wrapInner('<div class="widget-body-inner"></div>').find(":first-child").eq(0)
            } else {
                d = h.eq(0)
            }
            var c = 300;
            var g = 200;
            if (a.hasClass("collapsed")) {
                if (i) {
                    i.addClass(f).removeClass(b)
                }
                a.removeClass("collapsed");
                d.slideUp(0, function () {
                    d.slideDown(c)
                })
            } else {
                if (i) {
                    i.addClass(b).removeClass(f)
                }
                d.slideUp(g, function () {
                    a.addClass("collapsed")
                })
            }
        } else {
            if (l == "close") {
                var n = parseInt(j.data("close-speed")) || 300;
                a.hide(n, function () {
                    a.remove()
                })
            } else {
                if (l == "reload") {
                    j.blur();
                    var m = false;
                    if (a.css("position") == "static") {
                        m = true;
                        a.addClass("position-relative")
                    }
                    a.append('<div class="widget-box-layer"><i class="icon-spinner icon-spin icon-2x white"></i></div>');
                    setTimeout(function () {
                        a.find(".widget-box-layer").remove();
                        if (m) {
                            a.removeClass("position-relative")
                        }
                    }, parseInt(Math.random() * 1000 + 1000))
                } else {
                    if (l == "settings") {}
                }
            }
        }
    })
}

function switch_direction() {
    var c = $(document.body);
    c.toggleClass("rtl").find(".dropdown-menu:not(.datepicker-dropdown,.colorpicker)").toggleClass("pull-right").end().find('.pull-right:not(.dropdown-menu,blockquote,.dropdown-submenu,.profile-skills .pull-right,.control-group .controls > [class*="span"]:first-child)').removeClass("pull-right").addClass("tmp-rtl-pull-right").end().find(".pull-left:not(.dropdown-submenu,.profile-skills .pull-left)").removeClass("pull-left").addClass("pull-right").end().find(".tmp-rtl-pull-right").removeClass("tmp-rtl-pull-right").addClass("pull-left").end().find(".chzn-container").toggleClass("chzn-rtl").end().find('.control-group .controls > [class*="span"]:first-child').toggleClass("pull-right").end();

    function a(g, f) {
        c.find("." + g).removeClass(g).addClass("tmp-rtl-" + g).end().find("." + f).removeClass(f).addClass(g).end().find(".tmp-rtl-" + g).removeClass("tmp-rtl-" + g).addClass(f)
    }

    function b(g, f, h) {
        h.each(function () {
            var j = $(this);
            var i = j.css(f);
            j.css(f, j.css(g));
            j.css(g, i)
        })
    }
    a("align-left", "align-right");
    a("arrowed", "arrowed-right");
    a("arrowed-in", "arrowed-in-right");
    var d = $("#piechart-placeholder");
    if (d.size() > 0) {
        var e = $(document.body).hasClass("rtl") ? "nw" : "ne";
        d.data("draw").call(d.get(0), d, d.data("chart"), e)
    }
};