"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require("./questDefs.js"),
    kQuestDefs = _require.kQuestDefs,
    EnumQuests = _require.EnumQuests;

var CurrentQuests = function () {
    function CurrentQuests() {
        (0, _classCallCheck3.default)(this, CurrentQuests);

        this.clientProgress = [0, 0, 0];
    }

    (0, _createClass3.default)(CurrentQuests, [{
        key: 'resetClientProgress',
        value: function resetClientProgress() {
            this.clientProgress = [0, 0, 0];
        }
    }, {
        key: 'updateQuests',
        value: function updateQuests(questsInfo, quests) {
            for (var i = 0; i < quests.length; i++) {
                var quest = quests[i];
                //let progress = quest.data.progress;
                switch (quest.data.type) {
                    case 'quest_survived':
                        {
                            var info = questsInfo.find(function (questI) {
                                return questI.type == EnumQuests.killPlayers;
                            }) || null;
                            var timeSurvived = 0;
                            if (info) timeSurvived = info.progress || 0;
                            if (timeSurvived > this.clientProgress[i]) {
                                quest.data.progress += timeSurvived - this.clientProgress[i] || 0;
                                this.clientProgress[i] = timeSurvived;
                            }
                            break;
                        }
                    case 'quest_kill_skeletos':
                        {
                            var _info = questsInfo.find(function (questI) {
                                return questI.type == EnumQuests.killSkeletos;
                            }) || null;
                            var kills = 0;
                            if (_info) kills = _info.progress || 0;
                            if (kills > this.clientProgress[i]) {
                                quest.data.progress += kills - this.clientProgress[i] || 0;
                                this.clientProgress[i] = kills;
                            }
                            break;
                        }
                    case 'quest_kill_orcs':
                        {
                            var _info2 = questsInfo.find(function (questI) {
                                return questI.type == EnumQuests.killOrcs;
                            }) || null;
                            var _kills = 0;
                            if (_info2) _kills = _info2.progress || 0;
                            if (_kills > this.clientProgress[i]) {
                                quest.data.progress += _kills - this.clientProgress[i] || 0;
                                this.clientProgress[i] = _kills;
                            }
                            break;
                        }
                    case 'quest_kill_ghost_elf':
                        {
                            var _info3 = questsInfo.find(function (questI) {
                                return questI.type == EnumQuests.killGhostElf;
                            }) || null;
                            var _kills2 = 0;
                            if (_info3) _kills2 = _info3.progress || 0;
                            if (_kills2 > this.clientProgress[i]) {
                                quest.data.progress += _kills2 - this.clientProgress[i] || 0;
                                this.clientProgress[i] = _kills2;
                            }
                            break;
                        }
                    case 'quest_kill_players':
                        {
                            var _info4 = questsInfo.find(function (questI) {
                                return questI.type == EnumQuests.killPlayers;
                            }) || null;
                            var _kills3 = 0;
                            if (_info4) _kills3 = _info4.progress || 0;
                            if (_kills3 > this.clientProgress[i]) {
                                quest.data.progress += _kills3 - this.clientProgress[i] || 0;
                                this.clientProgress[i] = _kills3;
                            }
                            break;
                        }
                    case 'quest_crates':
                        {
                            var _info5 = questsInfo.find(function (questI) {
                                return questI.type == EnumQuests.destroyCrates;
                            }) || null;
                            var obstacleDestroyed = 0;
                            if (_info5) obstacleDestroyed = _info5.progress || 0;
                            if (obstacleDestroyed > this.clientProgress[i]) {
                                quest.data.progress += obstacleDestroyed - this.clientProgress[i] || 0;
                                this.clientProgress[i] = obstacleDestroyed;
                            }
                            break;
                        }
                    case 'quest_furniture':
                        {
                            var _info6 = questsInfo.find(function (questI) {
                                return questI.type == EnumQuests.destroyFurniture;
                            }) || null;
                            var _obstacleDestroyed = 0;
                            if (_info6) _obstacleDestroyed = _info6.progress || 0;
                            if (_obstacleDestroyed > this.clientProgress[i]) {
                                quest.data.progress += _obstacleDestroyed - this.clientProgress[i] || 0;
                                this.clientProgress[i] = _obstacleDestroyed;
                            }
                            break;
                        }
                    /*case 'quest_damage': {                
                        let info = questsInfo.find(questI => questI.type == '1') || null;
                        let damage = 0;
                        if(info)
                            damage=info.progress || 0;
                        if(damage>this.clientProgress[i]){
                            quest.data.progress += (damage - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = damage;
                        }
                        break;
                    }
                    case 'quest_damage_grenade': {
                        let info = questsInfo.find(questI => questI.type == '7') || null; // throwable
                        let weapDamage = 0;
                        if(info)
                            weapDamage=info.progress || 0;
                        if(weapDamage>this.clientProgress[i]){
                            quest.data.progress += (weapDamage - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = weapDamage;
                        }
                        break;
                    }
                    case 'quest_damage_melee': {
                        let info = questsInfo.find(questI => questI.type == '8') || null; // melee
                        let weapDamage = 0;
                        if(info)
                            weapDamage=info.progress || 0;
                        if(weapDamage>this.clientProgress[i]){
                            quest.data.progress += (weapDamage - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = weapDamage;
                        }
                        break;
                    }
                    case 'quest_heal': {
                        let info = questsInfo.find(questI => questI.type == '9') || null; // bandage healthkit
                        let itemUsed = 0;
                        if(info)
                            itemUsed=info.progress || 0;
                        if(itemUsed>this.clientProgress[i]){
                            quest.data.progress += (itemUsed - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = itemUsed;
                        }
                        break;
                    }
                    case 'quest_boost': {
                        let info = questsInfo.find(questI => questI.type == '10') || null; // soda painkiller chocolateBox
                        let itemUsed = 0;
                        if(info)
                            itemUsed=info.progress || 0;
                        if(itemUsed>this.clientProgress[i]){
                            quest.data.progress += (itemUsed - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = itemUsed;
                        }
                        break;
                    }
                    case 'quest_airdrop': {
                        let info = questsInfo.find(questI => questI.type == '11') || null; // airdrop
                        let itemUsed = 0;
                        if(info)
                            itemUsed=info.progress || 0;                
                        if(itemUsed>this.clientProgress[i]){
                            quest.data.progress += (itemUsed - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = itemUsed;
                        }
                        break;
                    }*/
                    /*
                    case 'quest_toilets': {
                        let info = questsInfo.find(questI => questI.type == '13') || null; // toilet
                        let obstacleDestroyed = 0;
                        if(info)
                            obstacleDestroyed=info.progress || 0;
                        if(obstacleDestroyed>this.clientProgress[i]){
                            quest.data.progress += (obstacleDestroyed - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = obstacleDestroyed;
                        }
                        break;
                    }
                    case 'quest_barrels': {
                        let info = questsInfo.find(questI => questI.type == '15') || null; // barrel
                        let obstacleDestroyed = 0;
                        if(info)
                            obstacleDestroyed=info.progress || 0;
                        if(obstacleDestroyed>this.clientProgress[i]){
                            quest.data.progress += (obstacleDestroyed - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = obstacleDestroyed;
                        }
                        break;
                    }
                    case 'quest_lockers': {
                        let info = questsInfo.find(questI => questI.type == '16') || null; // locker
                        let obstacleDestroyed = 0;
                        if(info)
                            obstacleDestroyed=info.progress || 0;
                        if(obstacleDestroyed>this.clientProgress[i]){
                            quest.data.progress += (obstacleDestroyed - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = obstacleDestroyed;
                        }
                        break;
                    }
                    case 'quest_pots': {
                        let info = questsInfo.find(questI => questI.type == '17') || null; // pot
                        let obstacleDestroyed = 0;
                        if(info)
                            obstacleDestroyed=info.progress || 0;
                        if(obstacleDestroyed>this.clientProgress[i]){
                            quest.data.progress += (obstacleDestroyed - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = obstacleDestroyed;
                        }
                        break;
                    }
                    case 'quest_vending': {
                        let info = questsInfo.find(questI => questI.type == '18') || null; // vending
                        let obstacleDestroyed = 0;
                        if(info)
                            obstacleDestroyed=info.progress || 0;
                        if(obstacleDestroyed>this.clientProgress[i]){
                            quest.data.progress += (obstacleDestroyed - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = obstacleDestroyed;
                        }
                        break;
                    }
                    case 'quest_club_kills': {                
                        let info = questsInfo.find(questI => questI.type == '19') || null;
                        let clubkills = 0;
                        if(info)
                            clubkills=info.progress || 0;
                        if(clubkills>this.clientProgress[i]){
                            quest.data.progress += (clubkills - this.clientProgress[i]) || 0;
                            this.clientProgress[i] = clubkills;
                        }
                        break;
                    }
                    case 'quest_top_solo': {
                        let info = questsInfo.find(questI => questI.type == '20') || null;
                        let top = 50;
                        if(info)
                            top=info.progress || 0;
                        if (top == 10) {
                            quest.data.progress = top || 0;
                        }
                        this.clientProgress[i] = top;
                        break;
                    }
                    case 'quest_top_duo': {
                        let info = questsInfo.find(questI => questI.type == '21') || null;
                        let top = 50;
                        if(info)
                            top=info.progress || 0;
                        if (top == 8) {
                            quest.data.progress = top || 0;
                        }
                        this.clientProgress[i] = top;
                        break;
                    }
                    case 'quest_top_squad': {
                        let info = questsInfo.find(questI => questI.type == '22') || null;
                        let top = 50;
                        if(info)
                            top=info.progress || 0;
                        if (top == 5) {
                            quest.data.progress = top || 0;
                        }
                        this.clientProgress[i] = top;
                        break;
                    }*/
                    default:
                        break;
                }

                //this.clientProgress[i] = quest.data.progress;
                quest.data.progress = Math.floor(quest.data.progress);
            }

            return quests;
        }
    }]);
    return CurrentQuests;
}();

module.exports = CurrentQuests;
