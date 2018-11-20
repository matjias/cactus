export const PlanViewTypes = (theme) => ({
    _base: {
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
      },
      section: {
        // justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
      },
      icon: {
        paddingVertical: 40,
      },
      label: {
        marginLeft: 8,
        alignSelf: 'flex-end',
      },
      task:{
          backgroundColor:'transparent',
          outlineWidth: 0
  
      },
    },
    leftAligned: {
      section: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      },
      label: {
        color: theme.colors.text.inverse,
      },
      icon: {
        color: theme.colors.text.inverse,
      },
    },
    space: {
      container: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      },
      section: {
        flex: -1,
      },
    },
  });
  