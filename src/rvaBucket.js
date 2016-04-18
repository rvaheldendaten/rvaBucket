define("extensions/rvaBucket/util", ["qlik"], function(e) {
    "use strict";

    function t(e, t, n) {
        var r = document.createElement(e);
        return t && (r.className = t), n !== undefined && (r.innerHTML = n), r
    }

    function n(e, t) {
        e.childNodes.length === 0 ? e.appendChild(t) : e.replaceChild(t, e.childNodes[0])
    }

    function r(e) {
        var n = t("link");
        n.rel = "stylesheet", n.type = "text/css", n.href = require.toUrl(e), document.head.appendChild(n)
    }

    function i(t) {
        var n = e.currApp();
        n.variable.getByName ? n.variable.getByName(t).then(function() {}, function() {
            n.variable.create(t)
        }) : n.variable.create(t)
    }
    return {
        createElement: t,
        setChild: n,
        addStyleSheet: r,
        createVariable: i
    }
}), define("extensions/rvaBucket/properties", ["./util"], function(e) {
    "use strict";
    return {
        initialProperties: {
            variableValue: {},
            variableName: "",
            render: "f",
            alternatives: [],
            min: 0,
            max: 100,
            step: 1,
            style: "qlik",
            width: "",
            customwidth: ""
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                settings: {
                    uses: "settings",
                    items: {
                        variable: {
                            type: "items",
                            label: "Variable",
                            items: {
                                name: {
                                    ref: "variableName",
                                    label: "Name",
                                    type: "string",
                                    change: function(t) {
                                        e.createVariable(t.variableName), t.variableValue = t.variableValue || {}, t.variableValue.qStringExpression = "=" + t.variableName
                                    }
                                },
                                style: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Style",
                                    ref: "style",
                                    options: [{
                                        value: "qlik",
                                        label: "Qlik"
                                    }, {
                                        value: "bootstrap",
                                        label: "Bootstrap"
                                    }, {
                                        value: "material",
                                        label: "Material"
                                    }]
                                },
                                width: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Width",
                                    ref: "width",
                                    options: [{
                                        value: "",
                                        label: "Default"
                                    }, {
                                        value: "fill",
                                        label: "Fill"
                                    }, {
                                        value: "custom",
                                        label: "Custom"
                                    }]
                                },
                                customwidth: {
                                    type: "string",
                                    ref: "customwidth",
                                    label: "Custom width",
                                    expression: "optional",
                                    show: function(e) {
                                        return e.width === "custom"
                                    }
                                },
                                render: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Render as",
                                    ref: "render",
                                    options: [{
                                        value: "bucket",
                                        label: "Bucket"
                                    }
									],
                                    defaultValue: "bucket"
                                },
                                alternatives: {
                                    type: "array",
                                    ref: "alternatives",
                                    label: "Alternatives",
                                    itemTitleRef: "label",
                                    allowAdd: !0,
                                    allowRemove: !0,
                                    addTranslation: "Add Alternative",
                                    items: {
                                        value: {
                                            type: "string",
                                            ref: "value",
                                            label: "Value",
                                            expression: "optional"
                                        },
                                        label: {
                                            type: "string",
                                            ref: "label",
                                            label: "Label",
                                            expression: "optional"
                                        }
                                    },
                                    show: function(e) {
                                        return e.render === "b" || e.render === "s"
                                    }
                                },
								bucketField: {
                                    ref: "bucketField",
                                    label: "Field to build bucket",
                                    type: "string",
                                    defaultValue: "Fieldname",
                                    show: function(e) {
                                        return e.render === "bucket"
                                    }
                                },
								bucketAggregation: {
                                    ref: "bucketAggregation",
                                    label: "Expression to build bucket",
                                    type: "string",
                                    defaultValue: "sum(Revenue)",
                                    show: function(e) {
                                        return e.render === "bucket"
                                    }
                                },
								bucketVariableName: {
                                    ref: "bucketVariableName",
                                    label: "Variable that should be used as chart dimension (create variable manually)",
                                    type: "string",
									defaultValue: "vBucketDimension",
									show: function(e) {
                                        return e.render === "bucket"
                                    },
                                    change: function(t) {
                                        e.createVariable(t.variableName), t.variableValue = t.variableValue || {}, t.variableValue.qStringExpression = "=" + t.variableName
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}), define(["qlik", "./util", "./properties"], function(e, t, n) {
    "use strict";

    function r(e) {
        return (e.value - e.min) * 100 / (e.max - e.min)
    }

    function i(e, t, n) {
        switch (e) {
            case "material":
            case "bootstrap":
                if (n) return "selected";
                break;
            default:
                switch (t) {
                    case "button":
                        return n ? "qui-button-selected" : "qui-button";
                    case "select":
                        return "qui-select";
                    case "input":
                        return "qui-input"
                }
        }
    }

    function s(e) {
        if (e.render === "l") return "98%";
        if (e.width === "custom") return e.customwidth;
        if (e.width === "fill") return e.render !== "b" ? "100%" : "calc( " + 100 / e.alternatives.length + "% - 3px)"
    }
    return t.addStyleSheet("extensions/rvaBucket/variable.css"), {
        initialProperties: n.initialProperties,
        definition: n.definition,
        paint: function(n, o) {
		//	alert(o.render);
            var u = t.createElement("div", o.style || "qlik"),
                a = s(o),
                f = this;
            if (o.render === "bucket")
			{
				
					var pBucket = t.createElement("textarea");
					var att = document.createAttribute("rows");       
					att.value = "3";                           
					pBucket.setAttributeNode(att); 

					pBucket.innerHTML=o.variableValue,pBucket.style.width=a,pBucket.onchange = function() {
                    e.currApp(f).variable.setContent(o.variableName, this.value);
					var qlikaggr = o.bucketAggregation;
					var qlikexpression = "if ("+qlikaggr+" @1@, @2@)";
					var parseExpression = this.value.split("\n");
					for (var i = 0; i < parseExpression.length; i++) {
//						var parseIfExpression = parseExpression.slice(parseExpression[i].search("<"));
						qlikexpression = qlikexpression.replace("@1@", parseExpression[i]+",dual('"+parseExpression[i]+"',"+i+")");
						if (i+2 < parseExpression.length)
						{
							qlikexpression = qlikexpression.replace ("@2@","if ("+qlikaggr+" @1@, @2@)" );
						}
						else
						{
							qlikexpression = qlikexpression.replace ("@2@","dual('Others',"+(i+2)+")");
						}
						
					}
//					alert (qlikexpression);

					e.currApp(f).variable.setContent(o.bucketVariableName, "aggr(" + qlikexpression + ", "+ o.bucketField+")");
                }, u.appendChild(pBucket)
				
			}
            t.setChild(n[0], u)
        }
    }
});