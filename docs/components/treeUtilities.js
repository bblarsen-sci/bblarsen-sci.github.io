// function to parse newick trees adopted from jason davies https://github.com/jasondavies/newick.js/
import * as d3 from 'd3';

export function parseNewick(a) {
  var e = [],
    r = {},
    s = a.split(/\s*(\;|\(|\)|,|:)\s*/);
  for (var t = 0; t < s.length; t++) {
    var n = s[t];
    switch (n) {
      case "(":
        var c = {};
        r.branchset = [c];
        e.push(r);
        r = c;
        break;
      case ",":
        var c = {};
        e[e.length - 1].branchset.push(c);
        r = c;
        break;
      case ")":
        r = e.pop();
        break;
      case ":":
        break;
      default:
        var h = s[t - 1];
        if (h === ")" || h === "(" || h === ",") {
          const nameAndCountry = n.split(/\[|\]/);
          r.name = nameAndCountry[0];
          r.country = nameAndCountry[1];
        } else if (h === ":") {
          r.branchLength = parseFloat(n);
        }
    }
  }
  return r;
}

export function projection(d) {
  // reversed projection - horizontal tree instead of vertical
  return [parseInt(d.y), parseInt(d.x)];
}

// Calculates the path to make the tree branches at 90° angles
export function diagonal(diagonalPath, i) {
  var source = diagonalPath.source,
    target = diagonalPath.target,
    pathData = [source, { x: target.x, y: source.y }, target].map(projection);

  return "M" + pathData[0] + ' ' + pathData[1] + " " + pathData[2];
}

export function scaleBranchLengths(nodes, w) {
  function visitPreOrder(root, callback) {
    callback(root)
    if (root.children) {
      for (var i = root.children.length - 1; i >= 0; i--) {
        visitPreOrder(root.children[i], callback)
      };
    }
  }
  visitPreOrder(nodes[0], function (node) {
    if (node.value < 0) node.value = -1 * node.value;
    node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.value || 0)
  });

  var rootDists = Array.from(nodes, function (n) {
    return n.rootDist;
  });

  var yscale = d3.scaleLinear()
    .domain([0, d3.max(rootDists)])
    .range([0, w]);

  visitPreOrder(nodes[0], function (node) {
    node.y = parseInt(yscale(node.rootDist));
  });
  return yscale
}


