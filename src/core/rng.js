// 시드 고정 가능한 난수 (테스트 재현용). mulberry32
(function (root) {
  function Rng(seed) {
    this.seed = (seed === undefined) ? (Date.now() >>> 0) : (seed >>> 0);
    this._s = this.seed;
  }
  Rng.prototype.next = function () {
    var t = (this._s += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  Rng.prototype.int = function (min, max) { // [min, max]
    return min + Math.floor(this.next() * (max - min + 1));
  };
  Rng.prototype.chance = function (p) { return this.next() < p; };
  Rng.prototype.pick = function (arr) { return arr[Math.floor(this.next() * arr.length)]; };
  Rng.prototype.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(this.next() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  Rng.prototype.weighted = function (weights) { // {key: weight}
    var keys = Object.keys(weights), total = 0, i;
    for (i = 0; i < keys.length; i++) total += weights[keys[i]];
    var r = this.next() * total;
    for (i = 0; i < keys.length; i++) {
      r -= weights[keys[i]];
      if (r < 0) return keys[i];
    }
    return keys[keys.length - 1];
  };
  root.Rng = Rng;
})(typeof window !== 'undefined' ? window : globalThis);
