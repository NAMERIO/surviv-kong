"use strict";


var CurrDefs = {
    'squad_boost': {
        xpMult: [0, 10, 20, 50]
    },

    'ftue_steps': {
        steps: [{
            tooltipText: 'ftue-inst-1',
            image: "../img/ftue/ftue_bubble.png",
            left: "20%",
            top: "56%",
            topArrow: false,
            downArrow: false,
            leftArrow: false,
            rightArrow: false,
            tooltipColor: '',
            showNext: false,
            modalBg: 'rgba(0, 0, 0, 0)',
            showTitle: false,
            enablePlayBtn: true,
            enableTooltip: true,
            showModal: false,
            title: 'ftue-title-3',
            autoStartBattle: false,
            close: false
        }, {
            tooltipText: 'ftue-inst-2',
            image: "../img/ftue/ftue_01.png",
            left: "38.5%",
            top: "21%",
            topArrow: false,
            downArrow: true,
            leftArrow: false,
            rightArrow: false,
            tooltipColor: '#874C90',
            showNext: true,
            modalBg: 'rgba(0, 0, 0, 1)',
            showTitle: true,
            enablePlayBtn: false,
            enableTooltip: false,
            showModal: false,
            mobileImg: "../img/ftue/ftue_01_mobile.png",
            mobileText: 'ftue-mobile-inst-1',
            title: 'ftue-title-1',
            autoStartBattle: false,
            close: false
        }, {
            tooltipText: 'ftue-inst-3',
            image: "../img/ftue/ftue_02.png",
            left: "57.5%",
            top: "20%",
            topArrow: false,
            downArrow: true,
            leftArrow: false,
            rightArrow: false,
            tooltipColor: '#874C90',
            showNext: true,
            modalBg: 'rgba(0, 0, 0, 1)',
            showTitle: true,
            enablePlayBtn: false,
            enableTooltip: false,
            showModal: false,
            title: 'ftue-title-1',
            autoStartBattle: false,
            close: false
        }, {
            tooltipText: 'ftue-inst-4',
            image: "../img/ftue/ftue_03.png",
            left: "59%",
            top: "37%",
            topArrow: false,
            downArrow: false,
            leftArrow: false,
            rightArrow: true,
            tooltipColor: '#874C90',
            showNext: true,
            modalBg: 'rgba(0, 0, 0, 1)',
            showTitle: true,
            enablePlayBtn: false,
            enableTooltip: false,
            showModal: false,
            title: 'ftue-title-1',
            autoStartBattle: false,
            mobileImg: "../img/ftue/ftue_03_mobile.png",
            mobileText: 'ftue-mobile-inst-2'
        }, {
            tooltipText: 'ftue-inst-5',
            image: "../img/ftue/ftue_04.png",
            left: "59%",
            top: "37%",
            topArrow: false,
            downArrow: false,
            leftArrow: false,
            rightArrow: true,
            tooltipColor: '#874C90',
            showNext: true,
            nextText: "ftue-got-it",
            modalBg: 'rgba(0, 0, 0, 1)',
            showTitle: true,
            enablePlayBtn: false,
            enableTooltip: false,
            showModal: false,
            title: 'ftue-title-1',
            autoStartBattle: true,
            mobileImg: "../img/ftue/ftue_03_mobile.png",
            mobileText: 'ftue-mobile-inst-2'
        }, {
            tooltipText: 'ftue-inst-1',
            image: "",
            left: "59%",
            top: "37%",
            topArrow: false,
            downArrow: false,
            leftArrow: false,
            rightArrow: true,
            tooltipColor: '#874C90',
            showNext: true,
            modalBg: 'rgba(0, 0, 0, 0.7)',
            showTitle: true,
            enablePlayBtn: false,
            enableTooltip: false,
            showModal: true,
            modaltitle: 'How to earn Gear',
            title: 'ftue-title-2',
            nextText: "ftue-got-it",
            autoStartBattle: false,
            close: false
        }, {
            tooltipText: 'ftue-inst-6',
            image: "../img/ftue/ftue_05.png",
            left: "59%",
            top: "37%",
            topArrow: false,
            downArrow: false,
            leftArrow: false,
            rightArrow: true,
            tooltipColor: '#874C90',
            showNext: true,
            modalBg: 'rgba(0, 0, 0, 1)',
            showTitle: true,
            enablePlayBtn: false,
            enableTooltip: false,
            showModal: false,
            title: 'ftue-title-2',
            autoStartBattle: false,
            close: false,
            mobileImg: "../img/ftue/ftue_04_mobile.png",
            mobileText: 'ftue-mobile-inst-3'
        }, {
            tooltipText: 'ftue-inst-7',
            image: "../img/ftue/ftue_06.png",
            left: "59%",
            top: "37%",
            topArrow: false,
            downArrow: false,
            leftArrow: false,
            rightArrow: true,
            tooltipColor: '#874C90',
            showNext: true,
            modalBg: 'rgba(0, 0, 0, 1)',
            showTitle: true,
            enablePlayBtn: false,
            enableTooltip: false,
            showModal: false,
            title: 'ftue-title-2',
            nextText: "ftue-got-it",
            autoStartBattle: true,
            close: false
        }]
    },

    'discord_rp': {
        'main': {
            text: 'Classic',
            hover_text: 'Classic Mode',
            large_image: '768939756166971442'
        },

        'bitheroes-main': {
            text: 'Bitheroes New Map',
            hover_text: 'Bitheroes Mode',
            large_image: '768939756166971442'
        },

        'main_spring': {
            text: 'Spring',
            hover_text: 'Spring Mode',
            large_image: '768939756166971442'
        },

        'desert': {
            text: 'Desert',
            hover_text: 'Desert Mode',
            large_image: '768939756166971442'
        },

        'faction': {
            text: '50v50',
            hover_text: '50v50 Mode',
            large_image: '768939756166971442'
        },

        'halloween': {
            text: 'Halloween',
            hover_text: 'Halloween Mode',
            large_image: '768939756166971442'
        },

        'potato': {
            text: 'Potato',
            hover_text: 'Potato Mode',
            large_image: '768939756166971442'
        },

        'potato_spring': {
            text: 'Potato Spring',
            hover_text: 'Potato Mode',
            large_image: '768939756166971442'
        },

        'snow': {
            text: 'Snow',
            hover_text: 'Snow Mode',
            large_image: '768939756166971442'
        },

        'woods': {
            text: 'Woods',
            hover_text: 'Woods Mode',
            large_image: '768939756166971442'
        },

        'woods_snow': {
            text: 'Woods Snow',
            hover_text: 'Woods Snow Mode',
            large_image: '768939756166971442'
        },

        'woods_spring': {
            text: 'Woods Spring',
            hover_text: 'Woods Spring Mode',
            large_image: '768939756166971442'
        },

        'woods_summer': {
            text: 'Woods Summer',
            hover_text: 'Woods Summer Mode',
            large_image: '768939756166971442'
        },

        'savannah': {
            text: 'Savannah',
            hover_text: 'Savannah Mode',
            large_image: '768939756166971442'
        },

        'cobalt': {
            text: 'Cobalt',
            hover_text: 'Cobalt Mode',
            large_image: '768939756166971442'
        },

        'turkey': {
            text: 'Turkey',
            hover_text: 'Turkey Mode',
            large_image: '768939756166971442'
        },

        'valentine': {
            text: 'Frenemies',
            hover_text: 'Frenemies Mode',
            large_image: '768939756166971442'
        },

        'st_patrick': {
            text: 'Clover Field',
            hover_text: 'Clover Field Mode',
            large_image: '768939756166971442'
        },

        'cinco_de_mayo': {
            text: 'Sinko de ammo',
            hover_text: 'Sinko de ammo Mode',
            large_image: '768939756166971442'
        },

        'eggsplotion': {
            text: 'Eggsplosion',
            hover_text: 'Eggsplosion Mode',
            large_image: '768939756166971442'
        },

        'may_fourth': {
            text: 'Lasr Swrds',
            hover_text: 'Lasr Swrds Mode',
            large_image: '768939756166971442'
        },

        'ultimate_sacrifice': {
            text: 'Ultimate Sacrifice',
            hover_text: 'Ultimate Sacrifice Mode',
            large_image: '768939756166971442'
        },

        'storm': {
            text: 'Storm',
            hover_text: 'Storm Mode',
            large_image: '768939756166971442'
        },

        'beach': {
            text: 'Beach',
            hover_text: 'Beach Mode',
            large_image: '768939756166971442'
        },

        'contact': {
            text: 'Contact',
            hover_text: 'Contact Mode',
            large_image: '768939756166971442'
        },

        'inferno': {
            text: 'Inferno',
            hover_text: 'Inferno Mode',
            large_image: '768939756166971442'
        }

    }
};

module.exports = CurrDefs;
