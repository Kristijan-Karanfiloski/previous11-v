/**
{
     *      photo string
     *      first_name string
     *      last_name string
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

export interface authFirestoreProps {
  id: string;
  customerName: string;
  email: string;
  teamName: string;
  userType: 'coach' | 'player' | null;
  premium_until?: Date;
  // Only used in Player app to store playerId
  playerId?: string;
  isAdmin?: boolean;
}

export const authConverter = {
  toFirestore: function (data: authFirestoreProps) {
    return {
      ...data
    };
  },
  fromFirestore: function (
    snapshot: { data: (arg0: any) => any },
    options?: any
  ): authFirestoreProps {
    const data = snapshot.data(options);
    return {
      id: data.id,
      email: data.email,
      customerName: data.customerName,
      teamName: data.teamName,
      userType: data.userType,
      premium_until: data.premium_until
    };
  }
};
