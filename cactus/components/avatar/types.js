export const AvatarTypes = () => ({
  _base: {
    container: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    image: {
      width: 40,
      height: 40,
    },
    badge: {
      width: 10,
      height: 10,
      borderRadius: 7.5,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: -2,
      right: -2,
    },
    badgeText: {
      backgroundColor: 'transparent',
      fontSize: 9,
    },
  },
  big: {
    image: {
      width: 110,
      height: 110,
      borderRadius: 55,
      marginBottom: 19,
    },
    container: {
      flexDirection: 'column',
    },
  },
  medium: {
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
  },
  small: {
    image: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
  },
  circle: {
    image: {
      borderRadius: 20,
    },
  },
});
