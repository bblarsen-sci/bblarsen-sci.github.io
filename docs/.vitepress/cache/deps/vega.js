import {
  $,
  Bounds,
  CanvasHandler,
  CanvasRenderer,
  DATE,
  DAY,
  DAYOFYEAR,
  Dataflow,
  Debug,
  Error$1,
  EventStream,
  Gradient,
  GroupItem,
  HOURS,
  Handler,
  HybridHandler,
  HybridRenderer,
  Info,
  Item,
  MILLISECONDS,
  MINUTES,
  MONTH,
  Marks,
  MultiPulse,
  None,
  Operator,
  Parameters,
  Pulse,
  QUARTER,
  RenderType,
  Renderer,
  ResourceLoader,
  SECONDS,
  SVGHandler,
  SVGRenderer,
  SVGStringRenderer,
  Scenegraph,
  TIME_UNITS,
  Transform,
  View,
  WEEK,
  Warn,
  YEAR,
  accessor,
  accessorFields,
  accessorName,
  array,
  ascending,
  bin,
  bin2,
  bootstrapCI,
  boundClip,
  boundContext,
  boundItem,
  boundMark,
  boundStroke,
  changeset,
  clampRange,
  codegen,
  compare,
  constant,
  constant2,
  context,
  cumulativeLogNormal,
  cumulativeNormal,
  cumulativeUniform,
  curves,
  dayofyear,
  debounce,
  defaultLocale,
  definition,
  densityLogNormal,
  densityNormal,
  densityUniform,
  domChild,
  domClear,
  domCreate,
  domFind,
  dotbin,
  error,
  estimateBandwidth,
  eventSelector,
  exp,
  expressionFunction,
  extend,
  extent,
  extentIndex,
  falsy,
  fastmap,
  field,
  flush,
  font,
  fontFamily,
  fontSize,
  format,
  formats,
  gaussian,
  has,
  id,
  identity,
  inferType,
  inferTypes,
  ingest$1,
  inherits,
  inrange,
  integer,
  interpolate,
  interpolateColors,
  interpolateRange,
  intersect,
  intersectBoxLine,
  intersectPath,
  intersectPoint,
  intersectRule,
  isArray,
  isBoolean,
  isDate,
  isFunction,
  isIterable,
  isNumber,
  isObject,
  isRegExp,
  isString,
  isTuple,
  kde,
  key,
  lcg,
  lerp,
  lineHeight,
  linear,
  loader,
  locale,
  loess,
  log,
  logger,
  lognormal,
  lruCache,
  markup,
  merge,
  mergeConfig,
  mixture,
  multiLineOffset,
  numberFormatDefaultLocale,
  one,
  pad,
  panLinear,
  panLog,
  panPow,
  panSymlog,
  parse,
  parse2,
  parser,
  pathEqual,
  pathRender,
  peek,
  pickVisit,
  point,
  poly,
  pow,
  projection,
  quad,
  quantileLogNormal,
  quantileNormal,
  quantileUniform,
  quantiles,
  quantizeInterpolator,
  quarter,
  quartiles,
  random,
  read,
  renderModule,
  repeat,
  resetDefaultLocale,
  resetSVGClipId,
  resetSVGDefIds,
  responseType,
  sampleCurve,
  sampleLogNormal,
  sampleNormal,
  sampleUniform,
  scale,
  sceneEqual,
  sceneFromJSON,
  sceneToJSON,
  scheme,
  serializeXML,
  setHybridRendererOptions,
  setRandom,
  span,
  splitAccessPath,
  symbols,
  textMetrics,
  timeFloor,
  timeFormatDefaultLocale,
  timeInterval,
  timeOffset,
  timeSequence,
  timeUnitSpecifier,
  timeUnits,
  toBoolean,
  toDate,
  toNumber,
  toSet,
  toString,
  transform,
  transforms,
  truncate,
  truthy,
  tupleid,
  typeParsers,
  uniform,
  utcFloor,
  utcInterval,
  utcOffset,
  utcSequence,
  utcdayofyear,
  utcquarter,
  utcweek,
  version,
  vg_rect,
  vg_trail,
  visit,
  visitArray,
  week,
  writeConfig,
  zero,
  zoomLinear,
  zoomLog,
  zoomPow,
  zoomSymlog,
  zorder
} from "./chunk-DYS7S53I.js";
import {
  path
} from "./chunk-5UQBLVOX.js";
import "./chunk-ODXH2HTY.js";
import "./chunk-43HP4RIT.js";
import "./chunk-ENM4PJ22.js";
import "./chunk-H3PJCI32.js";
import "./chunk-ZS7NZCD4.js";
export {
  Bounds,
  CanvasHandler,
  CanvasRenderer,
  DATE,
  DAY,
  DAYOFYEAR,
  Dataflow,
  Debug,
  Error$1 as Error,
  EventStream,
  Gradient,
  GroupItem,
  HOURS,
  Handler,
  HybridHandler,
  HybridRenderer,
  Info,
  Item,
  MILLISECONDS,
  MINUTES,
  MONTH,
  Marks,
  MultiPulse,
  None,
  Operator,
  Parameters,
  Pulse,
  QUARTER,
  RenderType,
  Renderer,
  ResourceLoader,
  SECONDS,
  SVGHandler,
  SVGRenderer,
  SVGStringRenderer,
  Scenegraph,
  TIME_UNITS,
  Transform,
  View,
  WEEK,
  Warn,
  YEAR,
  accessor,
  accessorFields,
  accessorName,
  array,
  ascending,
  estimateBandwidth as bandwidthNRD,
  bin2 as bin,
  bootstrapCI,
  boundClip,
  boundContext,
  boundItem,
  boundMark,
  boundStroke,
  changeset,
  clampRange,
  codegen as codegenExpression,
  compare,
  constant,
  cumulativeLogNormal,
  cumulativeNormal,
  cumulativeUniform,
  dayofyear,
  debounce,
  defaultLocale,
  definition,
  densityLogNormal,
  densityNormal,
  densityUniform,
  domChild,
  domClear,
  domCreate,
  domFind,
  dotbin,
  error,
  expressionFunction,
  extend,
  extent,
  extentIndex,
  falsy,
  fastmap,
  field,
  flush,
  font,
  fontFamily,
  fontSize,
  format,
  numberFormatDefaultLocale as formatLocale,
  formats,
  has as hasOwnProperty,
  id,
  identity,
  inferType,
  inferTypes,
  ingest$1 as ingest,
  inherits,
  inrange,
  interpolate,
  interpolateColors,
  interpolateRange,
  intersect,
  intersectBoxLine,
  intersectPath,
  intersectPoint,
  intersectRule,
  isArray,
  isBoolean,
  isDate,
  isFunction,
  isIterable,
  isNumber,
  isObject,
  isRegExp,
  isString,
  isTuple,
  key,
  lerp,
  lineHeight,
  loader,
  locale,
  logger,
  lruCache,
  markup,
  merge,
  mergeConfig,
  multiLineOffset,
  one,
  pad,
  panLinear,
  panLog,
  panPow,
  panSymlog,
  parse2 as parse,
  parser as parseExpression,
  eventSelector as parseSelector,
  path,
  curves as pathCurves,
  pathEqual,
  parse as pathParse,
  vg_rect as pathRectangle,
  pathRender,
  symbols as pathSymbols,
  vg_trail as pathTrail,
  peek,
  point,
  projection,
  quantileLogNormal,
  quantileNormal,
  quantileUniform,
  quantiles,
  quantizeInterpolator,
  quarter,
  quartiles,
  random,
  integer as randomInteger,
  kde as randomKDE,
  lcg as randomLCG,
  lognormal as randomLogNormal,
  mixture as randomMixture,
  gaussian as randomNormal,
  uniform as randomUniform,
  read,
  constant2 as regressionConstant,
  exp as regressionExp,
  linear as regressionLinear,
  loess as regressionLoess,
  log as regressionLog,
  poly as regressionPoly,
  pow as regressionPow,
  quad as regressionQuad,
  renderModule,
  repeat,
  resetDefaultLocale,
  resetSVGClipId,
  resetSVGDefIds,
  responseType,
  context as runtimeContext,
  sampleCurve,
  sampleLogNormal,
  sampleNormal,
  sampleUniform,
  scale,
  sceneEqual,
  sceneFromJSON,
  pickVisit as scenePickVisit,
  sceneToJSON,
  visit as sceneVisit,
  zorder as sceneZOrder,
  scheme,
  serializeXML,
  setHybridRendererOptions,
  setRandom,
  span,
  splitAccessPath,
  $ as stringValue,
  textMetrics,
  bin as timeBin,
  timeFloor,
  timeFormatDefaultLocale as timeFormatLocale,
  timeInterval,
  timeOffset,
  timeSequence,
  timeUnitSpecifier,
  timeUnits,
  toBoolean,
  toDate,
  toNumber,
  toSet,
  toString,
  transform,
  transforms,
  truncate,
  truthy,
  tupleid,
  typeParsers,
  utcFloor,
  utcInterval,
  utcOffset,
  utcSequence,
  utcdayofyear,
  utcquarter,
  utcweek,
  version,
  visitArray,
  week,
  writeConfig,
  zero,
  zoomLinear,
  zoomLog,
  zoomPow,
  zoomSymlog
};
//# sourceMappingURL=vega.js.map
