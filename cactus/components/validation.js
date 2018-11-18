const validation = {
name: {
    presence: {
        message: '^Please enter your name',
        allowEmpty: false
    },
},
  
email: {
    presence: {
      message: '^Please enter an email address',
      allowEmpty: false,
    },
    email: {
      message: '^Please enter a valid email address'
    }
  },
  
  password: {
    presence: {
      allowEmpty: false,
      message: '^Please enter a password'
    },
    length: {
      minimum: 6,
      message: '^Your password must be at least 6 characters'
    }
  },
  confirm_password: {
    presence: {
        allowEmpty: false,
        message: '^Please confirm your password'
      },
    equality: {
      attribute:"password",  
      message: "^Password doesn't match"
    },
}
}

export default validation
