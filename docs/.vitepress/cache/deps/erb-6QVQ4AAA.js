import {
  ruby
} from "./chunk-OAC6AXAD.js";
import "./chunk-PIGC4SO6.js";
import "./chunk-Q7I7CMZ3.js";
import "./chunk-UJLD6WUZ.js";
import "./chunk-YIGX5HSQ.js";
import "./chunk-ZNLJWTK2.js";
import "./chunk-TXHTZBND.js";
import {
  html
} from "./chunk-KGS4D2KO.js";
import "./chunk-Q7SPSHLO.js";
import "./chunk-UJU6FTIT.js";
import "./chunk-UV5CTPV7.js";

// node_modules/shiki/dist/langs/erb.mjs
var lang = Object.freeze({ "displayName": "ERB", "fileTypes": ["erb", "rhtml", "html.erb"], "injections": { "text.html.erb - (meta.embedded.block.erb | meta.embedded.line.erb | comment)": { "patterns": [{ "begin": "(^\\s*)(?=<%+#(?![^%]*%>))", "beginCaptures": { "0": { "name": "punctuation.whitespace.comment.leading.erb" } }, "end": "(?!\\G)(\\s*$\\n)?", "endCaptures": { "0": { "name": "punctuation.whitespace.comment.trailing.erb" } }, "patterns": [{ "include": "#comment" }] }, { "begin": "(^\\s*)(?=<%(?![^%]*%>))", "beginCaptures": { "0": { "name": "punctuation.whitespace.embedded.leading.erb" } }, "end": "(?!\\G)(\\s*$\\n)?", "endCaptures": { "0": { "name": "punctuation.whitespace.embedded.trailing.erb" } }, "patterns": [{ "include": "#tags" }] }, { "include": "#comment" }, { "include": "#tags" }] } }, "name": "erb", "patterns": [{ "include": "text.html.basic" }], "repository": { "comment": { "patterns": [{ "begin": "<%+#", "beginCaptures": { "0": { "name": "punctuation.definition.comment.begin.erb" } }, "end": "%>", "endCaptures": { "0": { "name": "punctuation.definition.comment.end.erb" } }, "name": "comment.block.erb" }] }, "tags": { "patterns": [{ "begin": "<%+(?!>)[-=]?(?![^%]*%>)", "beginCaptures": { "0": { "name": "punctuation.section.embedded.begin.erb" } }, "contentName": "source.ruby", "end": "(-?%)>", "endCaptures": { "0": { "name": "punctuation.section.embedded.end.erb" }, "1": { "name": "source.ruby" } }, "name": "meta.embedded.block.erb", "patterns": [{ "captures": { "1": { "name": "punctuation.definition.comment.erb" } }, "match": "(#).*?(?=-?%>)", "name": "comment.line.number-sign.erb" }, { "include": "source.ruby" }] }, { "begin": "<%+(?!>)[-=]?", "beginCaptures": { "0": { "name": "punctuation.section.embedded.begin.erb" } }, "contentName": "source.ruby", "end": "(-?%)>", "endCaptures": { "0": { "name": "punctuation.section.embedded.end.erb" }, "1": { "name": "source.ruby" } }, "name": "meta.embedded.line.erb", "patterns": [{ "captures": { "1": { "name": "punctuation.definition.comment.erb" } }, "match": "(#).*?(?=-?%>)", "name": "comment.line.number-sign.erb" }, { "include": "source.ruby" }] }] } }, "scopeName": "text.html.erb", "embeddedLangs": ["html", "ruby"] });
var erb = [
  ...html,
  ...ruby,
  lang
];
export {
  erb as default
};
//# sourceMappingURL=erb-6QVQ4AAA.js.map
