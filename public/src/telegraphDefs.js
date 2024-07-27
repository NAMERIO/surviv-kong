"use strict";


var Effects = {
    'arrow': {
        type: 'telegraph',
        name: 'Arrow Telegraphing',
        small: {
            head: {
                sprite: 'img/skills/s_arrow_head_skill_telegraph.svg',
                rot: 1.5708
            },
            body: {
                sprite: 'img/skills/s_arrow_body_skill_telegraph.svg',
                rot: 1.5708
            }
        },
        medium: {
            head: {
                sprite: 'img/skills/m_arrow_head_skill_telegraph.svg',
                rot: 1.5708
            },
            body: {
                sprite: 'img/skills/m_arrow_body_skill_telegraph.svg',
                rot: 1.5708
            }
        },
        large: {
            head: {
                sprite: 'img/skills/l_arrow_head_skill_telegraph.svg',
                rot: 1.5708
            },
            body: {
                sprite: 'img/skills/l_arrow_body_skill_telegraph.svg',
                rot: 1.5708
            }
        },
        followDir: true
    },
    'circular': {
        type: 'telegraph',
        name: 'Range Telegraphing',
        sprites: [{
            sprite: 'img/skills/circular_telegraph_body.svg',
            textureScale: 10
        }],
        followDir: true
    }
};

module.exports = Effects;
