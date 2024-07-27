module.exports = function anonymous(locals, filters, escape, rethrow) {
    escape = escape || function(html) {
        return String(html).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    };
    var __stack = {
        lineno: 1,
        input: '\n\n<div class="ui-stats-info-player">\n  <div class="table-container">\n    <div class=\'ui-stats-table\'>\n      <div class=\'ui-stats-header ui-stats-header-small\'>        \n        <div></div>\n        <div>battle</div>\n        <div>damage</div>\n        <div>damage</div>\n        <div>survival</div>\n      </div>\n      <div class=\'ui-stats-header\'>        \n        <div class="player-row">player <div class="ftue-results-modal ftue-spectate"><span class="ftue-results-text">Spectate</span><div class="arrow-down"></div></div></div>\n        <div>kills</div>\n        <div>done</div>\n        <div>taken</div>\n        <div>time</div>\n      </div>\n      <div class=\'ui-stats-table-content\'>\n        <% var isFirst = true; \n          players.forEach(function(player) { %>\n          <div id=\'ui-id-<%= player.playerId %>\' class=\'ui-stats-table-row <%= player.isMyStats ?  "ui-stats-current box-battle-results-current"  : "box-battle-results" %> <%= isFirst ?  "first-player-stats"  : "" %> <%= player.isMyKiller && !player.isMyStats ? "ui-stats-player-spectate-killer" : ""%> <%= player.hasGoldenBP ? "ui-stats-player-spectate-golden box-battle-results-gold" : ""%>\'>\n            <div>\n              <!--\n              <%  isFirst = false;\n              if(player.isMyKiller) {%>\n                 <div class=\'ui-stats-player-reticle\'></div> \n              <%} else {%> \n                <div class=\'ui-stats-player-rank\'>#<%= player.rank %></div> \n              <%}%>\n              -->\n              <div class=\'ui-stats-player-rank h6 font-outline-black\'><%= player.rank %></div> \n              <!--<div id=\'ui-stats-spec-id-<%= player.playerId %>\' class=\'ui-stats-player-icon\'></div>-->\n              <div id=\'ui-spectate-id-<%= player.playerId %>\' class=\'ui-stats-player-spectate <%= (player.rank != "?" || (isTeamAlive === 1 && player.isMyTeam === 0)) ? "game-battle-result-btn-darkened" : ""%> <%= player.isMyKiller ? "ui-stats-player-spectate-red killer" : ""%> <%= player.hasGoldenBP ? "gold-pass" : ""%>\'></div>\n              <!--This go inside class of ui-stats-id: <%= player.hasGoldenBP ?  " ui-stats-gbp"  : "" %>\'-->\n              <div id=\'ui-stats-id-<%= player.playerId %>\' class=\'ui-stats-player-name h6\'  ><%= player.name %></div>\n              \n            </div>\n            <div><%= player.kills %></div>\n            <div><%= player.damageDealt %></div>\n            <div><%= player.damageTaken %></div>\n            <div><%= player.timeAlive %></div>\n          </div>\n        <% }); %>\n      </div>\n    </div>\n  </div>\n</div>',
        filename: "."
    };
    function rethrow(err, str, filename, lineno) {
        var lines = str.split("\n"), start = Math.max(lineno - 3, 0), end = Math.min(lines.length, lineno + 3);
        var context = lines.slice(start, end).map(function(line, i) {
            var curr = i + start + 1;
            return (curr == lineno ? " >> " : "    ") + curr + "| " + line;
        }).join("\n");
        err.path = filename;
        err.message = (filename || "ejs") + ":" + lineno + "\n" + context + "\n\n" + err.message;
        throw err;
    }
    try {
        var buf = [];
        with (locals || {}) {
            (function() {
                buf.push('\n\n<div class="ui-stats-info-player">\n  <div class="table-container">\n    <div class=\'ui-stats-table\'>\n      <div class=\'ui-stats-header ui-stats-header-small\'>        \n        <div></div>\n        <div>battle</div>\n        <div>damage</div>\n        <div>damage</div>\n        <div>survival</div>\n      </div>\n      <div class=\'ui-stats-header\'>        \n        <div class="player-row">player <div class="ftue-results-modal ftue-spectate"><span class="ftue-results-text">Spectate</span><div class="arrow-down"></div></div></div>\n        <div>kills</div>\n        <div>done</div>\n        <div>taken</div>\n        <div>time</div>\n      </div>\n      <div class=\'ui-stats-table-content\'>\n        ');
                __stack.lineno = 21;
                var isFirst = true;
                players.forEach(function(player) {
                    buf.push("\n          <div id='ui-id-", escape((__stack.lineno = 23, player.playerId)), "' class='ui-stats-table-row ", escape((__stack.lineno = 23, player.isMyStats ? "ui-stats-current box-battle-results-current" : "box-battle-results")), " ", escape((__stack.lineno = 23, isFirst ? "first-player-stats" : "")), " ", escape((__stack.lineno = 23, player.isMyKiller && !player.isMyStats ? "ui-stats-player-spectate-killer" : "")), " ", escape((__stack.lineno = 23, player.hasGoldenBP ? "ui-stats-player-spectate-golden box-battle-results-gold" : "")), "'>\n            <div>\n              <!--\n              ");
                    __stack.lineno = 26;
                    isFirst = false;
                    if (player.isMyKiller) {
                        buf.push("\n                 <div class='ui-stats-player-reticle'></div> \n              ");
                        __stack.lineno = 29;
                    } else {
                        buf.push(" \n                <div class='ui-stats-player-rank'>#", escape((__stack.lineno = 30, player.rank)), "</div> \n              ");
                        __stack.lineno = 31;
                    }
                    buf.push("\n              -->\n              <div class='ui-stats-player-rank h6 font-outline-black'>", escape((__stack.lineno = 33, player.rank)), "</div> \n              <!--<div id='ui-stats-spec-id-", escape((__stack.lineno = 34, player.playerId)), "' class='ui-stats-player-icon'></div>-->\n              <div id='ui-spectate-id-", escape((__stack.lineno = 35, player.playerId)), "' class='ui-stats-player-spectate ", escape((__stack.lineno = 35, player.rank != "?" || isTeamAlive === 1 && player.isMyTeam === 0 ? "game-battle-result-btn-darkened" : "")), " ", escape((__stack.lineno = 35, player.isMyKiller ? "ui-stats-player-spectate-red killer" : "")), " ", escape((__stack.lineno = 35, player.hasGoldenBP ? "gold-pass" : "")), "'></div>\n              <!--This go inside class of ui-stats-id: ", escape((__stack.lineno = 36, player.hasGoldenBP ? " ui-stats-gbp" : "")), "'-->\n              <div id='ui-stats-id-", escape((__stack.lineno = 37, player.playerId)), "' class='ui-stats-player-name h6'  >", escape((__stack.lineno = 37, player.name)), "</div>\n              \n            </div>\n            <div>", escape((__stack.lineno = 40, player.kills)), "</div>\n            <div>", escape((__stack.lineno = 41, player.damageDealt)), "</div>\n            <div>", escape((__stack.lineno = 42, player.damageTaken)), "</div>\n            <div>", escape((__stack.lineno = 43, player.timeAlive)), "</div>\n          </div>\n        ");
                    __stack.lineno = 45;
                });
                buf.push("\n      </div>\n    </div>\n  </div>\n</div>");
            })();
        }
        return buf.join("");
    } catch (err) {
        rethrow(err, __stack.input, __stack.filename, __stack.lineno);
    }
}
