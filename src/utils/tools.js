var sha256 = function() {
    for (var e, u = 18, c = [], i = []; 1 < u; u--)
        for (e = u; e < 320; )
            c[e += u] = 1;
    function a(r, n) {
        return 4294967296 * Math.pow(r, 1 / n) | 0
    }
    for (e = 0; e < 64; )
        c[++u] || (i[e] = a(u, 2),
        c[e++] = a(u, 3));
    function h(r, n) {
        return r >>> n | r << -n
    }
    return function(r) {
        var n = i.slice(u = e = 0, 8)
          , o = []
          , t = unescape(encodeURI(r)) + ""
          , f = t.length;
        for (o[r = --f / 4 + 2 | 15] = 8 * f; ~f; )
            o[f >> 2] |= t.charCodeAt(f) << 8 * ~f--;
        for (f = []; u < r; u += 16) {
            for (a = n.slice(); e < 64; a.unshift(t + (h(t = a[0], 2) ^ h(t, 13) ^ h(t, 22)) + (t & a[1] ^ a[1] & a[2] ^ a[2] & t)))
                a[3] += t = 0 | (f[e] = e < 16 ? ~~o[e + u] : (h(t = f[e - 2], 17) ^ h(t, 19) ^ t >>> 10) + f[e - 7] + (h(t = f[e - 15], 7) ^ h(t, 18) ^ t >>> 3) + f[e - 16]) + a.pop() + (h(t = a[4], 6) ^ h(t, 11) ^ h(t, 25)) + (t & a[5] ^ ~t & a[6]) + c[e++];
            for (e = 8; e; )
                n[--e] += a[e]
        }
        for (t = ""; e < 64; )
            t += (n[e >> 3] >> 4 * (7 - e++) & 15).toString(16);
        return t
    }
}();

export default sha256