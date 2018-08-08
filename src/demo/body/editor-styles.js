const styles = theme => ({
  'root': {
    '& $ctr': {
      'borderStyle': 'solid',
      'borderWidth': 1,
      'borderColor': theme.palette.grey[500],
      'borderRadius': '5px',
      'flexDirection': 'column',
      'display': 'flex',
      '&$invalid': {
        '& $icon': {
          color: 'red',
        },
      },
      '& $icon': {
        color: 'green',
      },
      '& >div:first-child': {
        'display': 'flex',
        'alignItems': 'center',
        'borderBottomStyle': 'solid',
        'borderBottomWidth': 1,
        'borderColor': theme.palette.grey[500],
        'backgroundColor': theme.palette.grey[300],
      },
    },
  },

  'icon': {
    fontSize: '80%',
    marginLeft: theme.spacing.unit * 2,
  },
  'title': {
    'marginLeft': theme.spacing.unit * 2,
  },
  'invalid': {

  },
  'ctr': {},
});

export default styles;
