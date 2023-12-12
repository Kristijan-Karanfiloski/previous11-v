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

export interface userProfileFirestoreProps {
  name: string;
  email: string;
  onboarding_showed?: boolean;
  phone?: string;
  photoUrl?: string;
  photo?: any;
  role?: any;
  userType?: string;
}

export const userConverter = {
  toFirestore: function (user: userProfileFirestoreProps) {
    return {
      ...user
    };
  },
  fromFirestore: function (
    snapshot: { data: (arg0: any) => any },
    options?: any
  ): userProfileFirestoreProps {
    const data = snapshot.data(options);
    return {
      photo: data.photo,
      role: data.role,
      email: data.email,
      name: data.name,
      phone: data.phone,
      photoUrl: data.photoUrl,
      onboarding_showed: data.onboarding_showed
    };
  }
};
