/* HikeMath engine - when will you actually be back. Pure math, no DOM. */
(function (root) {
  'use strict';

  function num(v, name) {
    var n = typeof v === 'string' ? parseFloat(v) : v;
    if (typeof n !== 'number' || !isFinite(n) || isNaN(n)) throw new Error(name + ' must be a number');
    return n;
  }
  function round2(x) { return Math.round(x * 100) / 100; }

  // Naismith's rule: 1 hr per 5 km + 30 min per 300 m ascent.
  // Langmuir descent tweak: ~5 min per 300 m on the way down (steep descents slow you).
  function baseHours(distanceKm, ascentM, descentM) {
    var flat = distanceKm / 5;
    var climb = (ascentM / 300) * 0.5;
    var down = (descentM / 300) * (5 / 60);
    return flat + climb + down;
  }

  function analyze(o) {
    if (!o || typeof o !== 'object') throw new Error('options required');
    var distanceKm = num(o.distanceKm === undefined ? 12 : o.distanceKm, 'distanceKm');
    if (distanceKm <= 0 || distanceKm > 100) throw new Error('distanceKm must be in (0, 100]');
    var ascentM = num(o.ascentM === undefined ? 600 : o.ascentM, 'ascentM');
    if (ascentM < 0 || ascentM > 6000) throw new Error('ascentM must be in [0, 6000]');
    var descentM = num(o.descentM === undefined ? ascentM : o.descentM, 'descentM');
    if (descentM < 0 || descentM > 6000) throw new Error('descentM must be in [0, 6000]');
    var fitness = num(o.fitness === undefined ? 1 : o.fitness, 'fitness');
    if (fitness < 0.7 || fitness > 1.5) throw new Error('fitness must be in [0.7, 1.5]');
    var packKg = num(o.packKg === undefined ? 8 : o.packKg, 'packKg');
    if (packKg < 0 || packKg > 40) throw new Error('packKg must be in [0, 40]');
    var breaksMin = num(o.breaksMin === undefined ? 30 : o.breaksMin, 'breaksMin');
    if (breaksMin < 0 || breaksMin > 300) throw new Error('breaksMin must be in [0, 300]');
    var daylightHrs = o.daylightHrs === undefined ? null : num(o.daylightHrs, 'daylightHrs');
    if (daylightHrs !== null && (daylightHrs <= 0 || daylightHrs > 24)) throw new Error('daylightHrs must be in (0, 24]');

    var base = baseHours(distanceKm, ascentM, descentM);
    // Pack penalty: +2% per kg above 8 kg (light packs are free).
    var packPenalty = Math.max(0, packKg - 8) * 0.02;
    var movingHrs = base * fitness * (1 + packPenalty);
    var totalHrs = movingHrs + breaksMin / 60;

    var effort = distanceKm + ascentM / 100; // distance + 1 km per 100 m climbed
    var grade = effort < 8 ? 'easy' : effort < 16 ? 'moderate' : effort < 24 ? 'hard' : 'savage';

    var paceMinKm = movingHrs * 60 / distanceKm;
    var margin = daylightHrs === null ? null : round2(daylightHrs - totalHrs);

    return {
      movingHrs: round2(movingHrs),
      totalHrs: round2(totalHrs),
      paceMinKm: round2(paceMinKm),
      effort: round2(effort),
      grade: grade,
      packPenaltyPct: round2(packPenalty * 100),
      breakHrs: round2(breaksMin / 60),
      daylightMarginHrs: margin,
      daylightOk: margin === null ? null : margin >= 0,
      turnaroundHrs: daylightHrs === null ? null : round2(daylightHrs / 2)
    };
  }

  var api = { analyze: analyze, baseHours: baseHours };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.HikeMathEngine = api;
})(typeof self !== 'undefined' ? self : this);
