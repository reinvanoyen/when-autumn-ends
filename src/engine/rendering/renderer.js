"use strict";

const ECS = require('yagl-ecs'),
	PIXI = require('pixi.js'),
	filters = require('pixi-filters'),
	Ambient = require('./filter/ambient'),
	WorldTime = require('../world/world-time')
;

class Renderer extends ECS.System {

	constructor(stage, width, height) {
		super();
		this.stage = stage;
		this.ambient = new Ambient();
		this.worldTime = new WorldTime();
		this.stage.filters = [ this.ambient ];
		this.width = width;
		this.height = height;
	}

	test(entity) {
		return entity.components.position && entity.components.sprite;
	}

	enter(entity) {

		let {sprite} = entity.components;

		entity.sprite = new PIXI.Sprite( PIXI.Texture.fromImage( sprite.src ) );

		entity.sprite.width = sprite.width;
		entity.sprite.height = sprite.height;

		entity.sprite.anchor.x = sprite.anchor[0];
		entity.sprite.anchor.y = sprite.anchor[1];

		if( entity.components.debug ) {

			entity.debugText = new PIXI.Text( '', {
				fontSize: '11px',
				fontFamily: 'Monospace',
				fill : 0xff1010,
				align : 'left'
			} );

			this.stage.addChild( entity.debugText );
		}

		this.stage.addChild( entity.sprite );
	}

	postUpdate() {
		this.worldTime.tick();
		this.ambient.ambientColor = this.worldTime.getDayAmbientColor();
	}

	update(entity) {

		let {position} = entity.components;

		entity.sprite.position.x = position.value[0];
		entity.sprite.position.y = position.value[1];

		if( entity.components.camera ) {

			this.stage.position.x = -position.value[0] + ( this.width / 2 );
			this.stage.position.y = -position.value[1] + ( this.height / 2 );
		}

		if( entity.components.debug ) {

			entity.debugText.text = 'x: ' + parseInt(position.value[0]) + ', y: ' + parseInt(position.value[1]);

			entity.debugText.position.x = position.value[0];
			entity.debugText.position.y = position.value[1];
		}
	}

	exit(entity) {}
}

module.exports = Renderer;