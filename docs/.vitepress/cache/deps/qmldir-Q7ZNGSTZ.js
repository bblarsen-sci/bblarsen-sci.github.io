import "./chunk-UV5CTPV7.js";

// node_modules/shiki/dist/langs/qmldir.mjs
var lang = Object.freeze({ "displayName": "QML Directory", "name": "qmldir", "patterns": [{ "include": "#comment" }, { "include": "#keywords" }, { "include": "#version" }, { "include": "#names" }], "repository": { "comment": { "patterns": [{ "begin": "#", "end": "$", "name": "comment.line.number-sign.qmldir" }] }, "file-name": { "patterns": [{ "match": "\\b\\w+\\.(qmltypes|qml|js)\\b", "name": "string.unquoted.qmldir" }] }, "identifier": { "patterns": [{ "match": "\\b\\w+\\b", "name": "variable.parameter.qmldir" }] }, "keywords": { "patterns": [{ "match": "\\b(module|singleton|internal|plugin|classname|typeinfo|depends|designersupported)\\b", "name": "keyword.other.qmldir" }] }, "module-name": { "patterns": [{ "match": "\\b[A-Z]\\w*\\b", "name": "entity.name.type.qmldir" }] }, "names": { "patterns": [{ "include": "#file-name" }, { "include": "#module-name" }, { "include": "#identifier" }] }, "version": { "patterns": [{ "match": "\\b\\d+\\.\\d+\\b", "name": "constant.numeric.qml" }] } }, "scopeName": "source.qmldir" });
var qmldir = [
  lang
];
export {
  qmldir as default
};
//# sourceMappingURL=qmldir-Q7ZNGSTZ.js.map
