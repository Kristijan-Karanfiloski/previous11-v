/**
{
     *      photo string
            name string
     *      position: [
     *          0 - role
     *          1 - position
     *      ]
     *      role string
     *      email string
     *      tag string
     *      birthday date
     *      height string
     *      weight string
     *      contacts : {
     *          startingDate
     *          email
     *          phone
     *          emergencyContact
     *      }
     * }
 */

import { Player } from '../../types';

export const playerConverter = {
  toFirestore: function (player: Player) {
    // delete undefined fields
    Object.keys(player).forEach((key) => {
      if (player[key as keyof Player] === undefined) {
        delete player[key as keyof Player];
      }
    });
    return {
      ...player
    };
  },
  fromFirestore: function (data: Partial<Player>) {
    const player = data;
    return {
      id: player.id,
      photo: player.photo || null,
      photoUrl: player.photoUrl || null,
      name: player.name,
      role: player.role,
      email: player.email,
      tag: player.tag || '',
      birthday: player.birthday || null,
      height: player.height || null,
      weight: player.weight || null,
      contact: player.contact || null,
      position: player.position || [],
      ppos: player.ppos || '',
      startDate: player.startDate || null,
      phone: player.phone || null,
      tShirtNumber: player.tShirtNumber || null,
      deleted: player.deleted || false
    };
  }
};
