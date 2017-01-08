"use strict";

const ECS = require('yagl-ecs'),
	PIXI = require('pixi.js'),
	filters = require('pixi-filters')
;

class Rendering extends ECS.System {

	constructor(stage, width, height) {
		super();
		this.stage = stage;
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
		entity.sprite.anchor.x = sprite.anchor.x;
		entity.sprite.anchor.y = sprite.anchor.y;

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

	update(entity) {

		let {position} = entity.components;

		entity.sprite.position.x = position.value.x;
		entity.sprite.position.y = position.value.y;

		if( entity.components.camera ) {

			this.stage.position.x = -position.value.x + ( this.width / 2 );
			this.stage.position.y = -position.value.y + ( this.height / 2 );
		}

		if( entity.components.debug ) {

			entity.debugText.text = 'x: ' + parseInt(position.value.x) + ', y: ' + parseInt(position.value.y);

			entity.debugText.position.x = position.value.x;
			entity.debugText.position.y = position.value.y;
		}
	}

	exit(entity) {}
}

module.exports = Rendering;