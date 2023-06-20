export class PTTRPGActor extends Actor {


  prepareData() {
    super.prepareData();
  }

  prepareBaseData() {
  }

  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.pttrpg || {};

    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    const systemData = actorData.system;

    for (let [key, ability] of Object.entries(systemData.abilities)) {
      ability.mod = (ability.value);
    }
  }

  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = (systemData.cr * systemData.cr) * 100;
  }
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  _getCharacterRollData(data) {
    if (this.type !== 'character') return;
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

}