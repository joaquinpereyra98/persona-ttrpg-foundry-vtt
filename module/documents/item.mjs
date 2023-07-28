/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class PTTRPGItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
   getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    // Grab the item's system data as well.
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;
    const typeRoll = this.system.typeRoll.toLowerCase();
    if(item.type=='move') {
      if(typeRoll == 'custom') {
        let r =new Roll("@item.formula + @item.rollModf", this.getRollData());
        r.toMessage({
          speaker: speaker,
          rollMode: rollMode,
          flavor: label,
        });
        return r;
      }
      else {
        let r = new Roll(`2d6 + @${typeRoll}.value + @item.rollModf`, this.getRollData());
        await r.roll({async: true});
        if(r.total>=10)
          ChatMessage.create({
            speaker: speaker,
            rollMode: rollMode,
            flavor: label,
            content: item.system.results.success ?? ''
          });
        else if(r.total>=7)
          ChatMessage.create({
            speaker: speaker,
            rollMode: rollMode,
            flavor: label,
            content: item.system.results.partial ?? ''
          });
          else
          ChatMessage.create({
            speaker: speaker,
            rollMode: rollMode,
            flavor: label,
            content: item.system.results.fail ?? ''
          });
        r.toMessage({
          speaker: speaker,
          rollMode: rollMode,
          flavor: `${label}`,
        });
        return r;
      }
    }
    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();
      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.item.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}
