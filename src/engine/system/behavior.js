"use strict";

const ECS = require('yagl-ecs');
const Vector2 = require('gl-matrix').vec2;

class Behavior extends ECS.System {

  test(entity) {
    return entity.components.walkingbehavior;
  }

  update(entity) {

    let {walkingbehavior, body = false, collision = false} = entity.components;

    if (body && collision) {

      if (walkingbehavior.state === 'jumping' && collision.groundCollision) {

        Vector2.add(body.force, body.force, Vector2.fromValues(0, -8));

      } else if (walkingbehavior.state === 'walkingforward' && collision.groundCollision) {

        Vector2.add(body.force, body.force, Vector2.fromValues(4, 0));

        if (entity.components.sprite) {
          entity.sprite.scale.x = 1;
        }

      } else if (walkingbehavior.state === 'walkingbackward' && collision.groundCollision) {

        Vector2.add(body.force, body.force, Vector2.fromValues(-4, 0));

        if (entity.components.sprite) {
          if (entity.sprite.scale.x > 0) {
            entity.sprite.scale.x = -entity.sprite.scale.x;
          }
        }

      } else if (collision.groundCollision) {

        // let lerpedForce = Vector2.clone(body.force);
        // let lerpedVelocity = Vector2.clone(body.velocity);
        //
        // Vector2.lerp(lerpedForce, lerpedForce, Vector2.fromValues(0, 0), 1);
        // Vector2.lerp(lerpedVelocity, lerpedVelocity, Vector2.fromValues(0, 0), 1);
        //
        // body.force[0] = lerpedForce[0];
        // body.velocity[0] = lerpedVelocity[0];
      }
    }
  }
}

module.exports = Behavior;