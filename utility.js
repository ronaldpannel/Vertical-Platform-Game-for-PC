function collision({ object1, object2 }) {
  return (
    object1.pos.y + object1.height >= object2.pos.y &&
    object1.pos.y <= object2.pos.y + object2.height &&
    object1.pos.x <= object2.pos.x + object2.width &&
    object1.pos.x + object1.width >= object2.pos.x
  );
}

function platformCollision({ object1, object2 }) {
  return (
    object1.pos.y + object1.height >= object2.pos.y &&
    object1.pos.y + object1.height <= object2.pos.y + object2.height &&
    object1.pos.x <= object2.pos.x + object2.width &&
    object1.pos.x + object1.width >= object2.pos.x
  );
}
