var os = require('os'),
    bytes = require('bytes'),
    spark = require('textspark'),
    colors = require('tmux-colors');

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function bar(opts) {
  var ratio = opts.current / opts.total,
      width = opts.width || 10,
      complete = Array(Math.round(width * ratio)).join('='),
      incomplete = Array(width - complete.length).join(' ');

  return complete + incomplete;
}

function replace(result, opts) {
  Object.keys(opts).sort(function(a, b) {
      // sort so that we match the longest strings first
      return b.length - a.length;
    }).forEach(function(key) {
      if (key != 'format') {
        result = result.replace(new RegExp(escapeRegExp(':' + key), 'g'), opts[key]);
      }
    });
  return result;
}

function active(percent){
  var color = 'green',
      colorsList = [ 'red', 'yellow', 'green' ];
  [ 75, 50, 25 ].some(function(threshold, i) {
    color = colorsList[i];
    return percent > threshold;
  });
  return color;
}

module.exports = function(fmt, width, tty, enableColor) {
  var avg = os.loadavg(),
      cpus = Object.keys(os.cpus()).length,
      percentage = avg.map(function(i) {
        return ((i / cpus) * 100).toFixed(0);
      });

  avg = avg.map(function(i) {
    return i.toFixed(2);
  });

  var opts = {
    load: avg[0],
    load5: avg[1],
    load15: avg[2],
    percent: percentage[0] + '%',
    percent5: percentage[1] + '%',
    percent15: percentage[2] + '%',
    color: active(percentage[0]),
    color5: active(percentage[1]),
    color15: active(percentage[2]),
    bar: bar({ current: percentage[0], total: 100, width: width }),
    bar5: bar({ current: percentage[1], total: 100, width: width }),
    bar15: bar({ current: percentage[2], total: 100, width: width }),
    spark: spark([0, percentage[0], 100])[1],
    spark5: spark([0, percentage[1], 100])[1],
    spark15: spark([0, percentage[2], 100])[1]
  };

  console.log(colors(replace(fmt, opts), { tty: tty, color: enableColor}));
};
