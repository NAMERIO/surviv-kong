"use strict";


var PassDefs = require("./passDefs.js");

var kPassMaxLevel = 99;
var kRefreshHour = 0; //UTC Hour

var NODE_ENV = "production";

var passUtil = {
    getPassMaxLevel: function getPassMaxLevel() {
        return kPassMaxLevel;
    },

    getTimeWhenQuestsRefresh: function getTimeWhenQuestsRefresh() {
        //Daily refresh
        var dateNow = new Date(Date.now());
        var today = dateNow.getUTCDate();
        var hourNow = dateNow.getUTCHours();

        var refreshTime = new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), today);
        refreshTime.setUTCHours(kRefreshHour);
        //Set 0 in UTC
        refreshTime.setUTCMinutes(0);
        refreshTime.setUTCSeconds(0);
        //If the refresh time is 0, then when we set the UTC hours to 0, sometimes it falls back a day.
        //Let's re-set the date to make sure we don't keep falling back.
        refreshTime.setUTCDate(dateNow.getUTCDate());
        if (hourNow >= kRefreshHour) {
            //What happens here if are on the last day of the month? Will it update correctly, or will we get negative time, causing spamming again?
            refreshTime.setUTCDate(refreshTime.getUTCDate() + 1);
        }

        return refreshTime;
    },


    getPassLevelXp: function getPassLevelXp(passType, level) {
        var passDef = PassDefs[passType];

        var levelIdx = level - 1;
        return levelIdx < passDef.xp.length ? passDef.xp[levelIdx] : passDef.xp[passDef.xp.length - 1];
    },

    getPassLevelAndXp: function getPassLevelAndXp(passType, passXp) {
        var xp = passXp;
        var level = 1;
        while (level < kPassMaxLevel) {
            var levelXp = passUtil.getPassLevelXp(passType, level);
            if (xp >= levelXp) {
                xp -= levelXp;
                level++;
            } else {
                break;
            }
        }
        var nextLevelXp = passUtil.getPassLevelXp(passType, level);

        return { level: level, xp: xp, nextLevelXp: nextLevelXp };
    },

    timeUntilQuestRefresh: function timeUntilQuestRefresh(timeAcquired) {
        //Daily refresh
        var dateNowMS = Date.now();
        var diffTimeMS = dateNowMS - timeAcquired;
        var date = new Date(timeAcquired);
        var dayAcquired = date.getUTCDate();
        var hourAcquired = date.getUTCHours();

        var dateNow = new Date(dateNowMS);
        var today = dateNow.getUTCDate();
        var hourNow = dateNow.getUTCHours();

        var refreshTime = new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dayAcquired);
        refreshTime.setUTCHours(kRefreshHour);
        //Set 0 in UTC
        refreshTime.setUTCMinutes(0);
        refreshTime.setUTCSeconds(0);
        if (dayAcquired == today && (hourNow > kRefreshHour || hourNow == kRefreshHour && hourAcquired >= kRefreshHour)) refreshTime.setUTCDate(refreshTime.getUTCDate() + 1);

        var msRefreshTime = refreshTime.getTime() - dateNowMS;
        return msRefreshTime;
    }
};

module.exports = passUtil;
